// src/pages/Packages.tsx
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
import { MapPin, Search, ShoppingCart } from "lucide-react";
import api from "@/api/axios";
import { Package as Pkg } from "@/types/services";
import formatLKR from "@/utils/currency";
import { useToast } from "@/hooks/use-toast";
import { addPackageToCart } from "@/api/cart";
import { useSearchParams } from "react-router-dom";

const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const { toast } = useToast();
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrev, setHasPrev] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const eventType = searchParams.get("eventType");
        const params: any = { page, limit };
        if (eventType) params.eventType = eventType;
        const res = await api.get("/api/packages", { params });
        const data = res.data;
        const list = data.packages || data;
        setPackages(list);
        if (data.pagination) {
          setHasNext(Boolean(data.pagination.hasNext));
          setHasPrev(Boolean(data.pagination.hasPrev));
          setTotalPages(data.pagination.totalPages || 1);
        } else {
          // If no pagination block (fallback), infer simple values
          setHasNext(false);
          setHasPrev(page > 1);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Error fetching packages:", err);
        setPackages([]);
        setHasNext(false);
        setHasPrev(page > 1);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams, page, limit]);

  const filtered = packages.filter((pkg) => {
    const title = (pkg.name || pkg.title || "").toLowerCase();
    const desc = (pkg.description || "").toLowerCase();
    const matchesSearch =
      title.includes(searchTerm.toLowerCase()) ||
      desc.includes(searchTerm.toLowerCase());
    const price = pkg.price ?? 0;
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && price < 100000) ||
      (priceRange === "medium" && price >= 100000 && price < 500000) ||
      (priceRange === "high" && price >= 500000);
    return matchesSearch && matchesPrice;
  });

  const handleAddToCart = async (pkg: Pkg) => {
    try {
      const packageId = pkg._id as string;
      const vendorId = (pkg.vendorId as any)?._id || "";
      const price = Number(pkg.price || 0);
      if (!packageId || !vendorId)
        throw new Error("Missing package or vendor id");
      await addPackageToCart(packageId, vendorId, price, 1);
      toast({
        title: "Added to cart",
        description: "Package added successfully.",
      });
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to add to cart";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Explore Event Packages</h1>
        {searchParams.get("eventType") && (
          <p className="text-sm text-muted-foreground">
            Filtered by event type: {searchParams.get("eventType")}
          </p>
        )}
        <p className="text-xl text-muted-foreground">
          Bundled services crafted for your event
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
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
        {filtered.map((pkg) => {
          const img = (pkg as any)?.images?.[0] || (pkg as any)?.image;
          const src = img
            ? img.startsWith("http")
              ? img
              : `${(api.defaults as any).baseURL || ""}${img}`
            : null;
          return (
            <Card key={pkg._id} className="hover:shadow-lg transition-shadow">
              {src && (
                <img
                  src={src}
                  alt={(pkg.name || pkg.title || "Package") as string}
                  className="w-full h-40 object-cover"
                />
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {pkg.name || pkg.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      {pkg.vendorId && (
                        <Badge variant="secondary">
                          Vendor: {(pkg.vendorId as any)?.name}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {pkg.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {typeof pkg.location === "string"
                        ? pkg.location
                        : `${(pkg.location as any)?.city || ""}${
                            (pkg.location as any)?.district
                              ? ", " + (pkg.location as any).district
                              : ""
                          }`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-lg text-green-600">
                      {formatLKR(pkg.price as number)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(pkg)}
                    className="flex-1"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No packages found.</p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          disabled={!hasPrev}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={!hasNext}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PackagesPage;
