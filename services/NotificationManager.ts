import { UserSettings } from '../types';

class NotificationManagerService {
  private intervalId: number | null = null;

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn("This browser does not support desktop notification");
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  startReminders(settings: UserSettings) {
    this.stopReminders(); // Clear existing

    if (!settings.notificationsEnabled || Notification.permission !== 'granted') {
      return;
    }

    // Simple interval based reminder for the prototype
    // In a real app, this would be more sophisticated (checking time windows)
    const intervalMs = settings.reminderFrequencyMinutes * 60 * 1000;
    
    this.intervalId = window.setInterval(() => {
      this.checkAndSendReminder(settings);
    }, intervalMs);

    console.log(`[NotificationManager] Started reminders every ${settings.reminderFrequencyMinutes} mins`);
  }

  stopReminders() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private checkAndSendReminder(settings: UserSettings) {
    const now = new Date();
    const currentHour = now.getHours();
    
    const [startHour] = settings.reminderStartTime.split(':').map(Number);
    const [endHour] = settings.reminderEndTime.split(':').map(Number);

    if (currentHour >= startHour && currentHour < endHour) {
      this.sendNotification("Hydration Critical", "Your fluid levels are dropping. Verify intake now.");
    }
  }

  private sendNotification(title: string, body: string) {
    new Notification(title, {
      body: body,
      icon: '/vite.svg', // Placeholder
      silent: false,
    });
  }
}

export const NotificationManager = new NotificationManagerService();