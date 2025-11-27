import { IssueType } from "./AppVitals.constants";

export interface CrashIssue {
  id: string;
  title: string;
  message: string;
  errorMessage: string;
  stackTrace: string;
  affectedUsers: number;
  occurrences: number;
  firstSeen: string;
  lastSeen: string;
  appVersion: string;
  osVersion: string;
  device: string;
  trend: number[];
}

export interface ANRIssue {
  id: string;
  title: string;
  message: string;
  anrMessage: string;
  affectedUsers: number;
  occurrences: number;
  firstSeen: string;
  lastSeen: string;
  appVersion: string;
  osVersion: string;
  device: string;
  trend: number[];
}

export interface NonFatalIssue {
  id: string;
  title: string;
  message: string;
  errorMessage: string;
  type: string;
  issueType: string;
  affectedUsers: number;
  occurrences: number;
  firstSeen: string;
  lastSeen: string;
  appVersion: string;
  osVersion: string;
  device: string;
  trend: number[];
}

export interface VitalsFilters {
  issueType: IssueType;
  appVersion: string;
  osVersion: string;
  device: string;
}

export interface VitalsStats {
  crashes: number;
  anrs: number;
  nonFatals: number;
  crashFreeUsers?: number;
  crashFreeSessions?: number;
  anrFreeUsers?: number;
  anrFreeSessions?: number;
  firingAlerts?: number;
  activeAlerts?: number;
}
