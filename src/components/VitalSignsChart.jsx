import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const VitalSignsChart = ({ patientUID }) => {
    const [labels, setLabels] = useState([]);
    const [oxigenacionData, setOxigenacionData] = useState([]);
    const [frecuenciaData, setFrecuenciaData] = useState([]);

    useEffect(() => {
        if (!patientUID) return;

        const db = getDatabase();
        const signosRef = ref(db, `pacientes/${patientUID}/signos_vitales`);

        onValue(signosRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const timestamps = Object.keys(data);
                const oxigenacion = timestamps.map(ts => data[ts].oxigenacion);
                const frecuencia = timestamps.map(ts => data[ts].frecuencia_cardiaca);

                setLabels(timestamps);
                setOxigenacionData(oxigenacion);
                setFrecuenciaData(frecuencia);
            }
        });
    }, [patientUID]);

    const chartData = {
        labels: labels.map(ts => new Date(parseInt(ts)).toLocaleTimeString()), // Formatea timestamps
        datasets: [
            {
                label: "Oxigenación (%)",
                data: oxigenacionData,
                borderColor: "blue",
                fill: false,
            },
            {
                label: "Frecuencia Cardíaca (BPM)",
                data: frecuenciaData,
                borderColor: "red",
                fill: false,
            }
        ]
    };

    return <Line data={chartData} />;
};

export default VitalSignsChart;
