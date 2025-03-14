import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientPage = () => {
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    const validateSessionToken = async () => {
      const sessionToken = sessionStorage.getItem("sessionToken");
      const userId = localStorage.getItem("userId");

      if (!sessionToken || !userId) {
        console.warn("⛔ No se encontró un token o ID de usuario, redirigiendo a login.");
        navigate("/login");
        return;
      }

      try {
        console.log("🔍 Enviando validación de sesión...");
        const response = await fetch("http://localhost:5000/api/validateSession", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_usuario: userId, sessionToken }),
        });

        const data = await response.json();
        console.log("📡 Respuesta de validación de sesión:", data);

        if (data.success) {
          setIsValidToken(true);
        } else {
          console.warn("⛔ Sesión inválida, cerrando sesión.");
          sessionStorage.removeItem("sessionToken");
          localStorage.removeItem("userId");
          navigate("/login");
        }
      } catch (err) {
        console.error("❌ Error al validar la sesión:", err);
        sessionStorage.removeItem("sessionToken");
        localStorage.removeItem("userId");
        navigate("/login");
      }
    };

    validateSessionToken();
  }, [navigate]);

  const handleBuy = () => {
    navigate("/comprar");
  };

  const handleLogout = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("⛔ No se encontró un ID de usuario.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: userId }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Sesión cerrada exitosamente.");
        localStorage.removeItem("userId");
        sessionStorage.removeItem("sessionToken");
        navigate("/login");
      } else {
        console.error("❌ Error al cerrar la sesión:", data.message);
      }
    } catch (err) {
      console.error("❌ Error al conectar con el servidor:", err);
    }
  };

  if (isValidToken === null) {
    return <p>Cargando sesión...</p>;
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/5452210/pexels-photo-5452210.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}>
      <div className="min-h-screen flex flex-col justify-center items-center bg-black bg-opacity-50 px-6">
        <div className="text-center text-white max-w-2xl">
          <h1 className="text-5xl font-bold">Tu salud, siempre conectada</h1>
          <p className="text-lg mt-4">Con nuestra plataforma, puedes monitorear tu salud desde casa y recibir apoyo médico en cualquier momento.</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleBuy} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md text-lg">
              Comprar
            </button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md text-lg">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPage;
