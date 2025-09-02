// src/pages/VendorPostService.tsx
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PostType = "service" | "package";

const VendorPostService: React.FC = () => {
  const [postType, setPostType] = useState<PostType>("service");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<any>({
    title: "",
    eventType: "",
    serviceCategory: "",
    description: "",
    minPrice: 0,
    maxPrice: 0,
    price: 0,
    city: "",
    district: "",
    capacity: 0,
    images: [] as File[],
  });

  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [requiredServices, setRequiredServices] = useState<string[]>([]);
  const [optionalServices, setOptionalServices] = useState<string[]>([]);
  const [packageServices, setPackageServices] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/event-services");
        setEventTypes(res.data?.eventTypes || res.data || []);
      } catch {
        setEventTypes(["Wedding", "Birthday", "Corporate", "Anniversary", "Other"]);
      }
    })();
  }, []);

  useEffect(() => {
    if (!formData.eventType) {
      setRequiredServices([]);
      setOptionalServices([]);
      setPackageServices([]);
      setFormData((prev: any) => ({ ...prev, serviceCategory: "" }));
      return;
    }
    (async () => {
      try {
        const res = await api.get(`/api/event-services/${encodeURIComponent(formData.eventType)}`);
        const req = res.data?.required || [];
        const opt = res.data?.optional || [];
        setRequiredServices(req);
        setOptionalServices(opt);
        setPackageServices(req);
        const all = [...req, ...opt];
        setFormData((prev: any) => ({
          ...prev,
          serviceCategory: all.includes(prev.serviceCategory) ? prev.serviceCategory : "",
        }));
      } catch {
        setRequiredServices([]);
        setOptionalServices([]);
      }
    })();
  }, [formData.eventType]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (["minPrice", "maxPrice", "price", "capacity"].includes(name)) {
      setFormData((prev: any) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setFormData((prev: any) => ({ ...prev, images: files }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload: any = {};

      if (postType === "service") {
        // Build payload as per backend `/api/vendor/post` (service)
        payload = {
          type: "service",
          title: formData.title?.trim(),
          description: formData.description?.trim(),
          eventType: formData.eventType || "Other",
          serviceCategory: formData.serviceCategory,
          location: {
            city: formData.city?.trim(),
            district: formData.district?.trim(),
          },
          capacity: Number(formData.capacity),
          availableDates: [],
          images: [],
          isActive: true,
          priceRange: {
            min: Number(formData.minPrice),
            max: Number(formData.maxPrice),
          },
        };
      }

      if (postType === "package") {
        const servicesArray = packageServices;

        // Build payload as per backend `/api/vendor/post` (package)
        payload = {
          type: "package",
          title: formData.title?.trim(),
          description: formData.description?.trim(),
          eventType: formData.eventType || "Other",
          services: servicesArray,
          location: {
            city: formData.city?.trim(),
            district: formData.district?.trim(),
          },
          capacity: Number(formData.capacity),
          price: Number(formData.price || 0),
          availableDates: [],
          images: [],
          isActive: true,
        };
      }

      // Minimal client-side validation; server validates specifics
      if (!payload.type || !payload.title || !payload.description) {
        throw {
          response: {
            data: { error: "type, title and description are required" },
          },
        };
      }

      // Build multipart/form-data
      const form = new FormData();
      form.append("type", payload.type);
      form.append("title", payload.title);
      form.append("description", payload.description);
      form.append("eventType", payload.eventType);
      if (payload.isActive !== undefined) form.append("isActive", String(payload.isActive));
      // Common structured fields
      form.append("location", JSON.stringify(payload.location));
      if (payload.capacity != null) form.append("capacity", String(payload.capacity));
      form.append("availableDates", JSON.stringify(payload.availableDates || []));

      if (payload.type === "service") {
        form.append("serviceCategory", payload.serviceCategory);
        form.append("priceRange", JSON.stringify(payload.priceRange));
      } else if (payload.type === "package") {
        form.append("price", String(payload.price || 0));
        form.append("services", JSON.stringify(payload.services || []));
      }

      // Append images
      (formData.images || []).forEach((file: File) => {
        form.append("images", file);
      });

      await api.post("/api/vendor/post", form);

      toast({
        title: "Success!",
        description: `${
          postType === "service" ? "Service" : "Package"
        } posted successfully!`,
      });

      setFormData({
        title: "",
        eventType: "",
        serviceCategory: "",
        description: "",
        minPrice: 0,
        maxPrice: 0,
        price: 0,
        city: "",
        district: "",
        capacity: 0,
        images: [],
      });
      setPackageServices([]);

      setTimeout(() => {
        navigate("/vendor/dashboard");
      }, 800);
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to post. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/vendor/dashboard")}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">
            Post Your {postType === "service" ? "Service" : "Package"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Create a new listing to showcase your offerings to potential clients
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Listing</CardTitle>
            <CardDescription>
              Choose what type of listing you want to create
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={postType}
              onValueChange={(value) => setPostType(value as PostType)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="service">Service</TabsTrigger>
                <TabsTrigger value="package">Package</TabsTrigger>
              </TabsList>

              {/* Service Form */}
              <TabsContent value="service" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Label>Event Type *</Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) =>
                      setFormData((prev: any) => ({ ...prev, eventType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((et) => (
                        <SelectItem key={et} value={et}>
                          {et}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label>Service Title *</Label>
                  <Input
                    name="title"
                    placeholder="e.g., Professional Wedding Photography"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />

                  <Label>Service Category *</Label>
                  <Select
                    value={formData.serviceCategory}
                    onValueChange={(value) =>
                      handleSelectChange("serviceCategory", value)
                    }
                    disabled={!formData.eventType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        formData.eventType ? "Select Service Category" : "Select event type first"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {requiredServices.length > 0 && (
                        <div className="px-2 py-1 text-xs text-muted-foreground">
                          Required
                        </div>
                      )}
                      {requiredServices.map((name) => (
                        <SelectItem key={`req-${name}`} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                      {optionalServices.length > 0 && (
                        <div className="px-2 py-1 text-xs text-muted-foreground">
                          Optional
                        </div>
                      )}
                      {optionalServices.map((name) => (
                        <SelectItem key={`opt-${name}`} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Label>Description *</Label>
                  <Textarea
                    name="description"
                    placeholder="Describe your service..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Minimum Price *</Label>
                      <Input
                        name="minPrice"
                        type="number"
                        value={formData.minPrice}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <Label>Maximum Price *</Label>
                      <Input
                        name="maxPrice"
                        type="number"
                        value={formData.maxPrice}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>City *</Label>
                      <Input
                        name="city"
                        placeholder="e.g., Colombo"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label>District *</Label>
                      <Input
                        name="district"
                        placeholder="e.g., Western"
                        value={formData.district}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <Label>Capacity *</Label>
                  <Input
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    required
                  />

                  <Label>Service Images</Label>
                  <Input
                    type="file"
                    name="images"
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Posting..." : "Post Service"}
                  </Button>
                </form>
              </TabsContent>

              {/* Package Form */}
              <TabsContent value="package" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Label>Event Type *</Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value) =>
                      setFormData((prev: any) => ({ ...prev, eventType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((et) => (
                        <SelectItem key={et} value={et}>
                          {et}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label>Package Title *</Label>
                  <Input
                    name="title"
                    placeholder="e.g., Complete Wedding Package"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />

                  <Label>Package Description *</Label>
                  <Textarea
                    name="description"
                    placeholder="Describe package details..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />

                  <Label>Included Services *</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="outline" className="w-full justify-between" disabled={!formData.eventType}>
                        {packageServices.length > 0
                          ? `${packageServices.length} selected`
                          : formData.eventType
                          ? "Select Included Services"
                          : "Select event type first"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72">
                      <DropdownMenuLabel>Required</DropdownMenuLabel>
                      {requiredServices.length === 0 && (
                        <DropdownMenuCheckboxItem checked={false} disabled>
                          None
                        </DropdownMenuCheckboxItem>
                      )}
                      {requiredServices.map((name) => (
                        <DropdownMenuCheckboxItem
                          key={`pkg-req-${name}`}
                          checked={packageServices.includes(name)}
                          onCheckedChange={(checked) => {
                            setPackageServices((prev) =>
                              checked
                                ? Array.from(new Set([...prev, name]))
                                : prev.filter((n) => n !== name)
                            );
                          }}
                        >
                          {name}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Optional</DropdownMenuLabel>
                      {optionalServices.length === 0 && (
                        <DropdownMenuCheckboxItem checked={false} disabled>
                          None
                        </DropdownMenuCheckboxItem>
                      )}
                      {optionalServices.map((name) => (
                        <DropdownMenuCheckboxItem
                          key={`pkg-opt-${name}`}
                          checked={packageServices.includes(name)}
                          onCheckedChange={(checked) => {
                            setPackageServices((prev) =>
                              checked
                                ? Array.from(new Set([...prev, name]))
                                : prev.filter((n) => n !== name)
                            );
                          }}
                        >
                          {name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Package Price *</Label>
                      <Input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <Label>Capacity *</Label>
                      <Input
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>City *</Label>
                      <Input
                        name="city"
                        placeholder="e.g., Kathmandu"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label>District *</Label>
                      <Input
                        name="district"
                        placeholder="e.g., Bagmati"
                        value={formData.district}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <Label>Package Images</Label>
                  <Input
                    type="file"
                    name="images"
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Posting..." : "Post Package"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorPostService;
