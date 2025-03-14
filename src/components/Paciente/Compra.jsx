import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { assets } from "../../assets/assets";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

const Compra = ({ userId: propUserId }) => {
  const navigate = useNavigate();
  const [mostrarPago, setMostrarPago] = useState(false);
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [saldo, setSaldo] = useState("");
  const [error, setError] = useState("");
  const [saldoDisponible, setSaldoDisponible] = useState(null);
  const [stockDisponible, setStockDisponible] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("info");
  const [modalMessage, setModalMessage] = useState("");

  const storedUserId = localStorage.getItem("userId");
  const userId = propUserId || storedUserId;
  const idProducto = 1;
  const precioProducto = 1999.0;

  useEffect(() => {
    console.log("UserId:", userId);
    if (userId) {
      obtenerSaldo();
      obtenerStock();
    }
  }, [userId]);

  const obtenerSaldo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/saldo/${userId}`);
      const data = await response.json();
      if (data.success) {
        setSaldoDisponible(data.saldo);
      } else {
        setSaldoDisponible(0);
      }
    } catch (error) {
      console.error("Error al obtener el saldo:", error);
      setSaldoDisponible(0);
    }
  };

  const obtenerStock = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/stock/1`);
      const data = await response.json();

      if (data.success) {
        setStockDisponible(data.stock);
      } else {
        console.error("Error al obtener el stock:", data.message);
        setStockDisponible(0);
      }
    } catch (error) {
      console.error("❌ Error al obtener el stock:", error);
      setStockDisponible(0);
    }
  };

  const handlePago = () => {
    if (cantidad <= 0) {
      setModalType("error");
      setModalMessage("🚨 La cantidad debe ser mayor que cero.");
      setShowModal(true);
      return;
    }
    setMostrarPago(true);
    setError("");
  };

  const handleConfirmarCompra = async () => {
    if (!userId) {
      setModalType("error");
      setModalMessage("🚨 Error: No se pudo obtener el ID del usuario.");
      setShowModal(true);
      return;
    }

    if (cantidad <= 0) {
      setModalType("error");
      setModalMessage("🚨 La cantidad debe ser mayor que cero.");
      setShowModal(true);
      return;
    }

    const montoTotal = precioProducto * cantidad;

    if (cantidad > stockDisponible) {
      setModalType("error");
      setModalMessage(`🚨 Stock insuficiente. Solo hay ${stockDisponible} unidades disponibles.`);
      setShowModal(true);
      return;
    }

    if (saldoDisponible < montoTotal) {
      setModalType("error");
      setModalMessage(`🚨 Saldo insuficiente. Tienes $${saldoDisponible} y necesitas $${montoTotal}.`);
      setShowModal(true);
      return;
    }

    try {
      console.log("🛒 Enviando datos de compra al backend...");
      const response = await fetch("http://localhost:5000/api/compra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_usuario: userId,
          id_producto: idProducto,
          cantidad: cantidad,
        }),
      });

      const data = await response.json();
      console.log("📩 Respuesta del servidor (Compra):", data);

      if (response.ok && data.success) {
        setModalType("success");
        setModalMessage(`🎉 Compra realizada con éxito. ¡Gracias por tu compra de ${cantidad} unidad(es)!`);
        setShowModal(true);
        setMostrarPago(false);
        obtenerSaldo();
        obtenerStock();
      } else {
        setModalType("error");
        setModalMessage(`🚨 Error en la compra: ${data.message || "Error desconocido"}`);
        setShowModal(true);
        console.error("❌ Error en la compra:", data);
      }
    } catch (error) {
      console.error("❌ Error al procesar la compra:", error);
      setModalType("error");
      setModalMessage("❌ Hubo un problema al procesar la compra. Intente nuevamente.");
      setShowModal(true);
    }
  };

  const handleIngresarSaldo = async () => {
    if (!numeroCuenta || !saldo || parseFloat(saldo) <= 0) {
      setError("Por favor, ingrese un número de cuenta y un saldo válido.");
      return;
    }

    if (!userId) {
      setError("Error: No se pudo obtener el ID del usuario. Intente nuevamente.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/empresa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_usuario: userId,
          numero_cuenta: numeroCuenta,
          saldo: parseFloat(saldo),
        }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor (Empresa):", data);

      if (data.success) {
        setModalType("success");
        setModalMessage("✅ Información almacenada correctamente.");
        setShowModal(true);
        setMostrarPago(false);
        obtenerSaldo();
      } else {
        setModalType("error");
        setModalMessage(data.message || "❌ Error al almacenar la información.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("❌ Error al almacenar la información:", error);
      setModalType("error");
      setModalMessage("Hubo un problema al almacenar la información. Intente nuevamente.");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-4xl flex flex-col md:flex-row gap-10 transform transition duration-500 hover:scale-105">
        <div className="w-full md:w-1/2">
          <Carousel showThumbs={false} infiniteLoop autoPlay interval={3000} className="rounded-xl shadow-lg overflow-hidden">
            <div><img src={assets.producto1} alt="CheckMe Kit" className="rounded-xl" /></div>
            <div><img src={assets.producto2} alt="CheckMe Kit en uso" className="rounded-xl" /></div>
            <div><img src={assets.producto3} alt="CheckMe Kit detalles" className="rounded-xl" /></div>
            <div><img src={assets.producto4} alt="CheckMe Kit uso en mano" className="rounded-xl" /></div>
          </Carousel>
        </div>

        <div className="flex flex-col justify-between text-gray-800 w-full md:w-1/2">
          <h1 className="text-3xl font-extrabold text-gray-900">CheckMe Kit</h1>
          <p className="text-xl font-semibold text-gray-700 mt-2">Precio:</p>
          <p className="text-2xl font-bold text-green-600">$1,999.00 MXN</p>
          <p className="text-md text-gray-600 italic mt-1">Incluye envío gratis a todo México y garantía de 1 año.</p>

          <h2 className="text-lg font-semibold mt-6">¿Qué incluye tu compra?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
            <li>✅ 1 Dispositivo IoT de monitoreo.</li>
            <li>✅ Cable de carga USB.</li>
            <li>✅ Acceso a la plataforma web y aplicación móvil.</li>
          </ul>

          <div className="mt-6">
            <label htmlFor="cantidad" className="block text-lg font-semibold text-gray-700">
              Cantidad:
            </label>
            <input
              type="number"
              id="cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              min="1"
              className="mt-2 w-20 p-2 border rounded-lg text-center text-gray-900"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePago}
              className="mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg text-lg flex items-center justify-center gap-3 transform transition duration-300 hover:scale-105"
            >
              🛍️ Comprar ahora
            </button>
            <button
              onClick={() => navigate("/patient")}
              className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg text-lg flex items-center justify-center gap-3 transform transition duration-300 hover:scale-105"
            >
              ⬅️ Regresar
            </button>
          </div>
        </div>
      </div>

      {mostrarPago && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 rounded-lg shadow-xl w-96 text-white text-center relative">
            <h2 className="text-2xl font-bold">Ingrese sus datos</h2>
            <input
              type="text"
              value={numeroCuenta}
              onChange={(e) => setNumeroCuenta(e.target.value)}
              className="mt-2 w-full p-2 border rounded-lg text-center text-gray-900"
              placeholder="Número de cuenta"
            />
            <input
              type="number"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              className="mt-2 w-full p-2 border rounded-lg text-center text-gray-900"
              placeholder="Ingrese su saldo"
            />
            {error && <p className="text-red-400 mt-2">{error}</p>}
            <div className="mt-4 flex gap-4 justify-center">
              <button onClick={handleIngresarSaldo} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg">
                Guardar Datos
              </button>
              <button onClick={handleConfirmarCompra} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg">
                Comprar
              </button>
              <button onClick={() => setMostrarPago(false)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <div className={`flex items-center justify-center mb-4 ${modalType === "success" ? "text-green-500" : modalType === "error" ? "text-red-500" : "text-blue-500"}`}>
              {modalType === "success" && <FaCheckCircle className="w-12 h-12" />}
              {modalType === "error" && <FaExclamationCircle className="w-12 h-12" />}
              {modalType === "info" && <FaInfoCircle className="w-12 h-12" />}
            </div>
            <h2 className="text-xl font-bold mb-4">
              {modalType === "success" ? "¡Éxito!" : modalType === "error" ? "¡Error!" : "¡Información!"}
            </h2>
            <p className="mb-4">{modalMessage}</p>
            <button
              onClick={handleCloseModal}
              className={`mt-4 ${
                modalType === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : modalType === "error"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white py-2 px-4 rounded-lg`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compra;