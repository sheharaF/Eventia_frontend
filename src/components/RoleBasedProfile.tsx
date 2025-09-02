import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/AuthContext"; // ✅ adjust path

const RoleBasedProfileRedirect = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ get user from context

  useEffect(() => {
    if (user?.role === "Vendor") {
      navigate("/vendor/dashboard", { replace: true });
    } else if (user?.role === "Admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  if (user?.role === "User") return <>{children}</>;
  if (!user) return <p className="text-center mt-10">Loading profile...</p>;
  return null; // vendor/admin redirect handled above
};

export default RoleBasedProfileRedirect;
