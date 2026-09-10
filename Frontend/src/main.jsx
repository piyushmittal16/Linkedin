import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_KEY}>
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
