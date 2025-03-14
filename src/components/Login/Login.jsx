import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [genero, setGenero] = useState("");
  const [edad, setEdad] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [askForForce, setAskForForce] = useState(false);
  const navigate = useNavigate();

  const showAlert = (message, type = "success") => {
    console.log("Mostrando alerta:", message);
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (!nombre || !apellido || !correo || !password || !genero || !edad) {
        showAlert("Todos los campos son obligatorios.", "error");
        return;
      }

      if (!validateEmail(correo)) {
        showAlert("Por favor, ingresa un correo electrónico válido.", "error");
        return;
      }

      if (!validatePassword(password)) {
        showAlert("La contraseña debe tener al menos 6 caracteres.", "error");
        return;
      }
    }

    setLoading(true);

    try {
      const userData = isLogin ? { correo, password } : { nombre, apellido, correo, password, genero, edad };
      const response = await fetch(`http://localhost:5000/api/${isLogin ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("📡 Respuesta del servidor:", data);

      if (data.success) {
        if (isLogin) {
          if (data.askForForce) {
            setAskForForce(true);
            showAlert("El usuario ya tiene una sesión activa en otro dispositivo. ¿Deseas forzar el inicio de sesión?", "info");
          } else {
            console.log("✅ Inicio de sesión exitoso, guardando datos...");
            localStorage.setItem("userId", data.id_usuario);
            sessionStorage.setItem("sessionToken", data.sessionToken);
            console.log("📌 userId guardado:", localStorage.getItem("userId"));
            console.log("📌 sessionToken guardado:", sessionStorage.getItem("sessionToken"));
            showAlert("Inicio de sesión exitoso", "success");
            setTimeout(() => {
              navigate(data.role === "doctor" ? "/doctor" : "/patient");
            }, 2000);
          }
        } else {
          showAlert("Registro exitoso. Por favor, inicia sesión", "success");
          setIsLogin(true); // Cambia a la vista de inicio de sesión después del registro
        }
      } else {
        if (data.message === "Correo electrónico incorrecto") {
          showAlert("Correo electrónico incorrecto.", "error");
        } else if (data.message === "Contraseña incorrecta") {
          showAlert("Contraseña incorrecta.", "error");
        } else if (data.message === "Correo no registrado") {
          showAlert("Correo no registrado.", "error");
        } else {
          showAlert(data.message || "Error en el proceso.", "error");
        }
      }
    } catch (err) {
      console.error("❌ Error en el inicio de sesión:", err);
      showAlert("Error al conectar con el servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  const activateSession = async (id_usuario) => {
    try {
      const response = await fetch("http://localhost:5000/api/activateSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error("Error al activar la sesión:", data.message);
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
    }
  };

  const handleForceLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password, forzarLogin: true }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("userId", data.id_usuario);
        sessionStorage.setItem("sessionToken", data.sessionToken);
        activateSession(data.id_usuario);
        showAlert("Inicio de sesión exitoso", "success");
        setTimeout(() => {
          navigate(data.role === "doctor" ? "/doctor" : "/patient");
        }, 2000);
      } else {
        showAlert(data.message || "Error en el proceso.", "error");
      }
    } catch (err) {
      showAlert("Error al conectar con el servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email;

      const response = await fetch("http://localhost:5000/api/checkUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email }),
      });

      if (!response.ok) {
        throw new Error("Error en el servidor. Verifica la conexión.");
      }

      const data = await response.json();

      if (data.success && data.role === "doctor") {
        const resp = await fetch("http://localhost:5000/api/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const loginData = await resp.json();

        if (loginData.success) {
          localStorage.setItem("doctorId", loginData.id_doctor);
          sessionStorage.setItem("doctorSessionToken", loginData.sessionToken);
          showAlert("Bienvenido, Doctor", "success");
          setTimeout(() => {
            navigate("/doctor");
          }, 2000);
        } else if (loginData.askForForce) {
          setAskForForce(true);
          showAlert("El doctor ya tiene una sesión activa en otro dispositivo. ¿Deseas forzar el inicio de sesión?", "info");
        }
      } else if (data.success && data.role === "patient") {
        showAlert("Bienvenido, Paciente", "success");
        setTimeout(() => {
          navigate("/patient");
        }, 2000);
      } else {
        showAlert("Correo no registrado", "error");
      }
    } catch (error) {
      showAlert("Error al iniciar sesión con Google", "error");
    }
  };

  const handleLogout = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      showAlert("No se pudo obtener el ID del usuario.", "error");
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
        localStorage.removeItem("userId");
        sessionStorage.removeItem("sessionToken");
        showAlert("Sesión cerrada exitosamente.", "success");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showAlert("Error al cerrar la sesión.", "error");
      }
    } catch (err) {
      showAlert("Error al conectar con el servidor.", "error");
    }
  };

  useEffect(() => {
    console.log("Estado del modal:", showModal);
  }, [showModal]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{ backgroundImage: "url('/background.jpg')", backgroundSize: "cover" }}
    >
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex">
        <div className="hidden md:flex flex-col items-center justify-center bg-black text-white w-1/2 p-8">
          <h2 className="text-4xl font-bold mb-4">Cuidamos cada latido</h2>
          <p className="text-lg mb-6">
            Monitorea tu oxigenación y ritmo cardiaco con tecnología avanzada y desde cualquier lugar.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full"
          >
            Regresar
          </button>
        </div>

        <div className="flex-1 p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="nombre">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingresa tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="apellido">
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ingresa tu apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="genero">Género</label>
                  <select id="genero" className="w-full px-4 py-2 border rounded-lg" value={genero} onChange={(e) => setGenero(e.target.value)} required>
                    <option value="">Selecciona tu género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="edad">Edad</label>
                  <input type="number" id="edad" className="w-full px-4 py-2 border rounded-lg" value={edad} onChange={(e) => setEdad(e.target.value)} required />
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="correo">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Cargando..." : isLogin ? "Iniciar sesión" : "Registrarse"}
            </button>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google Icon"
                  className="w-5 h-5 mr-2"
                />
                Iniciar sesión con Google
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  {isLogin ? "Regístrate" : "Inicia sesión"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

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
            {askForForce && modalType === "info" && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleForceLogin}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                >
                  Forzar inicio
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            )}
            {!askForForce && (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;