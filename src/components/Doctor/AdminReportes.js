import React, { useState } from "react";
import { FaFilePdf, FaArrowLeft, FaChartLine, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import generarReporteVentas from "./ReporteVentas";
import generarReporteUsuarios from "./ReporteUsuarios";

const AdminReportes = () => {
  const [selectedReport, setSelectedReport] = useState("");

  const generarPDF = async () => {
    try {
      if (selectedReport === "ventas") {
        await generarReporteVentas();
      } else if (selectedReport === "usuarios") {
        await generarReporteUsuarios();
      }
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 text-gray-900 p-10">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-8 text-gray-800 bg-white p-5 rounded-lg shadow-lg border-b-4 border-blue-500"
      >
        Reportes
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <p className="text-xl text-gray-700 mb-4 font-medium">Seleccione el tipo de reporte:</p>

        <select
          className="mb-6 p-3 border rounded-lg shadow-sm bg-gray-50 text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="">-- Seleccionar Reporte --</option>
          <option value="ventas">Ventas por mes</option>
          <option value="usuarios">Usuarios registrados</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md flex items-center justify-center w-full transition-all duration-300 disabled:opacity-50"
          onClick={generarPDF}
          disabled={!selectedReport}
        >
          <FaFilePdf className="mr-2" />
          Generar Reporte
        </motion.button>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg shadow-md flex items-center transition-all duration-300"
        onClick={() => window.history.back()}
      >
        <FaArrowLeft className="mr-2" />
        Volver
      </motion.button>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 cursor-pointer"
          onClick={() => setSelectedReport("ventas")}
        >
          <FaChartLine className="text-5xl text-green-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Ventas</h2>
          <p className="text-gray-600">Obtén un reporte de las ventas por mes.</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 cursor-pointer"
          onClick={() => setSelectedReport("usuarios")}
        >
          <FaUsers className="text-5xl text-purple-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Usuarios</h2>
          <p className="text-gray-600">Consulta los usuarios registrados.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminReportes;
