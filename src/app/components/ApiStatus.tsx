import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { API_BASE_URL, API_STATUS_TIMEOUT_MS } from "../utils/api";

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
      const response = await fetch(`${API_BASE_URL}/openapi.json`, {
        method: "GET",
        signal: AbortSignal.timeout(API_STATUS_TIMEOUT_MS),
      });

      setStatus(response.ok ? "connected" : "disconnected");
    } catch (error) {
      setStatus("disconnected");
    }
  }

  if (status === "checking") {
    return (
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-xs">
        <Loader2 size={14} className="animate-spin" />
        <span className="hidden sm:inline">Verificando...</span>
      </div>
    );
  }

  if (status === "connected") {
    return (
      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-xs">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="hidden sm:inline font-medium">API Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 text-xs">
      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
      <span className="hidden sm:inline font-medium">Modo Offline</span>
    </div>
  );
}