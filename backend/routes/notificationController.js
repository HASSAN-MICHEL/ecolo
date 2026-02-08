const notifications = [];

const notificationController = {
  addNotification(message, type = 'info') {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    notifications.unshift(notification); // Ajoute au début du tableau
    return notification;
  },

  getNotifications() {
    return notifications;
  },

  clearNotifications() {
    notifications.length = 0;
  }
};

export default notificationController;