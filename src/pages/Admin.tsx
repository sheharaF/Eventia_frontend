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
import { Loader2, Users, Briefcase, Layers, LogOut, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  // Removed eventPlans per pruned routes
  const [error, setError] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorStatus, setVendorStatus] = useState<string>("all"); // all | pending | approved

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch dashboard summary
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboard(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Fetch vendors
  const fetchVendors = async (opts?: { status?: string; search?: string }) => {
    try {
      const status = opts?.status ?? vendorStatus;
      const search = opts?.search ?? vendorSearch;
      const res = await api.get("/api/admin/vendors", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: search || undefined,
          status: status && status !== "all" ? status : undefined,
          page: 1,
          limit: 20,
        },
      });
      setVendors(res.data.vendors);
    } catch (err) {
      console.error(err);
    }
  };

  // Approve/Reject vendor
  const handleVendorApproval = async (id: string, approve: boolean) => {
    try {
      await api.put(
        `/api/admin/vendors/${id}/approve`,
        { approve },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchVendors();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm("Delete this vendor? This may be blocked if they have listings/bookings.")) return;
    try {
      await api.delete(`/api/admin/vendors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVendors();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to delete vendor");
    }
  };

  // Fetch services
  const fetchServices = async () => {
    try {
      const res = await api.get("/api/admin/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data.services);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle service active status
  const handleServiceToggle = async (id: string, active: boolean) => {
    try {
      await api.put(
        `/api/admin/services/${id}/toggle`,
        { active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  // Event plans route removed from mounting

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: userSearch || undefined, page: 1, limit: 20 },
      });
      const data = res.data?.users || res.data;
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Delete this user? This may be blocked if they have bookings.")) return;
    try {
      await api.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to delete user");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage users, vendors, event plans, and services
                </p>
              </div>
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>

              <Tabs
                value={activeTab}
                onValueChange={(val) => {
                  setActiveTab(val);
                  if (val === "vendors") fetchVendors();
                  if (val === "services") fetchServices();
                  if (val === "users") fetchUsers();
                }}
                className="space-y-6"
              >
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="space-y-6">
                {dashboard && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="card-luxury">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total Users
                            </p>
                            <p className="text-3xl font-bold">
                              {dashboard.users.total}
                            </p>
                          </div>
                          <Users className="w-8 h-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="card-luxury">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Vendors
                            </p>
                            <p className="text-3xl font-bold">
                              {dashboard.users.vendors.total}
                            </p>
                          </div>
                          <Briefcase className="w-8 h-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Event plans card removed per pruned routes */}

                    <Card className="card-luxury">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Services
                            </p>
                            <p className="text-3xl font-bold">
                              {dashboard.services.total}
                            </p>
                          </div>
                          <Layers className="w-8 h-8 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Vendors */}
              <TabsContent value="vendors" className="space-y-6">
                <Card className="card-luxury">
                  <CardHeader>
                    <CardTitle>Vendors</CardTitle>
                    <CardDescription>Approve, search and manage vendors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3 mb-4 items-center">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search vendors..."
                          className="pl-9"
                          value={vendorSearch}
                          onChange={(e) => setVendorSearch(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && fetchVendors()}
                        />
                      </div>
                      <Select
                        value={vendorStatus}
                        onValueChange={(v) => {
                          setVendorStatus(v);
                          fetchVendors({ status: v });
                        }}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" onClick={() => fetchVendors()}>Search</Button>
                    </div>
                    <div className="space-y-4">
                      {vendors.map((vendor) => (
                        <div
                          key={vendor._id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">{vendor.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {vendor.email}
                            </p>
                            <Badge variant={vendor.isApproved ? "default" : "secondary"}>
                              {vendor.isApproved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            {!vendor.isApproved ? (
                              <Button size="sm" onClick={() => handleVendorApproval(vendor._id, true)}>
                                Approve
                              </Button>
                            ) : (
                              <Button size="sm" variant="secondary" onClick={() => handleVendorApproval(vendor._id, false)}>
                                Reject
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteVendor(vendor._id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users */}
              <TabsContent value="users" className="space-y-6">
                <Card className="card-luxury">
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>List and manage user accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3 mb-4 items-center">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          className="pl-9"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                        />
                      </div>
                      <Button variant="outline" onClick={fetchUsers}>Search</Button>
                    </div>
                    <div className="space-y-4">
                      {users.map((u) => (
                        <div key={u._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">{u.name}</p>
                            <p className="text-sm text-muted-foreground">{u.email}</p>
                          </div>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services */}
              <TabsContent value="services" className="space-y-6">
                <Card className="card-luxury">
                  <CardHeader>
                    <CardTitle>Services</CardTitle>
                    <CardDescription>
                      Manage vendor service listings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {services.map((service) => (
                        <div
                          key={service._id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">{service.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {service.vendorId?.name} (
                              {service.vendorId?.email})
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant={
                                service.isActive ? "default" : "secondary"
                              }
                            >
                              {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleServiceToggle(
                                  service._id,
                                  !service.isActive
                                )
                              }
                            >
                              {service.isActive ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
