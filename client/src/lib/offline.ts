/**
 * Offline Service
 * Gère la synchronisation des données en mode hors-ligne
 */

export interface OfflineData {
  type: "bilan" | "session" | "profile";
  timestamp: number;
  data: any;
  synced: boolean;
}

const OFFLINE_STORAGE_KEY = "genese_offline_data";
const SYNC_QUEUE_KEY = "genese_sync_queue";

/**
 * Vérifier la connexion internet
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Écouter les changements de connexion
 */
export function onConnectionChange(
  callback: (isOnline: boolean) => void
): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // Retourner une fonction pour arrêter l'écoute
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

/**
 * Sauvegarder des données localement (hors-ligne)
 */
export function saveOfflineData(
  type: OfflineData["type"],
  data: any
): void {
  const offlineData: OfflineData = {
    type,
    timestamp: Date.now(),
    data,
    synced: false,
  };

  const queue = getOfflineQueue();
  queue.push(offlineData);

  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  console.log(`✅ Données sauvegardées hors-ligne: ${type}`);
}

/**
 * Récupérer la file d'attente de synchronisation
 */
export function getOfflineQueue(): OfflineData[] {
  const queue = localStorage.getItem(SYNC_QUEUE_KEY);
  return queue ? JSON.parse(queue) : [];
}

/**
 * Synchroniser les données avec le serveur
 */
export async function syncOfflineData(
  apiEndpoint: string
): Promise<{ success: number; failed: number }> {
  if (!isOnline()) {
    console.log("⚠️ Mode hors-ligne: impossible de synchroniser");
    return { success: 0, failed: 0 };
  }

  const queue = getOfflineQueue();
  let successCount = 0;
  let failedCount = 0;

  for (const item of queue) {
    try {
      const response = await fetch(`${apiEndpoint}/${item.type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.data),
      });

      if (response.ok) {
        item.synced = true;
        successCount++;
        console.log(`✅ Synchronisé: ${item.type}`);
      } else {
        failedCount++;
        console.error(`❌ Erreur de synchronisation: ${item.type}`);
      }
    } catch (error) {
      failedCount++;
      console.error(`❌ Erreur réseau: ${item.type}`, error);
    }
  }

  // Nettoyer la file d'attente des éléments synchronisés
  const remainingQueue = queue.filter((item) => !item.synced);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remainingQueue));

  console.log(
    `📊 Synchronisation: ${successCount} réussis, ${failedCount} échoués`
  );
  return { success: successCount, failed: failedCount };
}

/**
 * Vider la file d'attente de synchronisation
 */
export function clearOfflineQueue(): void {
  localStorage.removeItem(SYNC_QUEUE_KEY);
  console.log("🗑️ File d'attente vidée");
}

/**
 * Obtenir le nombre d'éléments en attente de synchronisation
 */
export function getPendingSyncCount(): number {
  const queue = getOfflineQueue();
  return queue.filter((item) => !item.synced).length;
}

/**
 * Afficher le statut de synchronisation
 */
export function getSyncStatus(): {
  isOnline: boolean;
  pendingCount: number;
  lastSync: number | null;
} {
  const lastSync = localStorage.getItem("genese_last_sync");
  return {
    isOnline: isOnline(),
    pendingCount: getPendingSyncCount(),
    lastSync: lastSync ? parseInt(lastSync) : null,
  };
}
