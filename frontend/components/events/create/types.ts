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

export const EVENT_TYPE_OPTIONS = [
  'Wedding',
  'Homecoming',
  'Engagement Party',
  'Pre-shoot',
  'Birthday Party',
  'Anniversary Celebration',
  'Coming of Age Ceremony',
  'Housewarming Party',
  'Almsgiving',
  'Annual Get-together',
  'School Concert',
  'Annual Award Ceremony',
] as const;

export const DISTRICT_OPTIONS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
] as const;
