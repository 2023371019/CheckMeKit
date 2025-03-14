import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Configuración de Firebase con tus credenciales
const firebaseConfig = {
  apiKey: "AIzaSyBkhKA2feXWFeDeM1xNKRmtQOD158P7aXk",
  authDomain: "checkme-kit.firebaseapp.com",
  databaseURL: "https://checkme-kit-default-rtdb.firebaseio.com", // 🔹 Agrega la URL de la Realtime Database
  projectId: "checkme-kit",
  storageBucket: "checkme-kit.appspot.com", // 🔹 Corregido (antes tenía un error en la URL)
  messagingSenderId: "292196328202",
  appId: "1:292196328202:web:c85affb66cb514991090f3",
  measurementId: "G-2DKHRE1G0L",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Authentication y Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Inicializa Realtime Database
export const db = getDatabase(app);
