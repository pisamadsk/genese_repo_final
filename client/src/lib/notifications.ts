/**
 * Notifications Service
 * Gère les notifications push et les rappels locaux
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * Demander la permission pour les notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("Ce navigateur ne supporte pas les notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

/**
 * Envoyer une notification
 */
export function sendNotification(options: NotificationOptions): void {
  if (Notification.permission === "granted") {
    new Notification(options.title, {
      body: options.body,
      icon: options.icon || "/logo.png",
      badge: options.badge,
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
    });
  }
}

/**
 * Programmer une notification pour plus tard
 */
export function scheduleNotification(
  options: NotificationOptions,
  delayMs: number
): NodeJS.Timeout {
  return setTimeout(() => {
    sendNotification(options);
  }, delayMs);
}

/**
 * Programmer une notification quotidienne
 */
export function scheduleDailyNotification(
  options: NotificationOptions,
  hour: number,
  minute: number = 0
): void {
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hour, minute, 0, 0);

  // Si l'heure est déjà passée aujourd'hui, programmer pour demain
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delayMs = scheduledTime.getTime() - now.getTime();

  // Programmer la première notification
  const timeout = setTimeout(() => {
    sendNotification(options);

    // Puis programmer les notifications quotidiennes
    setInterval(() => {
      sendNotification(options);
    }, 24 * 60 * 60 * 1000); // 24 heures
  }, delayMs);

  // Stocker le timeout pour pouvoir l'annuler si nécessaire
  localStorage.setItem(
    `notification_${options.tag}`,
    JSON.stringify({ timeout, scheduledTime })
  );
}

/**
 * Envoyer une notification de rappel de séance
 */
export function sendSessionReminder(sessionName: string): void {
  sendNotification({
    title: "Rappel de séance",
    body: `C'est l'heure de votre séance : ${sessionName}`,
    icon: "/logo.png",
    tag: "session-reminder",
    requireInteraction: true,
  });
}

/**
 * Envoyer une notification de motivation
 */
export function sendMotivationNotification(): void {
  const messages = [
    "Vous faites du bon travail ! Continuez vos efforts 💪",
    "Chaque mouvement compte. Restez constant ! 🎯",
    "Votre corps vous remercie. Continuez ! 🙌",
    "La régularité est la clé du succès. Vous y êtes presque ! ⭐",
    "Prenez soin de vous. Vous le méritez ! 💚",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  sendNotification({
    title: "Message de motivation",
    body: randomMessage,
    icon: "/logo.png",
    tag: "motivation",
  });
}

/**
 * Envoyer une notification d'accomplissement
 */
export function sendAchievementNotification(achievement: string): void {
  sendNotification({
    title: "🏆 Accomplissement débloqué !",
    body: achievement,
    icon: "/logo.png",
    tag: "achievement",
    requireInteraction: true,
  });
}
