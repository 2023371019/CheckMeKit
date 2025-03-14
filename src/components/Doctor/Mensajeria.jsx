import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const Mensajeria = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = io("http://localhost:5000");  // Asegúrate de usar la URL correcta de tu servidor

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        senderId: "paciente",  // ID del paciente
        receiverId: "doctor",  // ID del doctor
        content: newMessage,
      };

      // Emitir mensaje al servidor
      socket.emit("send-message", messageData);

      // Limpiar el campo de texto
      setNewMessage("");
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.senderId}: {msg.content}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
};

export default Mensajeria;
