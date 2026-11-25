
export interface VendorItem {
  name: string;
  amount: string;
}

export interface CheckItem {
  title: string;
  subtitle: string;
  status: 'OK' | 'Watch';
}

export interface PackageRecord {
  id: string;
  name: string;
  clientSubtitle: string;
  date: string;
  total: string;
  waitingTime: string;
  fullDateVenueSubtitle: string;
  vendors: VendorItem[];
  stage1Paid: string;
  checks: CheckItem[];
  status: 'waiting' | 'approved' | 'rejected';
  rejectionReason?: string;
  rejectionDetails?: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export const INITIAL_PACKAGES: PackageRecord[] = [
  {
    id: 'pkg-01',
    name: 'Perera–Silva wedding',
    clientSubtitle: 'Nadeesha Perera · 4 vendors',
    date: 'Sat 12 Dec',
    total: 'LKR 612,000',
    waitingTime: '6 h',
    fullDateVenueSubtitle: 'Sat 12 Dec 2026, night · Waters Edge, Grand Ballroom · 250 guests',
    vendors: [
      { name: 'Waters Edge (venue)', amount: 'LKR 650,000' },
      { name: 'Ceylon Spice Caterers', amount: 'LKR 180,000' },
      { name: 'Lens & Light Studio', amount: 'LKR 180,000' },
      { name: 'Petal & Frame Decor', amount: 'LKR 95,000' },
    ],
    stage1Paid: 'LKR 122,400',
    checks: [
      { title: 'All vendors accepted', subtitle: '4 of 4 within the 48 h hold', status: 'OK' },
      { title: 'No date clashes', subtitle: 'Diaries checked', status: 'OK' },
      { title: 'Vendor Petal & Frame Decor', subtitle: '4 late check-ins this year', status: 'Watch' },
    ],
    status: 'waiting',
  },
  {
    id: 'pkg-02',
    name: 'Fonseka anniversary',
    clientSubtitle: 'Roshan Fonseka · 3 vendors',
    date: 'Sat 19 Dec',
    total: 'LKR 248,000',
    waitingTime: '3 h',
    fullDateVenueSubtitle: 'Sat 19 Dec 2026, evening · Cinnamon Lakeside · 120 guests',
    vendors: [
      { name: 'Cinnamon Lakeside (venue)', amount: 'LKR 120,000' },
      { name: 'Silver Spoon Catering', amount: 'LKR 65,000' },
      { name: 'Acoustic Trio Colombo', amount: 'LKR 45,000' },
      { name: 'Bloom Room Florals', amount: 'LKR 18,000' },
    ],
    stage1Paid: 'LKR 49,600',
    checks: [
      { title: 'All vendors accepted', subtitle: '3 of 3 within the 48 h hold', status: 'OK' },
      { title: 'No date clashes', subtitle: 'Diaries checked', status: 'OK' },
      { title: 'Vendor Acoustic Trio Colombo', subtitle: 'Confirmed sound limiter compliance', status: 'OK' },
    ],
    status: 'waiting',
  },
  {
    id: 'pkg-03',
    name: 'Jayasuriya homecoming',
    clientSubtitle: 'Kumudu J. · 5 vendors',
    date: 'Sun 3 Jan',
    total: 'LKR 890,000',
    waitingTime: '1 h',
    fullDateVenueSubtitle: 'Sun 3 Jan 2027, noon · Kingsbury Hotel · 350 guests',
    vendors: [
      { name: 'Kingsbury Hotel (venue)', amount: 'LKR 450,000' },
      { name: 'Grand Royal Banquet', amount: 'LKR 180,000' },
      { name: 'Luminary FX', amount: 'LKR 110,000' },
      { name: 'Orchid Elegance', amount: 'LKR 90,000' },
      { name: 'Studio One Films', amount: 'LKR 60,000' },
    ],
    stage1Paid: 'LKR 178,000',
    checks: [
      { title: 'All vendors accepted', subtitle: '5 of 5 within the 48 h hold', status: 'OK' },
      { title: 'No date clashes', subtitle: 'Diaries checked', status: 'OK' },
      { title: 'Vendor Luminary FX', subtitle: 'Requires external generator permit', status: 'Watch' },
    ],
    status: 'waiting',
  },
  {
    id: 'pkg-04',
    name: 'Office awards night',
    clientSubtitle: 'Dialog HR · 3 vendors',
    date: 'Fri 15 Jan',
    total: 'LKR 455,000',
    waitingTime: '20 min',
    fullDateVenueSubtitle: 'Fri 15 Jan 2027, night · Shangri-La Colombo · 180 guests',
    vendors: [
      { name: 'Shangri-La Ballroom (venue)', amount: 'LKR 280,000' },
      { name: 'AudioCraft LK (AV)', amount: 'LKR 95,000' },
      { name: 'EventPlanners Co (Coordination)', amount: 'LKR 80,000' },
    ],
    stage1Paid: 'LKR 91,000',
    checks: [
      { title: 'All vendors accepted', subtitle: '3 of 3 within the 48 h hold', status: 'OK' },
      { title: 'No date clashes', subtitle: 'Corporate blackout calendar verified', status: 'OK' },
      { title: 'Dialog HR PO Approval', subtitle: 'Finance billing code matched', status: 'OK' },
    ],
    status: 'waiting',
  },
  {
    id: 'pkg-05',
    name: 'Wickrama 50th gala',
    clientSubtitle: 'Sunil Wickrama · 4 vendors',
    date: 'Sat 23 Jan',
    total: 'LKR 520,000',
    waitingTime: '10 min',
    fullDateVenueSubtitle: 'Sat 23 Jan 2027, night · Mount Lavinia Hotel · 150 guests',
    vendors: [
      { name: 'Empire Ballroom (venue)', amount: 'LKR 240,000' },
      { name: 'Spice Kitchen (Buffet)', amount: 'LKR 140,000' },
      { name: 'DJ Master LK', amount: 'LKR 60,000' },
      { name: 'Floral Wonders', amount: 'LKR 80,000' },
    ],
    stage1Paid: 'LKR 104,000',
    checks: [
      { title: 'All vendors accepted', subtitle: '4 of 4 within the 48 h hold', status: 'OK' },
      { title: 'No date clashes', subtitle: 'Diaries checked', status: 'OK' },
      { title: 'Vendor DJ Master LK', subtitle: 'Licensing verified', status: 'OK' },
    ],
    status: 'waiting',
  },
];