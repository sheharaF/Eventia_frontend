import api from "./axios";

export const addServiceToCart = async (
  serviceId: string,
  vendorId: string,
  price: number,
  quantity = 1
) => {
  const { data } = await api.post(
    "/api/user/cart/services",
    { serviceId, vendorId, price, quantity },
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
};

export const addPackageToCart = async (
  packageId: string,
  vendorId: string,
  price: number,
  quantity = 1
) => {
  const { data } = await api.post(
    "/api/user/cart/packages",
    { packageId, vendorId, price, quantity },
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
};

export const getCart = async () => {
  const { data } = await api.get("/api/user/cart");
  return data;
};

export const removeServiceFromCart = async (
  serviceId: string,
  vendorId: string
) => {
  const { data } = await api.delete(
    `/api/user/cart/services/${serviceId}?vendorId=${encodeURIComponent(vendorId)}`
  );
  return data;
};

export const removePackageFromCart = async (
  packageId: string,
  vendorId: string
) => {
  const { data } = await api.delete(
    `/api/user/cart/packages/${packageId}?vendorId=${encodeURIComponent(vendorId)}`
  );
  return data;
};

export const checkoutCart = async (details: {
  eventType: "Wedding" | "Birthday" | "Corporate" | "Anniversary" | "Other";
  budget: number;
  guestCount: number;
  preferredLocation: { city: string; district: string };
  eventDate: string; // ISO string or yyyy-mm-dd
  notes?: string;
}) => {
  const { data } = await api.post(
    "/api/user/cart/checkout",
    { ...details },
    { headers: { "Content-Type": "application/json" } }
  );
  return data;
};

export default {
  addServiceToCart,
  addPackageToCart,
  getCart,
  removeServiceFromCart,
  removePackageFromCart,
  checkoutCart,
};
