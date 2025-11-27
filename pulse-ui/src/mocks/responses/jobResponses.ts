/**
 * Job Management Mock Responses
 */

export const mockJobResponses = {
  getJobs: {
    data: {
      interactions: [],
      totalInteractions: 0,
    },
    status: 200,
  },
  getJobDetails: (identifier: string | number) => ({
    data: {
      interactionName:
        typeof identifier === "string" ? identifier : "Mock_Interaction",
      description: "Mock interaction description",
      id: typeof identifier === "number" ? identifier : Date.now(),
      uptimeLowerLimit: 100,
      uptimeMidLimit: 500,
      uptimeUpperLimit: 1000,
      interactionThreshold: 60000,
      status: "RUNNING",
      eventSequence: [
        {
          eventName: "mock_start_event",
          props: [
            { propName: "user_id", propValue: "string", operator: "EQUALS" },
            { propName: "session_id", propValue: "string", operator: "EQUALS" },
          ],
          isBlacklisted: false,
        },
        {
          eventName: "mock_success_event",
          props: [
            { propName: "user_id", propValue: "string", operator: "EQUALS" },
            { propName: "success", propValue: "true", operator: "EQUALS" },
          ],
          isBlacklisted: false,
        },
      ],
      globalBlacklistedEvents: [
        {
          eventName: "error_event",
          props: [
            {
              propName: "error_type",
              propValue: "critical",
              operator: "EQUALS",
            },
          ],
          isBlacklisted: true,
        },
      ],
      createdAt: 1705312800000,
      createdBy: "mock@dream11.com",
      updatedAt: "1705312800000",
      updatedBy: "mock@dream11.com",
    },
    status: 200,
  }),

  createJob: {
    data: {
      interactionName: "New_Mock_Interaction",
      description: "New mock interaction",
      id: Date.now(),
      status: "STOPPED",
      createdAt: Date.now(),
      createdBy: "mock@dream11.com",
    },
    status: 201,
  },

  updateJobStatus: {
    data: { success: true },
    status: 200,
  },

  deleteJob: {
    data: { success: true },
    status: 200,
  },
};
