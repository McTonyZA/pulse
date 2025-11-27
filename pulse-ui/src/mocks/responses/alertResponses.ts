/**
 * Alerts Management Mock Responses
 */

export const mockAlertResponses = {
  getAlerts: {
    data: {
      total_alerts: 0,
      alerts: [],
      limit: 10,
      offset: 0,
    },
    status: 200,
  },
  createAlert: {
    data: {
      id: Date.now(),
      name: "New Mock Alert",
      description: "Mock alert description",
      severity: 3,
      currentState: "ACTIVE",
      createdAt: new Date().toISOString(),
    },
    status: 201,
  },
  updateAlert: {
    data: { success: true },
    status: 200,
  },
  deleteAlert: {
    data: { success: true },
    status: 200,
  },
  snoozeAlert: {
    data: { success: true },
    status: 200,
  },
  resumeAlert: {
    data: { success: true },
    status: 200,
  },
};
