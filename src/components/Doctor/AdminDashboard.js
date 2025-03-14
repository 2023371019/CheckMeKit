import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaChartLine, FaArrowLeft } from "react-icons/fa"; // Importar iconos de react-icons

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-900 p-10 relative overflow-hidden">
      {/* Animaciones personalizadas */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          .animate-float { animation: float 4s ease-in-out infinite; }
          .animate-pulse { animation: pulse 3s ease-in-out infinite; }
        `}
      </style>

      {/* Elementos decorativos animados */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-float top-10 left-20"></div>
        <div className="absolute w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse top-40 right-20"></div>
        <div className="absolute w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-float bottom-20 left-1/2"></div>
      </div>

      {/* Barra de navegación superior */}
      <nav className="w-full bg-white/90 backdrop-blur-md shadow-sm fixed top-0 left-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900 flex items-center">
            <span className="bg-blue-600 text-white p-3 rounded-lg mr-2 shadow-md text-3xl">⚕️</span>
            Panel de Administración
          </h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg shadow-md flex items-center transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/doctor")}
          >
            <FaArrowLeft className="mr-2" />
            Volver
          </button>
        </div>
      </nav>

      {/* Contenido principal con tarjetas interactivas */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
        {/* Tarjeta para Gestionar Productos */}
        <div
          className="bg-gradient-to-r from-blue-100 to-indigo-100 p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer hover:ring-2 hover:ring-blue-300 border border-blue-200"
          onClick={() => navigate("/admin/productos")}
        >
          <div className="flex flex-col items-center text-center">
            <FaBox className="text-8xl text-blue-600 drop-shadow-md mb-4 animate-float" />
            <h2 className="text-2xl font-bold text-blue-900">Gestionar Productos</h2>
            <p className="text-gray-600 mt-2 text-lg">
              Administra y actualiza el inventario de productos médicos.
            </p>
          </div>
        </div>

        {/* Tarjeta para Ver Reportes */}
        <div
          className="bg-gradient-to-r from-blue-100 to-indigo-100 p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer hover:ring-2 hover:ring-indigo-300 border border-indigo-200"
          onClick={() => navigate("/admin/reportes")}
        >
          <div className="flex flex-col items-center text-center">
            <FaChartLine className="text-8xl text-indigo-600 drop-shadow-md mb-4 animate-float" />
            <h2 className="text-2xl font-bold text-indigo-900">Ver Reportes</h2>
            <p className="text-gray-600 mt-2 text-lg">
              Accede a reportes detallados.
            </p>
          </div>
        </div>
      </div>

      {/* Pie de página */}
      <footer className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md py-4 text-center text-gray-600">
        <p>© 2025 Hospital Médica Tec 100. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;