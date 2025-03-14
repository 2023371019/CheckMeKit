import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Nosotros from "./components/Nosotros";
import Login from "./components/Login/Login";
import DoctorPage from "./components/Doctor/Doctor";
import PatientPage from "./components/Paciente/Paciente";
import Compra from "./components/Paciente/Compra";
import DatosMedicos from "./components/Doctor/DatosMedicos";
import Mensajeria from "./components/Doctor/Mensajeria";
import ReportesMedicos from "./components/Doctor/ReportesMedicos";

// Panel de Administración (Doctor)
import AdminDashboard from "./components/Doctor/AdminDashboard";
import AdminProductos from "./components/Doctor/AdminProductos";
import AdminReportes from "./components/Doctor/AdminReportes";
import ReporteVentas from "./components/Doctor/ReporteVentas";
import ReporteUsuarios from "./components/Doctor/ReporteUsuarios";

/** Middleware de Autenticación SOLO para PACIENTES */
const ProtectedPatientRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const userId = localStorage.getItem("userId");
  const sessionToken = sessionStorage.getItem("sessionToken");

  useEffect(() => {
    const validateSession = async () => {
      if (!userId || !sessionToken) {
        console.warn("⛔ Falta userId o sessionToken, redirigiendo a login.");
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/validateSession", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_usuario: userId, sessionToken }),
        });

        const data = await response.json();

        if (data.success) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("userId");
          sessionStorage.removeItem("sessionToken");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("❌ Error validando sesión:", error);
        setIsAuthenticated(false);
      }
    };

    validateSession();
  }, [userId, sessionToken]);

  if (isAuthenticated === null) {
    return <p>Cargando sesión...</p>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

/** Middleware de Autenticación SOLO para DOCTOR */
const ProtectedDoctorRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const doctorId = localStorage.getItem("doctorId");
  const doctorSessionToken = sessionStorage.getItem("doctorSessionToken");

  useEffect(() => {
    const validateDoctorSession = async () => {
      if (!doctorId || !doctorSessionToken) {
        console.warn("⛔ Falta doctorId o doctorSessionToken, redirigiendo a login.");
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/validateDoctorSession", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_doctor: doctorId, sessionToken: doctorSessionToken }),
        });

        const data = await response.json();

        if (data.success) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("doctorId");
          sessionStorage.removeItem("doctorSessionToken");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("❌ Error validando sesión del doctor:", error);
        setIsAuthenticated(false);
      }
    };

    validateDoctorSession();
  }, [doctorId, doctorSessionToken]);

  if (isAuthenticated === null) {
    return <p>Cargando sesión...</p>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Página principal con Header */}
        <Route path="/" element={<><Header /><Nosotros /></>} />

        {/* Página de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas SOLO para PACIENTE */}
        <Route path="/patient" element={<ProtectedPatientRoute><PatientPage /></ProtectedPatientRoute>} />
        <Route path="/comprar" element={<ProtectedPatientRoute><Compra /></ProtectedPatientRoute>} />

        {/* Rutas protegidas SOLO para DOCTOR */}
        <Route path="/doctor" element={<ProtectedDoctorRoute><DoctorPage /></ProtectedDoctorRoute>} />
        <Route path="/doctor/datos-medicos" element={<ProtectedDoctorRoute><DatosMedicos /></ProtectedDoctorRoute>} />
        <Route path="/doctor/mensajeria" element={<ProtectedDoctorRoute><Mensajeria /></ProtectedDoctorRoute>} />
        <Route path="/doctor/reportes-medicos" element={<ProtectedDoctorRoute><ReportesMedicos /></ProtectedDoctorRoute>} />

        {/* Rutas protegidas SOLO para el ADMINISTRADOR (DOCTOR) */}
        <Route path="/admin" element={<ProtectedDoctorRoute><AdminDashboard /></ProtectedDoctorRoute>} />
        <Route path="/admin/productos" element={<ProtectedDoctorRoute><AdminProductos /></ProtectedDoctorRoute>} />
        <Route path="/admin/reportes" element={<ProtectedDoctorRoute><AdminReportes /></ProtectedDoctorRoute>} />
        <Route path="/admin/reportes/ventas" element={<ProtectedDoctorRoute><ReporteVentas /></ProtectedDoctorRoute>} />
        <Route path="/admin/reportes/usuarios" element={<ProtectedDoctorRoute><ReporteUsuarios /></ProtectedDoctorRoute>} />

        {/* Redirección para rutas no existentes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
