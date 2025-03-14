import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaArrowLeft, FaEdit } from "react-icons/fa";
import axios from "axios"; // Importamos axios para las peticiones al backend

const AdminProductos = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ nombre: "", descripcion: "", precio: "", stock: "" });
  const [editingProduct, setEditingProduct] = useState(null); // Estado para el producto en edición

  // 🔹 Obtener productos desde el backend
  useEffect(() => {
    axios.get("http://localhost:5000/productos")
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error al obtener productos:", error));
  }, []);

  // 🔹 Manejo de inputs
  const handleChange = (e) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
    } else {
      setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    }
  };

  // 🔹 Agregar producto a la base de datos
  const addProduct = () => {
    if (newProduct.nombre && newProduct.descripcion && newProduct.precio && newProduct.stock) {
      axios.post("http://localhost:5000/productos", newProduct)
        .then(response => {
          setProducts([...products, response.data]); // Agrega el producto a la lista
          setNewProduct({ nombre: "", descripcion: "", precio: "", stock: "" }); // Limpia los inputs
        })
        .catch(error => console.error("Error al agregar producto:", error));
    }
  };

  // 🔹 Eliminar producto de la base de datos
  const deleteProduct = (id) => {
    axios.delete(`http://localhost:5000/productos/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id_producto !== id)); // Filtra el producto eliminado
      })
      .catch(error => console.error("Error al eliminar producto:", error));
  };

  // 🔹 Editar producto
  const editProduct = (product) => {
    setEditingProduct(product); // Establece el producto en edición
  };

  // 🔹 Actualizar producto en la base de datos
  const updateProduct = () => {
    if (editingProduct) {
      axios.put(`http://localhost:5000/productos/${editingProduct.id_producto}`, editingProduct)
        .then(response => {
          setProducts(products.map(product => 
            product.id_producto === editingProduct.id_producto ? response.data : product
          )); // Actualiza el producto en la lista
          setEditingProduct(null); // Limpia el estado de edición
        })
        .catch(error => console.error("Error al actualizar producto:", error));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-indigo-100 text-gray-900 p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 bg-white p-4 rounded-lg shadow-md">Gestión de Productos</h1>
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg shadow-lg w-full max-w-2xl border border-purple-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          {editingProduct ? "Editar Producto" : "Añadir Producto"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input className="p-2 rounded border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            name="nombre" value={editingProduct ? editingProduct.nombre : newProduct.nombre} onChange={handleChange} placeholder="Nombre" />
          <input className="p-2 rounded border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            name="descripcion" value={editingProduct ? editingProduct.descripcion : newProduct.descripcion} onChange={handleChange} placeholder="Descripción" />
          <input className="p-2 rounded border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            name="precio" type="number" value={editingProduct ? editingProduct.precio : newProduct.precio} onChange={handleChange} placeholder="Precio" />
          <input className="p-2 rounded border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            name="stock" type="number" value={editingProduct ? editingProduct.stock : newProduct.stock} onChange={handleChange} placeholder="Stock" />
        </div>
        <button className="mt-4 bg-purple-500 text-white py-2 px-4 rounded w-full shadow-md flex items-center justify-center transition-all duration-300 hover:bg-purple-600 hover:shadow-lg"
          onClick={editingProduct ? updateProduct : addProduct}>
          {editingProduct ? <FaEdit className="mr-2" /> : <FaPlus className="mr-2" />}
          {editingProduct ? "Actualizar Producto" : "Agregar Producto"}
        </button>
      </div>
      <div className="mt-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 bg-white p-4 rounded-lg shadow-md">Lista de Productos</h2>
        {products.map(product => (
          <div key={product.id_producto} className="flex justify-between items-center bg-white p-4 rounded mb-2 shadow-md border border-purple-200 hover:shadow-lg transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{product.nombre}</h3>
              <p className="text-sm text-gray-600">{product.descripcion} - ${product.precio} - Stock: {product.stock}</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded shadow-md flex items-center transition-all duration-300 hover:bg-blue-600 hover:shadow-lg"
                onClick={() => editProduct(product)}>
                <FaEdit className="mr-2" /> Editar
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded shadow-md flex items-center transition-all duration-300 hover:bg-red-600 hover:shadow-lg"
                onClick={() => deleteProduct(product.id_producto)}>
                <FaTrash className="mr-2" /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded shadow-md flex items-center transition-all duration-300 hover:bg-blue-600 hover:shadow-lg"
        onClick={() => navigate("/admin")}>
        <FaArrowLeft className="mr-2" /> Volver
      </button>
    </div>
  );
};

export default AdminProductos;