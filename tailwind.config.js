/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Escanea los archivos dentro de src
    "./public/index.html",        // Archivo HTML principal
  ],
  theme: {
    extend: {}, // Personaliza tu tema aquí
  },
  plugins: [],
};
