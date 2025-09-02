import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User as UserIcon,
  ShoppingCart,
  Layers,
  LogOut,
  Trash2,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import api from "@/api/axios";
import {
  checkoutCart,
  getCart,
  removePackageFromCart,
  removeServiceFromCart,
} from "@/api/cart";
import formatLKR from "@/utils/currency";

// --- Types matching backend ---
interface User {
  _id: string;
  name: string;
  email: string;
  role: "User" | "Admin" | "Vendor";
  isApproved: boolean;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Cart {
  _id: string;
  selectedVendors: any[];
  selectedPackages: any[];
  totalCost: number;
}

interface Purchase {
  _id: string;
  eventType?: string;
  status: string;
  createdAt: string;
  selectedVendors: any[];
  selectedPackages: any[];
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Settings form state
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    eventType: "Wedding",
    budget: "",
    guestCount: "",
    preferredLocationCity: "",
    preferredLocationDistrict: "",
    eventDate: "",
    notes: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setForm({
          name: res.data.user.name || "",
          phone: res.data.user.phone || "",
          address: res.data.user.address || "",
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Fetch cart & purchases when tabs change
  useEffect(() => {
    if (activeTab === "cart") {
      getCart()
        .then((res) => setCart(res.cart || res))
        .catch((err) => console.error("Failed to load cart", err));
      // Prefill checkout form from planDetails if available
      try {
        const raw = localStorage.getItem("planDetails");
        if (raw) {
          const pd = JSON.parse(raw || "{}");
          setCheckoutForm((prev) => ({
            ...prev,
            eventType: pd.eventType || prev.eventType || "Wedding",
            preferredLocationCity: pd.location || prev.preferredLocationCity || "",
            // District not provided from landing; user can fill it
            preferredLocationDistrict: prev.preferredLocationDistrict || "",
          }));
        }
      } catch {}
    }
    if (activeTab === "purchases") {
      api
        .get("/api/user/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPurchases(res.data.purchases || []))
        .catch((err) => console.error("Failed to load purchases", err));
    }
  }, [activeTab, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;
    try {
      await api.delete("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      navigate("/register");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete account");
    }
  };

  const handleRemoveService = async (serviceId: string, vendorId?: string) => {
    try {
      const vId = vendorId || "";
      await removeServiceFromCart(serviceId, vId);
      const res = await getCart();
      setCart(res.cart || res);
    } catch (err) {
      console.error("Failed to remove service from cart", err);
    }
  };

  const handleRemovePackage = async (packageId: string, vendorId?: string) => {
    try {
      const vId = vendorId || "";
      await removePackageFromCart(packageId, vId);
      const res = await getCart();
      setCart(res.cart || res);
    } catch (err) {
      console.error("Failed to remove package from cart", err);
    }
  };

  const handleCheckout = async () => {
    try {
      if (!checkoutForm.eventType || !checkoutForm.eventDate || !checkoutForm.preferredLocationCity || !checkoutForm.preferredLocationDistrict) {
        alert("Please fill event type, location city & district, and event date.");
        return;
      }
      const payload = {
        eventType: checkoutForm.eventType,
        budget: Number(checkoutForm.budget || 0),
        guestCount: Number(checkoutForm.guestCount || 0),
        preferredLocation: {
          city: checkoutForm.preferredLocationCity,
          district: checkoutForm.preferredLocationDistrict,
        },
        eventDate: checkoutForm.eventDate,
        notes: checkoutForm.notes || undefined,
      };
      await checkoutCart(payload);
      // Refresh cart and switch to bookings
      const res = await getCart();
      setCart(res.cart || res);
      setActiveTab("purchases");
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Checkout failed. Please try again.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(
        "/api/user/profile",
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="container mx-auto px-4 lg:px-8 space-y-8">
        <h1 className="text-3xl font-bold">My Account</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex flex-wrap gap-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="cart">Cart</TabsTrigger>
            <TabsTrigger value="purchases">Bookings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Info */}
          <TabsContent value="profile">
            {user ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-primary" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <span className="font-medium">Name:</span> {user.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  {user.phone && (
                    <p>
                      <span className="font-medium">Phone:</span> {user.phone}
                    </p>
                  )}
                  {user.address && (
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {user.address}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Role:</span> {user.role}
                  </p>
                  {user.role === "Vendor" && (
                    <p>
                      <span className="font-medium">Approval Status:</span>{" "}
                      <Badge
                        variant={user.isApproved ? "default" : "secondary"}
                      >
                        {user.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <p>No profile data found.</p>
            )}
          </TabsContent>

          {/* Cart */}
          <TabsContent value="cart">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                  My Event Cart
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart ? (
                  <div className="space-y-6">
                    <div>
                      <p className="font-semibold mb-2">Services</p>
                      {cart.selectedVendors?.length ? (
                        cart.selectedVendors.map((v: any, idx: number) => (
                          <div
                            key={v.serviceId?._id || v.serviceId || idx}
                            className="flex items-center justify-between p-3 border rounded mb-2"
                          >
                            <div>
                              <p className="font-medium">
                              {v.serviceId?.title || v.serviceId?.name || "Service"}
                            </p>
                              {v.price && (
                                <p className="text-sm text-muted-foreground">{formatLKR(v.price)}</p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveService(v.serviceId?._id || v.serviceId, (v.vendorId as any)?._id || v.vendorId)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No services in cart.</p>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold mb-2">Packages</p>
                      {cart.selectedPackages?.length ? (
                        cart.selectedPackages.map((p: any, idx: number) => (
                          <div
                            key={p.packageId?._id || p.packageId || idx}
                            className="flex items-center justify-between p-3 border rounded mb-2"
                          >
                            <div>
                              <p className="font-medium">
                              {p.packageId?.title || p.packageId?.name || "Package"}
                            </p>
                              {p.price && (
                                <p className="text-sm text-muted-foreground">{formatLKR(p.price)}</p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemovePackage(p.packageId?._id || p.packageId, (p.vendorId as any)?._id || p.vendorId)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No packages in cart.</p>
                      )}
                    </div>

                    <div className="space-y-3 border-t pt-4">
                      <p className="font-semibold">Event Details</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select
                          className="border rounded px-3 py-2 bg-background"
                          value={checkoutForm.eventType}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, eventType: e.target.value })}
                        >
                          <option value="Wedding">Wedding</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Corporate">Corporate</option>
                          <option value="Anniversary">Anniversary</option>
                          <option value="Other">Other</option>
                        </select>
                        <Input
                          placeholder="Preferred City"
                          value={checkoutForm.preferredLocationCity}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, preferredLocationCity: e.target.value })}
                        />
                        <Input
                          placeholder="Preferred District"
                          value={checkoutForm.preferredLocationDistrict}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, preferredLocationDistrict: e.target.value })}
                        />
                        <Input
                          type="date"
                          placeholder="Event Date"
                          value={checkoutForm.eventDate}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, eventDate: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Budget"
                          value={checkoutForm.budget}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, budget: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Guest Count"
                          value={checkoutForm.guestCount}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, guestCount: e.target.value })}
                        />
                        <Input
                          placeholder="Notes (optional)"
                          value={checkoutForm.notes}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <p>
                          <span className="font-medium">Total Cost:</span> {formatLKR(cart.totalCost || 0)}
                        </p>
                        <Button onClick={handleCheckout}>Checkout</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No active cart found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Purchases */}
          <TabsContent value="purchases">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-6 h-6 text-primary" />
                  My Bookings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {purchases.length > 0 ? (
                  purchases.map((purchase) => (
                    <div
                      key={purchase._id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <p className="font-semibold">
                        {purchase.eventType || "Event Plan"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {purchase.status}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date:{" "}
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {purchase.selectedVendors?.map(
                          (vendor: any, idx: number) => (
                            <Badge key={idx} variant="outline">
                              {vendor.serviceId?.title || "Service"}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>You have no bookings yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6 text-primary" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
                  <Input
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
