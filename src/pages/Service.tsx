// src/pages/ServicePage.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, MapPin, Search, ShoppingCart } from "lucide-react";
import api from "@/api/axios";
import { Service } from "@/types/services";
import { useToast } from "@/hooks/use-toast";
import { addServiceToCart } from "@/api/cart";
import { useSearchParams } from "react-router-dom";
import formatLKR from "@/utils/currency";

const ServicePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const { toast } = useToast();

  const [searchParams] = useSearchParams();

  // Load services with optional server-side filters from query params
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: any = {};
        const eventType = searchParams.get("eventType");
        const serviceCategory = searchParams.get("serviceCategory");
        const location = searchParams.get("location");
        if (eventType) params.eventType = eventType;
        if (serviceCategory) params.serviceCategory = serviceCategory;
        if (location) params.location = location;

        const servicesRes = await api.get("/api/services", { params });
        setServices(servicesRes.data.services || servicesRes.data);

        if (serviceCategory) setSelectedCategory(serviceCategory);
      } catch (err) {
        console.error("Error fetching services:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // Filter data based on search and filters
  const filteredServices = services.filter((service) => {
    const title = (service.name || service.title || "").toLowerCase();
    const desc = (service.description || "").toLowerCase();
    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      desc.includes(searchTerm.toLowerCase());
    const category = service.serviceType || service.serviceCategory;
    const matchesCategory =
      selectedCategory === "all" || category === selectedCategory;
    const price = service.price ?? service.priceRange?.min ?? 0;
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && price < 100000) ||
      (priceRange === "medium" && price >= 100000 && price < 500000) ||
      (priceRange === "high" && price >= 500000);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleContactVendor = (vendorId: string) => {
    console.log("Contact vendor:", vendorId);
  };

  const handleBookService = (serviceId: string) => {
    // Placeholder: could route to a detail page or quick add+go to cart
    handleAddToCart(serviceId);
  };

  const handleAddToCart = async (serviceId: string) => {
    try {
      const service = services.find((s) => s._id === serviceId);
      const vendorId = (service?.vendorId as any)?._id || "";
      const price = service?.price ?? service?.priceRange?.min ?? 0;
      if (!vendorId || price == null)
        throw new Error("Missing vendor or price");
      await addServiceToCart(serviceId, vendorId, Number(price), 1);
      toast({
        title: "Added to cart",
        description: "Service added successfully.",
      });
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to add to cart";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Discover Amazing Services</h1>
        <p className="text-xl text-muted-foreground">
          Find the perfect vendors for your next event
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {/* Price filter moved below with LKR ranges */}
        </div>

        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Service Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="catering">Catering</SelectItem>
              <SelectItem value="photography">Photography</SelectItem>
              <SelectItem value="decor">Decoration</SelectItem>
              <SelectItem value="venue">Venue</SelectItem>
              <SelectItem value="music">Music & Entertainment</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="planning">Event Planning</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="low">Under LKR 100,000</SelectItem>
              <SelectItem value="medium">LKR 100,000 - LKR 500,000</SelectItem>
              <SelectItem value="high">Over LKR 500,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const img = (service as any)?.images?.[0] || (service as any)?.image;
          const src = img
            ? img.startsWith("http")
              ? img
              : `${(api.defaults as any).baseURL || ""}${img}`
            : null;
          return (
          <Card key={service._id} className="hover:shadow-lg transition-shadow">
            {src && (
              <img
                src={src}
                alt={(service.name || service.title || "Service") as string}
                className="w-full h-40 object-cover"
              />
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {service.name || service.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      {service.serviceType || service.serviceCategory}
                    </Badge>
                    {service.vendorId?.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">
                          {service.vendorId.rating}
                        </span>
                      </div>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {service.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {typeof service.location === "string"
                      ? service.location
                      : `${service.location?.city || ""}${
                          service.location?.district
                            ? ", " + service.location.district
                            : ""
                        }`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-lg text-green-600">
                    {service.price != null
                      ? formatLKR(service.price)
                      : `${formatLKR(service.priceRange?.min)} - ${formatLKR(service.priceRange?.max)}`}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBookService(service._id!)}
                  className="flex-1"
                >
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAddToCart(service._id!)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleContactVendor(service.vendorId?._id!)}
                >
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        );})}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No services found matching your criteria.
          </p>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicePage;
