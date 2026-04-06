import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

type ConnectionStatus = "checking" | "connected" | "disconnected";

export function ApiStatus() {
  const [status, setStatus] = useState<ConnectionStatus>("checking");

  useEffect(() => {
    checkConnection();
    // Verifica a cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  async function checkConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/games/upcoming`, {
        method: "GET",
        signal: AbortSignal.timeout(5000), // 5 segundos de timeout
      });
      setStatus(response.ok ? "connected" : "disconnected");
    } catch (error) {
      setStatus("disconnected");
    }
  }

  if (status === "checking") {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-xs">
        <Loader2 size={14} className="animate-spin" />
        <span className="hidden sm:inline">Verificando...</span>
      </div>
    );
  }

  if (status === "connected") {
    return (
      <div className="flex items-center gap-2 text-green-600 text-xs">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="hidden sm:inline font-medium">API Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-orange-600 text-xs">
      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
      <span className="hidden sm:inline font-medium">Modo Offline</span>
    </div>
  );
}