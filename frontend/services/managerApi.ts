/**
 * EventHub Manager & Operations Data Layer
 * Provides realistic mock data, geofencing logic, QR ticket validation,
 * incident management, and localStorage synchronization.
 * Ready for drop-in replacement with Express + PostgreSQL backend.
 */

export interface KpiMetrics {
  liveEvents: { count: number; subtext: string };
  packagesToApprove: { count: number; subtext: string };
  vendorsToVerify: { count: number; subtext: string };
  openDisputes: { count: number; subtext: string };
}

export interface PackageItem {
  id: string;
  name: string;
  dateStr: string;
  vendorsCount: number;
  amountLkr: number;
  stageNote: string;
  status: 'pending' | 'approved' | 'changes_requested';
  vendorDetails?: { name: string; service: string; amountLkr: number }[];
}

export interface TodayEventItem {
  id: string;
  name: string;
  location: string;
  statusNote: string;
  badge: 'Live' | 'Stage 3' | 'Completed';
  category: 'private' | 'public';
  checkedInVendors?: number;
  totalVendors?: number;
  scannedGuests?: number;
  totalCapacity?: number;
}

export interface AlertItem {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeType: 'incident' | 'check' | 'open';
  time: string;
  resolved?: boolean;
}

export interface CommissionStats {
  grossBookings: string;
  commission: string;
  paidOutVendors: string;
  heldInEscrow: string;
  commissionRateText: string;
}

export interface VendorCheckIn {
  id: string;
  name: string;
  service: string;
  expectedTime: string;
  checkInTime?: string;
  status: 'checked_in' | 'delayed' | 'pending';
  distanceMeters?: number;
  lat?: number;
  lng?: number;
  phone: string;
  contactPerson: string;
}

export interface GuestItem {
  id: string;
  name: string;
  phone: string;
  rsvpStatus: 'confirmed' | 'pending' | 'declined';
  tableNumber: string;
  partySize: number;
  dietary: string;
  ticketCode: string;
  lastNotified?: string;
}

export interface IncidentItem {
  id: string;
  code: string;
  title: string;
  eventName: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'investigating' | 'resolved';
  reportedBy: string;
  timeReported: string;
  resolvedAt?: string;
  actionTaken?: string;
}

export interface QrTicketItem {
  ticketId: string;
  eventName: string;
  attendeeName: string;
  tier: string;
  seat: string;
  gate: string;
  isValid: boolean;
  isScanned: boolean;
  scannedAt?: string;
  scannedBy?: string;
}

// Waters Edge Grand Ballroom Colombo Venue Coordinates & 150m Radius Geofence
export const VENUE_GEOFENCE = {
  venueName: 'Waters Edge Grand Ballroom',
  address: '316 Sri Jayawardenepura Mawatha, Battaramulla 10120',
  latitude: 6.9044,
  longitude: 79.9103,
  radiusMeters: 150,
};

// Demo Simulated GPS Coordinates
export const SIMULATED_COORDS = {
  within150m: {
    lat: 6.9046,
    lng: 79.9105,
    label: 'Inside Waters Edge Lawn (42m from Ballroom)',
  },
  outOfBounds: {
    lat: 6.9271,
    lng: 79.8612,
    label: 'Colombo City Center / 6.2 km Out-of-Bounds',
  },
};

/**
 * Haversine formula to calculate true distance in meters between two GPS coordinates
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Initial Mock Data Sets
const INITIAL_KPIS: KpiMetrics = {
  liveEvents: { count: 2, subtext: 'today' },
  packagesToApprove: { count: 5, subtext: 'oldest waiting 6 h' },
  vendorsToVerify: { count: 3, subtext: 'documents submitted' },
  openDisputes: { count: 2, subtext: '1 past 48 h' },
};

const INITIAL_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-01',
    name: 'Perera–Silva wedding',
    dateStr: 'Sat 12 Dec · 4 vendors · LKR 612,000 · stage 1 paid',
    vendorsCount: 4,
    amountLkr: 612000,
    stageNote: 'stage 1 paid',
    status: 'pending',
    vendorDetails: [
      { name: 'Ceylon Spice Caterers', service: 'Buffet Catering', amountLkr: 280000 },
      { name: 'Light & Sound Studio', service: 'DJ & Intelligent Lighting', amountLkr: 140000 },
      { name: 'Petal & Frame Decor', service: 'Floral & Poruwa Decor', amountLkr: 112000 },
      { name: 'LensCraft Photography', service: 'Live Stream & Photo', amountLkr: 80000 },
    ],
  },
  {
    id: 'pkg-02',
    name: 'Fonseka anniversary',
    dateStr: 'Sat 19 Dec · 3 vendors · LKR 246,000',
    vendorsCount: 3,
    amountLkr: 246000,
    stageNote: 'stage 1 pending',
    status: 'pending',
    vendorDetails: [
      { name: 'Silver Spoon Catering', service: 'High Tea Catering', amountLkr: 120000 },
      { name: 'Acoustic Trio Colombo', service: 'Live Band', amountLkr: 76000 },
      { name: 'Bloom Room Florals', service: 'Floral Arrangements', amountLkr: 50000 },
    ],
  },
  {
    id: 'pkg-03',
    name: 'Jayasuriya homecoming',
    dateStr: 'Sun 3 Jan · 5 vendors · LKR 890,000',
    vendorsCount: 5,
    amountLkr: 890000,
    stageNote: 'deposit held in escrow',
    status: 'pending',
    vendorDetails: [
      { name: 'Grand Royal Banquet', service: 'Venue & Dining', amountLkr: 450000 },
      { name: 'Luminary FX', service: 'Stage Lighting & SFX', amountLkr: 160000 },
      { name: 'Orchid Elegance', service: 'Decor & Theme', amountLkr: 120000 },
      { name: 'Vintage Wheels LK', service: 'Bridal Car Fleet', amountLkr: 60000 },
      { name: 'Studio One Films', service: 'Cinematography', amountLkr: 100000 },
    ],
  },
];

const INITIAL_TODAY_EVENTS: TodayEventItem[] = [
  {
    id: 'ev-today-01',
    name: 'Perera–Silva wedding',
    location: 'Waters Edge',
    statusNote: 'Waters Edge · 2 of 4 vendors checked in',
    badge: 'Live',
    category: 'private',
    checkedInVendors: 2,
    totalVendors: 4,
  },
  {
    id: 'ev-today-02',
    name: 'Galle Fort Jazz Night',
    location: 'Galle Fort Ramparts',
    statusNote: 'Public · 1,034 scanned in',
    badge: 'Live',
    category: 'public',
    scannedGuests: 1034,
    totalCapacity: 1500,
  },
  {
    id: 'ev-today-03',
    name: 'Wickrama birthday',
    location: 'Mount Lavinia Hotel',
    statusNote: 'Done · waiting for stage 3 release',
    badge: 'Stage 3',
    category: 'private',
  },
];

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-01',
    title: 'Petal & Frame Decor is 2.5 h late',
    subtitle: 'Perera–Silva wedding · called by Nimal R.',
    badgeText: 'Incident',
    badgeType: 'incident',
    time: '2.5 h ago',
  },
  {
    id: 'alt-02',
    title: 'Ceylon Spice Caterers sent documents',
    subtitle: 'Vendor approval · BR certificate and NIC',
    badgeText: 'Check',
    badgeType: 'check',
    time: '45 m ago',
  },
  {
    id: 'alt-03',
    title: 'Dispute: refund request',
    subtitle: 'Fernando reception · 100% refund requested',
    badgeText: 'Open',
    badgeType: 'open',
    time: '3 h ago',
  },
];

const INITIAL_COMMISSION: CommissionStats = {
  grossBookings: 'LKR 8.4 M',
  commission: 'LKR 882,000',
  paidOutVendors: 'LKR 5.1 M',
  heldInEscrow: 'LKR 2.4 M',
  commissionRateText: 'Commission (avg 10.5%)',
};

const INITIAL_VENDORS: VendorCheckIn[] = [
  {
    id: 'vnd-01',
    name: 'Ceylon Spice Caterers',
    service: 'Catering & Dining',
    expectedTime: '10:00 AM',
    checkInTime: '10:15 AM',
    status: 'checked_in',
    distanceMeters: 42,
    lat: 6.9045,
    lng: 79.9104,
    phone: '+94 77 223 3445',
    contactPerson: 'Chef Rohan',
  },
  {
    id: 'vnd-02',
    name: 'Light & Sound Studio',
    service: 'AV, Acoustics & Truss',
    expectedTime: '10:30 AM',
    checkInTime: '11:00 AM',
    status: 'checked_in',
    distanceMeters: 78,
    lat: 6.9048,
    lng: 79.9101,
    phone: '+94 71 889 9001',
    contactPerson: 'Saman Kumara',
  },
  {
    id: 'vnd-03',
    name: 'Petal & Frame Decor',
    service: 'Floral Setup & Backdrop',
    expectedTime: '11:30 AM',
    status: 'delayed',
    phone: '+94 76 445 5667',
    contactPerson: 'Kavindi Perera',
  },
  {
    id: 'vnd-04',
    name: 'LensCraft Photography',
    service: 'Cinematography & Drone',
    expectedTime: '02:00 PM',
    status: 'pending',
    phone: '+94 70 112 2334',
    contactPerson: 'Malith Silva',
  },
];

const INITIAL_GUESTS: GuestItem[] = [
  {
    id: 'gst-01',
    name: 'Kamal Perera',
    phone: '+94771234567',
    rsvpStatus: 'confirmed',
    tableNumber: 'Table 4 (VIP)',
    partySize: 2,
    dietary: 'Strict Vegetarian / Jain',
    ticketCode: 'EH-PS-0401',
    lastNotified: 'Yesterday 18:20',
  },
  {
    id: 'gst-02',
    name: 'Dilini Silva',
    phone: '+94719876543',
    rsvpStatus: 'pending',
    tableNumber: 'Table 4 (VIP)',
    partySize: 2,
    dietary: 'Standard Halal',
    ticketCode: 'EH-PS-0402',
    lastNotified: '3 days ago',
  },
  {
    id: 'gst-03',
    name: 'Nimal Rodrigo',
    phone: '+94765551234',
    rsvpStatus: 'confirmed',
    tableNumber: 'Table 7',
    partySize: 1,
    dietary: 'Standard',
    ticketCode: 'EH-PS-0701',
    lastNotified: '2 days ago',
  },
  {
    id: 'gst-04',
    name: 'Anoma Jayasuriya',
    phone: '+94703334444',
    rsvpStatus: 'declined',
    tableNumber: 'Unassigned',
    partySize: 1,
    dietary: 'None',
    ticketCode: 'EH-PS-NONE',
    lastNotified: '4 days ago',
  },
  {
    id: 'gst-05',
    name: 'Dr. Priyantha Fernando',
    phone: '+94778889999',
    rsvpStatus: 'confirmed',
    tableNumber: 'Table 2 (Family)',
    partySize: 3,
    dietary: 'Gluten-Free',
    ticketCode: 'EH-PS-0201',
    lastNotified: 'Yesterday 19:40',
  },
];

const INITIAL_INCIDENTS: IncidentItem[] = [
  {
    id: 'inc-01',
    code: 'INC-2026-1024',
    title: 'Petal & Frame Decor is 2.5 h late',
    eventName: 'Perera–Silva wedding',
    severity: 'critical',
    status: 'active',
    reportedBy: 'Dilini R. (Coordinator)',
    timeReported: '14:00 (2.5h overdue)',
  },
  {
    id: 'inc-02',
    code: 'INC-2026-1023',
    title: 'Gate 2 QR Scanner Network Drop',
    eventName: 'Galle Fort Jazz Night',
    severity: 'medium',
    status: 'resolved',
    reportedBy: 'Gate 2 Lead',
    timeReported: '15:10',
    resolvedAt: '15:25',
    actionTaken: 'Switched scanner station to Offline Cached Mode.',
  },
];

const INITIAL_QR_TICKETS: Record<string, QrTicketItem> = {
  'GFJ-2026-9041': {
    ticketId: 'GFJ-2026-9041',
    eventName: 'Galle Fort Jazz Night',
    attendeeName: 'Sunil De Silva',
    tier: 'VIP Rampart Access',
    seat: 'A-14',
    gate: 'Gate 1 (Main Arch)',
    isValid: true,
    isScanned: false,
  },
  'GFJ-2026-9042': {
    ticketId: 'GFJ-2026-9042',
    eventName: 'Galle Fort Jazz Night',
    attendeeName: 'Natasha Wijeratne',
    tier: 'General Admission',
    seat: 'Standing B',
    gate: 'Gate 2 (Lighthouse)',
    isValid: true,
    isScanned: true,
    scannedAt: '16:42 · Operator Kasun (Gate 2)',
    scannedBy: 'Gate 2 - Handheld Scanner 03',
  },
  'GFJ-2026-9043': {
    ticketId: 'GFJ-2026-9043',
    eventName: 'Galle Fort Jazz Night',
    attendeeName: 'Mahesh Gunawardena',
    tier: 'VIP Rampart Access',
    seat: 'VIP Lounge Table 3',
    gate: 'Gate 1 (Main Arch)',
    isValid: true,
    isScanned: false,
  },
};

// Safe LocalStorage Helper
function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(`eventhub_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`eventhub_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

/**
 * Main Service API for Event Manager Dashboard
 */
export const managerApi = {
  getKpiMetrics(): KpiMetrics {
    return getStorage('kpis', INITIAL_KPIS);
  },

  getPackageQueue(): PackageItem[] {
    return getStorage('packages', INITIAL_PACKAGES);
  },

  approvePackage(pkgId: string): PackageItem[] {
    const pkgs = this.getPackageQueue();
    const updated = pkgs.map((p) =>
      p.id === pkgId ? { ...p, status: 'approved' as const } : p
    );
    setStorage('packages', updated);

    // Decrement pending packages count
    const kpis = this.getKpiMetrics();
    if (kpis.packagesToApprove.count > 0) {
      kpis.packagesToApprove.count -= 1;
      setStorage('kpis', kpis);
    }
    return updated;
  },

  getTodayEvents(): TodayEventItem[] {
    return getStorage('today_events', INITIAL_TODAY_EVENTS);
  },

  getAlerts(): AlertItem[] {
    return getStorage('alerts', INITIAL_ALERTS);
  },

  resolveAlert(alertId: string): AlertItem[] {
    const alerts = this.getAlerts();
    const updated = alerts.map((a) =>
      a.id === alertId ? { ...a, resolved: true } : a
    );
    setStorage('alerts', updated);
    return updated;
  },

  getCommissionStats(): CommissionStats {
    return INITIAL_COMMISSION;
  },

  getVendors(): VendorCheckIn[] {
    return getStorage('vendors', INITIAL_VENDORS);
  },

  checkInVendorWithGps(
    vendorId: string,
    latitude: number,
    longitude: number
  ): { success: boolean; distanceMeters: number; message: string; vendor?: VendorCheckIn } {
    const distance = calculateHaversineDistance(
      latitude,
      longitude,
      VENUE_GEOFENCE.latitude,
      VENUE_GEOFENCE.longitude
    );

    const isInside = distance <= VENUE_GEOFENCE.radiusMeters;
    const vendors = this.getVendors();
    const target = vendors.find((v) => v.id === vendorId);

    if (!target) {
      return { success: false, distanceMeters: distance, message: 'Vendor not found in roster.' };
    }

    if (!isInside) {
      return {
        success: false,
        distanceMeters: distance,
        message: `GPS check-in failed: Coordinates are ${distance}m away (Geofence threshold is ${VENUE_GEOFENCE.radiusMeters}m). Vendor is out of bounds!`,
      };
    }

    const now = new Date();
    const checkInTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = vendors.map((v) =>
      v.id === vendorId
        ? {
            ...v,
            status: 'checked_in' as const,
            checkInTime: checkInTimeStr,
            distanceMeters: distance,
            lat: latitude,
            lng: longitude,
          }
        : v
    );

    setStorage('vendors', updated);

    // Update today's wedding check-in count
    const todayEvents = this.getTodayEvents();
    const wedding = todayEvents.find((e) => e.id === 'ev-today-01');
    if (wedding) {
      const checkedCount = updated.filter((v) => v.status === 'checked_in').length;
      wedding.checkedInVendors = checkedCount;
      wedding.statusNote = `Waters Edge · ${checkedCount} of 4 vendors checked in`;
      setStorage('today_events', todayEvents);
    }

    return {
      success: true,
      distanceMeters: distance,
      message: `Verified! ${target.name} checked in successfully at ${checkInTimeStr} (${distance}m from ballroom).`,
      vendor: updated.find((v) => v.id === vendorId),
    };
  },

  getGuests(search: string = '', status: string = 'all'): GuestItem[] {
    const list: GuestItem[] = getStorage('guests', INITIAL_GUESTS);
    return list.filter((g) => {
      const matchSearch =
        !search ||
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.phone.includes(search) ||
        g.tableNumber.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === 'all' || g.rsvpStatus === status;
      return matchSearch && matchStatus;
    });
  },

  updateGuestRsvp(guestId: string, newStatus: 'confirmed' | 'pending' | 'declined'): GuestItem[] {
    const guests = getStorage('guests', INITIAL_GUESTS);
    const updated = guests.map((g) =>
      g.id === guestId ? { ...g, rsvpStatus: newStatus } : g
    );
    setStorage('guests', updated);
    return updated;
  },

  getIncidents(): IncidentItem[] {
    return getStorage('incidents', INITIAL_INCIDENTS);
  },

  logIncident(title: string, severity: IncidentItem['severity'], reportedBy: string): IncidentItem {
    const incidents = this.getIncidents();
    const newInc: IncidentItem = {
      id: `inc-${Date.now()}`,
      code: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      eventName: 'Perera–Silva wedding',
      severity,
      status: 'active',
      reportedBy: reportedBy || 'Ops Control',
      timeReported: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [newInc, ...incidents];
    setStorage('incidents', updated);
    return newInc;
  },

  resolveIncident(incidentId: string, notes?: string): IncidentItem[] {
    const incidents = this.getIncidents();
    const updated = incidents.map((inc) =>
      inc.id === incidentId
        ? {
            ...inc,
            status: 'resolved' as const,
            resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionTaken: notes || 'Resolved by Event Manager Shehan',
          }
        : inc
    );
    setStorage('incidents', updated);
    return updated;
  },

  /**
   * QR Ticket Gate Scan & Fraud / Duplicate Validator
   */
  validateQrTicket(
    ticketId: string,
    isOffline: boolean = false
  ): {
    status: 'valid' | 'duplicate' | 'invalid';
    ticket?: QrTicketItem;
    message: string;
    isOfflineVerified: boolean;
  } {
    const tickets: Record<string, QrTicketItem> = getStorage('qr_tickets', INITIAL_QR_TICKETS);
    const trimmedId = ticketId.trim().toUpperCase();
    const ticket = tickets[trimmedId];

    if (!ticket) {
      return {
        status: 'invalid',
        message: `⚠️ INVALID TICKET: Code "${trimmedId}" is not in the system. Check for counterfeit or incorrect event pass.`,
        isOfflineVerified: isOffline,
      };
    }

    if (ticket.isScanned) {
      return {
        status: 'duplicate',
        ticket,
        message: `⛔ DUPLICATE SCAN DETECTED! Ticket ${ticket.ticketId} (${ticket.attendeeName}) was ALREADY scanned at ${ticket.scannedAt || 'earlier today'}. DENY ENTRY.`,
        isOfflineVerified: isOffline,
      };
    }

    // Mark as scanned
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    ticket.isScanned = true;
    ticket.scannedAt = `${nowStr} · Gate 1 Lead Validator`;
    ticket.scannedBy = 'Handheld Scanner (Online)';
    tickets[trimmedId] = ticket;
    setStorage('qr_tickets', tickets);

    // Increment today's Jazz night scan count
    const todayEvents = this.getTodayEvents();
    const jazzNight = todayEvents.find((e) => e.id === 'ev-today-02');
    if (jazzNight && jazzNight.scannedGuests !== undefined) {
      jazzNight.scannedGuests += 1;
      jazzNight.statusNote = `Public · ${jazzNight.scannedGuests.toLocaleString()} scanned in`;
      setStorage('today_events', todayEvents);
    }

    return {
      status: 'valid',
      ticket,
      message: `✅ ADMIT: Welcome ${ticket.attendeeName}! (${ticket.tier} · ${ticket.seat}). Entry logged at ${nowStr}.`,
      isOfflineVerified: isOffline,
    };
  },

  getOfflineQueueCount(): number {
    return getStorage('offline_scans_queue', []).length;
  },
};
