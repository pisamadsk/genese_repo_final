import { useEffect, useState } from "react";
import { WifiOff, Wifi, Loader2 } from "lucide-react";
import { isOnline, onConnectionChange, getPendingSyncCount } from "@/lib/offline";

/**
 * ConnectionStatus Component
 * Affiche le statut de connexion et les données en attente de synchronisation
 */

export default function ConnectionStatus() {
  const [online, setOnline] = useState(isOnline());
  const [pendingSync, setPendingSync] = useState(getPendingSyncCount());

  useEffect(() => {
    // Écouter les changements de connexion
    const unsubscribe = onConnectionChange((isOnlineNow) => {
      setOnline(isOnlineNow);
      setPendingSync(getPendingSyncCount());
    });

    return unsubscribe;
  }, []);

  if (online) {
    return null; // Ne pas afficher si en ligne
  }

  return (
    <div className="fixed bottom-24 left-0 right-0 z-40 flex justify-center px-4">
      <div className="bg-orange-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 max-w-md">
        <WifiOff size={16} />
        <span className="text-sm font-medium">
          Mode hors-ligne
          {pendingSync > 0 && ` (${pendingSync} en attente)`}
        </span>
      </div>
    </div>
  );
}

/**
 * SyncStatus Component
 * Affiche le statut de synchronisation détaillé
 */

export function SyncStatus() {
  const [syncing, setSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(getPendingSyncCount());
  const [online, setOnline] = useState(isOnline());

  useEffect(() => {
    const unsubscribe = onConnectionChange((isOnlineNow) => {
      setOnline(isOnlineNow);
      setPendingCount(getPendingSyncCount());
    });

    return unsubscribe;
  }, []);

  if (online && pendingCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {syncing ? (
        <>
          <Loader2 size={14} className="animate-spin text-orange-500" />
          <span>Synchronisation...</span>
        </>
      ) : online ? (
        <>
          <Wifi size={14} className="text-green-500" />
          <span>
            {pendingCount > 0
              ? `${pendingCount} en attente de sync`
              : "Synchronisé"}
          </span>
        </>
      ) : (
        <>
          <WifiOff size={14} className="text-orange-500" />
          <span>{pendingCount} données en attente</span>
        </>
      )}
    </div>
  );
}
