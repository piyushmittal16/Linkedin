import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["polling", "websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;
