import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/doctor_background.jpg";

const Doctor = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const doctorId = localStorage.getItem("doctorId");
  const sessionToken = sessionStorage.getItem("doctorSessionToken");

  useEffect(() => {
    const validateDoctorSession = async () => {
      if (!doctorId || !sessionToken) {
        console.warn("⛔ No hay sesión activa, redirigiendo a login.");
        setIsAuthenticated(false);
        return;
      }

      console.log("🔍 Validando sesión del doctor...");
      try {
        const response = await fetch("http://localhost:5000/api/validateDoctorSession", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_doctor: doctorId, sessionToken }),
        });

        const data = await response.json();
        console.log("📡 Respuesta de validación de sesión:", data);

        if (data.success) {
          console.log("✅ Sesión válida.");
          setIsAuthenticated(true);
        } else {
          console.warn("⛔ Sesión inválida, cerrando sesión.");
          handleLogout();
        }
      } catch (error) {
        console.error("❌ Error validando sesión:", error);
        handleLogout();
      }
    };

    validateDoctorSession();
  }, [doctorId, sessionToken]);

  const handleLogout = async () => {
    if (doctorId) {
      try {
        await fetch("http://localhost:5000/api/logoutDoctor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_doctor: doctorId }),
        });
      } catch (error) {
        console.error("❌ Error al cerrar sesión:", error);
      }
    }
    
    localStorage.removeItem("doctorId");
    sessionStorage.removeItem("doctorSessionToken");
    navigate("/login");
  };

  if (isAuthenticated === null) {
    return <p className="text-center text-white mt-10">Validando sesión...</p>;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white relative" 
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Menú Superior */}
      <div className="absolute top-0 left-0 w-full bg-black bg-opacity-70 p-4 flex justify-end gap-4">
        <button 
          className="bg-gray-600 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          onClick={() => navigate("/admin")}
        >
          ⚙️ Panel de Configuración
        </button>
        <button 
          className="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          onClick={handleLogout}
        >
          ❌ Cerrar sesión
        </button>
      </div>
      
      {/* Contenido Principal */}
      <div className="relative text-center max-w-2xl px-6 mt-12">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">La salud de tus pacientes, al alcance de un clic</h1>
        <p className="text-lg mt-4 text-gray-300">Supervisa signos vitales, revisa reportes y comunícate en tiempo real.</p>
      </div>
      
      {/* Menú de Opciones */}
      <div className="relative flex flex-wrap justify-center gap-4 px-10 pt-12">
        {[
          { label: "Datos Médicos", bg: "bg-green-600", hover: "hover:bg-green-800", route: "/doctor/datos-medicos", icon: "📊" },
          { label: "Mensajería", bg: "bg-blue-600", hover: "hover:bg-blue-800", route: "/doctor/mensajeria", icon: "✉️" },
          { label: "Reportes Médicos", bg: "bg-purple-600", hover: "hover:bg-purple-800", route: "/doctor/reportes-medicos", icon: "📋" }
        ].map((item, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center w-56 p-6 rounded-lg shadow-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl ${item.bg} ${item.hover} text-white`}
          >
            <div className="text-5xl">{item.icon}</div>
            <button 
              onClick={() => navigate(item.route)} 
              className="text-lg font-bold mt-3"
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctor;
