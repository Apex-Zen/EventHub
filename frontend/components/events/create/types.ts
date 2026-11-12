export type TimeSlot = 'Day' | 'Night' | 'Both';

export interface StepItem {
  number: number;
  label: string;
}

export interface MatchingRule {
  text: string;
}

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
}

export interface EventDetailsFormData {
  eventType: string;
  targetDate: string; // ISO date string or formatted date e.g. "2026-12-12"
  timeSlot: TimeSlot;
  district: string;
  expectedAttendance: number;
  totalBudget: number;
}

