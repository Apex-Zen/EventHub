export type BadgeVariant = 'teal' | 'gray';

export interface PlanningCardData {
  id: string;
  category: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  buttonText: string;
  href: string;
}

export interface EventItemData {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt?: string;
  statusText: string;
  statusVariant?: BadgeVariant;
  href?: string;
}

export interface WelcomeHeroProps {
  userName?: string;
  subtitle?: string;
  backgroundImageSrc?: string;
}

export interface PlanningCardProps {
  card: PlanningCardData;
}

export interface PlanningSectionProps {
  title?: string;
  cards?: PlanningCardData[];
}

export interface StatusBadgeProps {
  text: string;
  variant?: BadgeVariant;
  className?: string;
}

export interface EventListItemProps {
  event: EventItemData;
}

export interface YourEventsSectionProps {
  title?: string;
  seeAllHref?: string;
  events?: EventItemData[];
}

