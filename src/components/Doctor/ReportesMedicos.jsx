import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaArrowLeft, FaUser, FaCalendarAlt, FaNotesMedical, FaHeartbeat } from "react-icons/fa";
import generarPDF from "./ReportePDF";

const ReportesMedicos = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState("");
  const [edad, setEdad] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState(new Date().toISOString().split("T")[0]);
  const [oxigenacion, setOxigenacion] = useState("");
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // Obtener la lista de todos los pacientes registrados
  useEffect(() => {
    fetch("http://localhost:5000/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientes(data))
      .catch((error) => console.error("Error al obtener pacientes:", error));
  }, []);

  // Cuando el doctor selecciona un paciente, obtener su edad automáticamente
  const handlePacienteChange = (e) => {
    const idPaciente = Number(e.target.value); // Convertir a número
    setPacienteSeleccionado(idPaciente);

    if (idPaciente) {
        fetch(`http://localhost:5000/paciente/${idPaciente}`)
            .then((res) => res.json())
            .then((data) => setEdad(data.edad))
            .catch((error) => console.error("Error al obtener datos del paciente:", error));
    } else {
        setEdad("");
    }
};


  // Guardar reporte en la base de datos
  const guardarReporte = async () => {
    if (!pacienteSeleccionado || !oxigenacion || !frecuenciaCardiaca) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const reporte = {
      id_paciente: pacienteSeleccionado,
      oxigenacion,
      frecuencia_cardiaca: frecuenciaCardiaca,
      observaciones,
    };

    try {
      const response = await fetch("http://localhost:5000/historial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reporte),
      });
      const data = await response.json();
      alert(data.message); // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al guardar el reporte:", error);
      alert("Error al guardar el reporte.");
    }
  };

  // Manejar la generación del PDF
  const handleGenerarPDF = async () => {
    if (!pacienteSeleccionado) {
        alert("Por favor, seleccione un paciente.");
        return;
    }

    const idPacienteNumerico = Number(pacienteSeleccionado); // Convertir a número

    if (isNaN(idPacienteNumerico)) {
        console.error("ID del paciente no es un número válido:", pacienteSeleccionado);
        alert("Error: ID del paciente no es válido.");
        return;
    }

    try {
        // Obtener el último reporte del paciente seleccionado
        const response = await fetch(`http://localhost:5000/historial/ultimo/${idPacienteNumerico}`);
        const reporte = await response.json();

        if (!reporte || Object.keys(reporte).length === 0) {
            alert("No se encontró ningún reporte para este paciente.");
            return;
        }

        // Obtener el nombre y apellido del paciente
        const paciente = pacientes.find((p) => p.id_usuario == idPacienteNumerico);
        if (!paciente) {
            alert("No se encontró el paciente en la lista.");
            return;
        }

        // Datos para el PDF
        const data = {
            paciente: `${paciente.nombre} ${paciente.apellido}`,
            edad: paciente.edad, // Usar la edad del paciente
            fechaRegistro: reporte.fecha_registro,
            oxigenacion: Number(reporte.oxigenacion), // Asegurar que es número
            frecuenciaCardiaca: Number(reporte.frecuencia_cardiaca), // Asegurar que es número
            observaciones: reporte.observaciones || "Sin observaciones",
        };

        console.log("Datos enviados a generarPDF:", data); // Verificar que los datos son correctos

        // Generar el PDF
        generarPDF(data);
    } catch (error) {
        console.error("Error al obtener el reporte:", error);
        alert("Error al obtener el reporte.");
    }
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-4xl w-full text-center border-4 border-indigo-500 transform transition-all hover:scale-105">
        <h1 className="text-4xl font-bold text-indigo-700 flex items-center justify-center gap-2">
          <FaNotesMedical className="text-indigo-500 animate-bounce" /> Reportes Médicos
        </h1>
        <p className="text-lg text-gray-600 mt-2">Seleccione un paciente y registre su estado de salud.</p>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="text-left">
            <label className="font-semibold flex items-center gap-2"><FaUser className="text-indigo-500" /> Paciente:</label>
            <select
              value={pacienteSeleccionado}
              onChange={handlePacienteChange}
              className="border p-3 rounded-lg w-full bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
              <option value="">Seleccione un paciente</option>
              {pacientes.map((pac) => (
                <option key={pac.id_usuario} value={pac.id_usuario}>
                  {pac.nombre} {pac.apellido}
                </option>
              ))}
            </select>

            <label className="font-semibold mt-4 flex items-center gap-2"><FaUser className="text-indigo-500" /> Edad:</label>
            <input
              type="number"
              value={edad}
              readOnly
              className="border p-3 rounded-lg w-full bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="text-left">
            <label className="font-semibold flex items-center gap-2"><FaCalendarAlt className="text-indigo-500" /> Fecha de Registro:</label>
            <input
              type="date"
              value={fechaRegistro}
              onChange={(e) => setFechaRegistro(e.target.value)}
              className="border p-3 rounded-lg w-full bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="text-left">
            <label className="font-semibold flex items-center gap-2"><FaHeartbeat className="text-red-500" /> Oxigenación (%):</label>
            <input
              type="number"
              value={oxigenacion}
              onChange={(e) => setOxigenacion(e.target.value)}
              className="border p-3 rounded-lg w-full bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Ingrese nivel de oxigenación"
            />
          </div>
          <div className="text-left">
            <label className="font-semibold flex items-center gap-2"><FaHeartbeat className="text-red-500" /> Frecuencia Cardíaca (BPM):</label>
            <input
              type="number"
              value={frecuenciaCardiaca}
              onChange={(e) => setFrecuenciaCardiaca(e.target.value)}
              className="border p-3 rounded-lg w-full bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Ingrese BPM"
            />
          </div>
        </div>

        <div className="mt-6 text-left">
          <label className="font-semibold">Observaciones del Doctor:</label>
          <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="border p-3 rounded-lg w-full h-24 bg-gray-100" />
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={() => navigate("/doctor")} className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 transition-all hover:scale-105">
            <FaArrowLeft /> Regresar
          </button>
          <button onClick={guardarReporte} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 transition-all hover:scale-105">
            Guardar Reporte
          </button>
          <button onClick={handleGenerarPDF} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 transition-all hover:scale-105">
            <FaFilePdf /> Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportesMedicos;