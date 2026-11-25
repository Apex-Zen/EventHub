export interface TicketTier {
  id: string;
  name: string;
  price: number;
  ticketsAvailable: number;
}

export interface PublicEventFormData {
  eventName: string;
  date: string;
  startTime: string;
  district: string;
  venue: string;
  coverImageSrc: string;
  coverImageName: string;
  coverImageMeta: string;
}
