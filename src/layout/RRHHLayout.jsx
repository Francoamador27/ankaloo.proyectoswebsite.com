import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UseAuth from "../hooks/useAuth";
import RRHHSidebar from "../components/RRHHSidebar";

const RRHHLayout = () => {
  const { user, error } = UseAuth({ middleware: "auth" });
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.admin !== 1 && user.rol !== "rrhh") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user && !error) return <p>Cargando...</p>;
  if (!user || (user.admin !== 1 && user.rol !== "rrhh")) return null;

  return (
    <div className="admin-layout">
      <RRHHSidebar />
    </div>
  );
};

export default RRHHLayout;
