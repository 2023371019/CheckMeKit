import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";

const DatosMedicos = () => {
  const navigate = useNavigate();
  const [oxigenacionData, setOxigenacionData] = useState([]);
  const [ritmoCardiacoData, setRitmoCardiacoData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [alerta, setAlerta] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/datos");
        console.log("📢 Datos recibidos de la API:", res.data);

        if (!res.data || res.data.length === 0) {
          console.warn("⚠️ No hay datos en la API.");
          return;
        }

        const data = res.data.reverse(); // Ordenar datos en orden cronológico
        const timestampsList = data.map((d) => new Date(d.fecha).toLocaleTimeString());
        const oxigenacion = data.map((d) => d.spo2);
        const ritmoCardiaco = data.map((d) => d.bpm);

        setTimestamps(timestampsList);
        setOxigenacionData(oxigenacion);
        setRitmoCardiacoData(ritmoCardiaco);

        // 🚨 Detectar alertas en la web
        const ultimoOxigeno = oxigenacion[oxigenacion.length - 1];
        const ultimoRitmo = ritmoCardiaco[ritmoCardiaco.length - 1];

        if (ultimoOxigeno < 85) {
          setAlerta(`🚨 EMERGENCIA: Oxigenación muy baja (${ultimoOxigeno}%)`);
        } else if (ultimoOxigeno < 90) {
          setAlerta(`⚠️ Alerta: Oxigenación baja (${ultimoOxigeno}%)`);
        } else if (ultimoRitmo < 40 || ultimoRitmo > 150) {
          setAlerta(`🚨 EMERGENCIA: Ritmo cardíaco peligroso (${ultimoRitmo} BPM)`);
        } else {
          setAlerta("");
        }
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
    };

    obtenerDatos();
    const interval = setInterval(obtenerDatos, 30000); // 📌 Ahora se actualiza cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  // 📌 Configuración de la gráfica mejorada
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        ticks: { autoSkip: true, maxTicksLimit: 10 },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800">📊 Monitoreo de Signos Vitales</h1>
        <p className="text-lg text-gray-600 mt-2">Visualización en tiempo real de los signos vitales.</p>

        {/* 🚨 Mostrar alerta en caso de emergencia */}
        {alerta && (
          <div className="mt-4 p-3 bg-red-500 text-white font-bold rounded-lg">
            {alerta}
          </div>
        )}

        {/* 📌 Gráfico de Oxigenación */}
        <div className="mt-6 w-full h-60">
          <h2 className="text-lg font-semibold text-blue-600">Oxigenación (%)</h2>
          <Line
            data={{
              labels: timestamps.length > 0 ? timestamps : ["Sin datos"],
              datasets: [
                {
                  label: "Oxigenación",
                  data: oxigenacionData.length > 0 ? oxigenacionData : [0],
                  borderColor: "blue",
                  backgroundColor: "rgba(0,123,255,0.2)",
                  pointBackgroundColor: "blue",
                  pointBorderColor: "#fff",
                  fill: true,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>

        {/* 📌 Gráfico de Ritmo Cardíaco */}
        <div className="mt-6 w-full h-60">
          <h2 className="text-lg font-semibold text-red-600">Ritmo Cardíaco (BPM)</h2>
          <Line
            data={{
              labels: timestamps.length > 0 ? timestamps : ["Sin datos"],
              datasets: [
                {
                  label: "Ritmo Cardíaco",
                  data: ritmoCardiacoData.length > 0 ? ritmoCardiacoData : [0],
                  borderColor: "red",
                  backgroundColor: "rgba(220,53,69,0.2)",
                  pointBackgroundColor: "red",
                  pointBorderColor: "#fff",
                  fill: true,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>

        {/* 🔹 Botón para regresar */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/doctor")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
          >
            ⬅️ Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatosMedicos;
