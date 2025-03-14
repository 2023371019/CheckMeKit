import { jsPDF } from "jspdf";
import hospitalLogo from "./logo.jpg"; // Asegúrate de tener esta imagen en tu proyecto
import doctorSignature from "./firma.png"; // Asegúrate de tener esta imagen en tu proyecto

let numeroOrdenActual = 1; // Variable para incrementar automáticamente el número de orden

const generarPDF = async (data) => {
    // Validaciones de datos
    if (!data.paciente || typeof data.paciente !== "string") {
        console.error("Nombre del paciente inválido:", data.paciente);
        alert("Error: Nombre del paciente no es válido.");
        return;
    }
    if (!data.oxigenacion || isNaN(data.oxigenacion)) {
        console.error("Oxigenación inválida:", data.oxigenacion);
        alert("Error: Oxigenación no es válida.");
        return;
    }
    if (!data.frecuenciaCardiaca || isNaN(data.frecuenciaCardiaca)) {
        console.error("Frecuencia cardíaca inválida:", data.frecuenciaCardiaca);
        alert("Error: Frecuencia cardíaca no es válida.");
        return;
    }

    const doc = new jsPDF({
        format: "a4",
        unit: "mm",
        compress: true,
    });

    let marginX = 15;
    let y = 10;

    // Encabezado con Logo y Título
    doc.addImage(hospitalLogo, "JPEG", marginX, y, 20, 20);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE MÉDICO", marginX + 30, y + 10);
    y += 25;

    // Información del Doctor y Número de Orden
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Dr. Rafael Vera Urquiza", marginX, y);
    doc.text("Especialidad: Cardiólogo, Internista", marginX, y + 5);
    doc.text("Ced. Prof: 5307293 / 7696134 / 9618344", marginX, y + 10);
    doc.text(`No. de Orden: ${numeroOrdenActual++}`, 150, y);
    doc.text(`Fecha: ${new Date(data.fechaRegistro).toLocaleDateString()}`, 150, y + 5);
    doc.text(`Hora: ${new Date(data.fechaRegistro).toLocaleTimeString()}`, 150, y + 10);
    y += 20;

    doc.line(marginX, y, 195, y);
    y += 5;

    // Información del Paciente
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DEL PACIENTE", marginX, y);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.text(`Nombre: ${data.paciente}`, marginX, y);
    doc.text(`Edad: ${data.edad} años`, marginX, y + 5);
    doc.text(`Fecha de Registro: ${new Date(data.fechaRegistro).toLocaleString()}`, marginX, y + 10);
    y += 15;

    doc.line(marginX, y, 195, y);
    y += 5;

    // Datos Médicos
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS MÉDICOS", marginX, y);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.text(`Oxigenación: ${data.oxigenacion}%`, marginX, y);
    doc.text(`Frecuencia Cardíaca: ${data.frecuenciaCardiaca} BPM`, marginX, y + 5);
    y += 15;

    doc.line(marginX, y, 195, y);
    y += 5;

    // Observaciones
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVACIONES", marginX, y);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.text(data.observaciones || "Sin observaciones", marginX, y, { maxWidth: 170 });
    y += 15;

    doc.line(marginX, y, 195, y);
    y += 5;

    // Información del Hospital
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("HOSPITAL MÉDICA TEC100 DE QUERÉTARO", marginX, y);
    doc.setFont("helvetica", "normal");
    doc.text("Boulevard Bernardo Quintana Arrioja 9670, Blvd. Centro Sur 9800", marginX, y + 5);
    doc.text("Centro Sur, Santiago de Querétaro 76090", marginX, y + 10);
    y += 15;

    // Firma del Doctor
    doc.addImage(doctorSignature, "PNG", 140, y, 40, 15);
    doc.text("Dr. Rafael Vera Urquiza", 150, y + 20);
    
    // Guardar y abrir el PDF
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
};

export default generarPDF;
