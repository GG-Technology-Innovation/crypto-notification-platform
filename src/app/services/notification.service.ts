import { Injectable } from '@angular/core';

export type notification = {
  id: number;
  symbol: string;
  minFundingRate: number;
  maxFundingRate: number;
  fundingRate: number | null;
  fundingRateLastUpdate: Date | null;
  fundingRateStatus: 'positive' | 'negative' | 'neutral' | null;
  interestRate: number | null;
  bateu: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications: Array<notification> = [];

  constructor() {
    if (localStorage.getItem('notifications') !== null) {
      this.notifications = JSON.parse(localStorage.getItem('notifications')!);
    }
  }

  addNotification(notification: notification) {
    this.notifications.push({
      ...notification,
      fundingRate: null,
      fundingRateLastUpdate: null,
      fundingRateStatus: null,
    });
    localStorage.setItem('notifications', JSON.stringify(this.notifications));

    return this.notifications;
  }

  deleteNotification(id: number) {
    this.notifications = this.notifications.filter(
      (notification) => notification.id !== id
    );
    localStorage.setItem('notifications', JSON.stringify(this.notifications));

    return this.notifications;
  }

  editNotification(notification: notification) {
    this.notifications = this.notifications.map((n) =>
      n.id === notification.id ? notification : n
    );
    localStorage.setItem('notifications', JSON.stringify(this.notifications));

    return this.notifications;
  }

  saveAll(notifications: Array<notification>) {
    this.notifications = notifications;
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
    return this.notifications;
  }
}
