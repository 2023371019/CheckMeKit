import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const generarReporteUsuarios = async () => {
  try {
    console.log("📡 Solicitando datos del reporte de usuarios...");
    const response = await fetch("http://localhost:5000/api/reporte-usuarios");

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const { usuarios, totalUsuarios } = data; // 🔹 CORREGIDO: Se usa "usuarios" en lugar de "usuariosPorDia"

    if (!usuarios || usuarios.length === 0) {
      alert("No hay usuarios registrados.");
      return;
    }

    console.log("✅ Datos obtenidos:", usuarios);

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    // Cargar el logo desde "public"
    const logo = new Image();
    logo.src = "/logo.jpg";

    await new Promise((resolve) => {
      logo.onload = resolve;
    });

    // Agregar el logo y el título
    doc.addImage(logo, "JPEG", 10, 10, 25, 25);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("Reporte de Usuarios Registrados", 105, 20, { align: "center" });

    // Fecha de generación
    const fechaActual = new Date().toLocaleDateString("es-ES");
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Fecha de generación: ${fechaActual}`, 105, 30, { align: "center" });

    let startY = 50;

    // Generar tabla única para todos los usuarios
    autoTable(doc, {
      startY,
      head: [["ID", "Nombre", "Apellido", "Correo", "Género", "Edad"]],
      body: usuarios.map((u) => [
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.correo,
        u.genero,
        u.edad
      ]),
      headStyles: { fillColor: [50, 50, 150], textColor: [255, 255, 255], fontStyle: "bold" },
      bodyStyles: { textColor: [40, 40, 40] },
      alternateRowStyles: { fillColor: [235, 235, 255] },
      margin: { top: 8 },
    });

    startY = doc.lastAutoTable.finalY + 15;

    // Mostrar total de usuarios al final del reporte
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 100, 0);
    doc.text(`Total de usuarios registrados: ${totalUsuarios}`, 105, startY, { align: "center" });

    // Pie de página
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Este es un documento generado automáticamente por CheckMe Kit.", 105, 280, { align: "center" });

    // Mostrar el PDF en una nueva pestaña
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  } catch (error) {
    console.error("❌ Error al generar el reporte de usuarios:", error.message);
    alert("Hubo un error al generar el reporte.");
  }
};

export default generarReporteUsuarios;
