// src/pages/VendorDashboard.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Star, LogOut, ExternalLink } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import formatLKR from "@/utils/currency";

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    businessRegistration: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/api/vendor/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  useEffect(() => {
    if (activeTab === "services") {
      api
        .get("/api/vendor/services", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setServices(res.data.services || res.data))
        .catch(() => setServices([]));
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab === "bookings") {
      api
        .get("/api/vendor/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setBookings(res.data.bookings || []))
        .catch(() => setBookings([]));
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab === "settings") {
      api
        .get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) =>
          setProfileForm({
            name: res.data.user.name || "",
            phone: res.data.user.phone || "",
            address: res.data.user.address || "",
            businessRegistration:
              (res.data.user.businessRegistration as any) || "",
          })
        )
        .catch(() => {});
    }
  }, [activeTab, token]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put(
        "/api/vendor/profile",
        { ...profileForm },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update vendor profile", err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handlePostService = () => navigate("/post-service");
  const handleViewAllServices = () => navigate("/services");
  const handleEditService = (id: string) => console.log("Edit service:", id);
  const handleDeleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await api.delete(`/api/vendor/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await api.get("/api/vendor/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data.services || res.data);
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Vendor Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your services, bookings, and earnings
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-4 w-full lg:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {stats ? (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">
                          Total Earnings
                        </p>
                        <p className="text-2xl font-bold">
                          {stats.earnings?.total || 0}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">
                          Total Bookings
                        </p>
                        <p className="text-2xl font-bold">
                          {stats.bookings?.total || 0}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">
                          Services Listed
                        </p>
                        <p className="text-2xl font-bold">
                          {stats.services?.total || 0}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">
                          Packages Listed
                        </p>
                        <p className="text-2xl font-bold">
                          {stats.packages?.total || 0}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <ChartContainer
                    config={{
                      pending: { label: "Pending", color: "hsl(35 90% 60%)" },
                      approved: {
                        label: "Confirmed",
                        color: "hsl(160 70% 45%)",
                      },
                      completed: {
                        label: "Completed",
                        color: "hsl(220 70% 55%)",
                      },
                    }}
                    className="w-full h-64"
                  >
                    <BarChart
                      data={[
                        {
                          name: "Bookings",
                          pending: stats?.bookings?.pending || 0,
                          approved: stats?.bookings?.approved || 0,
                          completed: stats?.bookings?.completed || 0,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="pending" fill="var(--color-pending)" />
                      <Bar dataKey="approved" fill="var(--color-approved)" />
                      <Bar dataKey="completed" fill="var(--color-completed)" />
                    </BarChart>
                  </ChartContainer>
                </div>
              ) : (
                <p>No overview data</p>
              )}
            </TabsContent>

            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Your Services</CardTitle>
                      <CardDescription>
                        Manage your active service listings
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handlePostService}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Post New Service
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleViewAllServices}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" /> View All Services
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {services.length > 0 ? (
                    <div className="space-y-4">
                      {services.map((s) => (
                        <div
                          key={s._id}
                          className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">
                                {s.name || s.title}
                              </h3>
                              <Badge
                                variant={s.isActive ? "default" : "secondary"}
                              >
                                {s.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {s.serviceType || s.serviceCategory}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <p className="font-medium text-green-600">
                                {s.price != null
                                  ? formatLKR(s.price)
                                  : `${formatLKR(s.priceRange?.min)} - ${formatLKR(s.priceRange?.max)}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {typeof s.location === "string"
                                  ? s.location
                                  : `${s.location?.city || ""}${
                                      s.location?.district
                                        ? ", " + s.location.district
                                        : ""
                                    }`}
                              </p>
                              {s.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-sm">{s.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditService(s._id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteService(s._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        No services found.
                      </p>
                      <Button
                        onClick={handlePostService}
                        className="flex items-center gap-2 mx-auto"
                      >
                        <Plus className="w-4 h-4" /> Post Your First Service
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings</CardTitle>
                  <CardDescription>
                    Latest event bookings that include your services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length > 0 ? (
                    bookings.map((b) => (
                      <div
                        key={b._id}
                        className="flex justify-between items-center p-4 border rounded-lg mb-2"
                      >
                        <div>
                          <p className="font-medium">
                            {b.userId?.name || "Customer"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">{b.status}</Badge>
                      </div>
                    ))
                  ) : (
                    <p>No bookings found.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Business Profile</CardTitle>
                  <CardDescription>
                    Update your business information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleSaveProfile}
                    className="space-y-4 max-w-lg"
                  >
                    <div>
                      <label className="block text-sm mb-1">
                        Business / Display Name
                      </label>
                      <Input
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Phone</label>
                      <Input
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Address</label>
                      <Input
                        value={profileForm.address}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Business Registration (optional)
                      </label>
                      <Input
                        value={profileForm.businessRegistration}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            businessRegistration: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button type="submit" disabled={savingProfile}>
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
