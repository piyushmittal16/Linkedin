import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const socket = io(backendUrl, {
  transports: ["polling", "websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  autoConnect: Boolean(import.meta.env.VITE_BACKEND_URL),
});

export default socket;
