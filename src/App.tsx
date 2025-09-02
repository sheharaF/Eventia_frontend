import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PlanEvent from "./pages/PlanEvent";
import VendorDashboard from "./pages/VendorDashboard";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Admin from "./pages/Admin";
import UserProfile from "./pages/UserProfile";
import RoleBasedProfileRedirect from "./components/RoleBasedProfile";
import ServicePage from "./pages/Service";
import VendorPostService from "./pages/VendorPostService";
import PackagesPage from "./pages/Packages";
import ProtectedRoute from "./components/ProtectedRoute";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ✅ Wrap all "public" pages inside Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="about" element={<About />} />
            <Route path="plan-event" element={<PlanEvent />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="services" element={<ServicePage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="contact" element={<Contact />} />

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />

            {/* Protected Vendor Routes */}
            <Route
              path="/vendor/dashboard"
              element={
                <ProtectedRoute role="Vendor">
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/post-service"
              element={
                <ProtectedRoute role="Vendor">
                  <VendorPostService />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="Admin">
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* Protected User Profile Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <RoleBasedProfileRedirect>
                    <UserProfile />
                  </RoleBasedProfileRedirect>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
