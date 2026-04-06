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
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Loader2 size={16} className="animate-spin" />
        <span className="hidden sm:inline">Verificando API...</span>
      </div>
    );
  }

  if (status === "connected") {
    return (
      <div className="flex items-center gap-2 text-green-400 text-sm">
        <CheckCircle2 size={16} />
        <span className="hidden sm:inline">API Conectada</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-yellow-400 text-sm">
      <XCircle size={16} />
      <span className="hidden sm:inline">API Offline</span>
    </div>
  );
}
