
export type DonationStatus = 'pending' | 'successful' | 'failed';

export interface Donation {
    id: number;
    transactionId: string;
    donorName: string;
    amount: number;
    purpose: string;
    date: string;
    status: DonationStatus;
    panCard: string;
    message?: string;
    utr?: string;
}

export const initialDonations: Donation[] = [
    { id: 1, transactionId: 'TXN202407A1B2C', donorName: 'Anand Kumar', amount: 5000, purpose: 'Annadhanam', date: '2024-07-22T10:00:00Z', status: 'successful', panCard: 'ABCDE1234F', message: 'For a good cause', utr: 'HDFCR52024072212345678' },
    { id: 2, transactionId: 'TXN202407D3E4F', donorName: 'Priya Sharma', amount: 50, purpose: 'Saplings', date: '2024-07-21T11:30:00Z', status: 'successful', panCard: 'FGHIJ5678K', utr: 'ICICR52024072112345678' },
    { id: 3, transactionId: 'TXN202407G5H6I', donorName: 'Ramesh Gupta', amount: 1000, purpose: 'Social Needs', date: '2024-07-21T15:00:00Z', status: 'pending', panCard: 'KLMNO9012L' },
    { id: 4, transactionId: 'TXN202407J7K8L', donorName: 'Sunita Reddy', amount: 100, purpose: 'Annadhanam', date: '2024-07-20T09:00:00Z', status: 'failed', panCard: 'PQRST3456M' },
    { id: 5, transactionId: 'TXN202407M9N0O', donorName: 'Vikram Singh', amount: 2500, purpose: 'Thavachchalai', date: '2024-07-19T18:00:00Z', status: 'successful', panCard: 'UVWXY7890N', message: 'Happy to contribute!', utr: 'SBINR52024071912345678' },
    { id: 6, transactionId: 'TXN202406P1Q2R', donorName: 'Anand Kumar', amount: 10000, purpose: 'Annadhanam - Food + Sweet', date: '2024-06-15T12:00:00Z', status: 'successful', panCard: 'ABCDE1234F', utr: 'HDFCR52024061512345678'},
    { id: 7, transactionId: 'TXN202407S3T4U', donorName: 'Meena Iyer', amount: 75, purpose: 'Shade Sapling', date: '2024-07-23T14:00:00Z', status: 'pending', panCard: 'BCDEF2345G', message: 'Keep up the good work!'},
    { id: 8, transactionId: 'TXN202407V5W6X', donorName: 'John Doe', amount: 1500, purpose: 'Thavachchalai Needs', date: '2024-07-23T16:45:00Z', status: 'successful', panCard: 'CDEFG3456H', utr: 'AXISR52024072312345678'},
    { id: 9, transactionId: 'TXN202405Y7Z8A', donorName: 'Priya Sharma', amount: 200, purpose: 'Other Social Needs', date: '2024-05-30T09:20:00Z', status: 'successful', panCard: 'FGHIJ5678K', utr: 'ICICR52024053012345678'}
];

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  amount: number;
}

export interface NeedItem {
  id: string;
  name: string;
}

export interface RecentActivity {
    id: string;
    title: string;
    description: string;
    image: string;
    hint: string;
}

export interface UpcomingEvent {
    id: string;
    title: string;
    date: string;
    description: string;
}

export interface ImageProps {
  id: string;
  src: string;
  alt: string;
  hint: string;
}

export interface MainCategory {
  id: string;
  title: string;
  description: string;
  icon?: string; // Keep icon as string identifier
  images: ImageProps[];
  detailsComponent?: string;
}

export const initialAnnadhanamMenu: MenuItem[] = [
  { id: '1', title: 'Only Food', description: 'Sponsor a day of meals.', amount: 7500 },
  { id: '2', title: 'Food + Sweet', description: 'Meals with a sweet treat.', amount: 10000 },
  { id: '3', title: 'Food + Sweet + Banana', description: 'A complete, satisfying meal.', amount: 12500 },
  { id: '4', title: 'Food + Sweet + Dakshina', description: 'A meal with a token of respect.', amount: 10000 },
];

export const initialSaplingMenu: MenuItem[] = [
  { id: '1', title: 'Fruit Sapling', description: 'Mango, Guava, etc.', amount: 50 },
  { id: '2', title: 'Shade Sapling', description: 'Neem, Banyan, etc.', amount: 75 },
];

export const initialArulneriNeeds: NeedItem[] = [
  { id: '1', name: 'Meditation cushions' },
  { id: '2', name: 'Spiritual books for library' },
  { id: '3', name: 'Yoga mats' },
];

export const initialRecentActivities: RecentActivity[] = [
    { id: '1', title: "Weekly Annadhanam Drive", description: "Successfully distributed over 1000 meals to the homeless and needy in Villupuram.", image: "https://placehold.co/600x400.png", hint: "food charity" },
    { id: '2', title: "Sapling Plantation Event", description: "Planted 500+ saplings with the help of local school students to promote a greener environment.", image: "https://placehold.co/600x400.png", hint: "planting trees" },
    { id: '3', title: "Meditation & Yoga Camp", description: "Organized a 3-day spiritual retreat focused on mental well-being and inner peace.", image: "https://placehold.co/600x400.png", hint: "yoga meditation" },
];

export const initialUpcomingEvents: UpcomingEvent[] = [
    { id: '1', title: "Free Health Check-up Camp", date: "August 15, 2024", description: "A full-day health camp with free consultations from general physicians and specialists." },
    { id: '2', title: "Educational Kit Distribution", date: "August 25, 2024", description: "Distribution of school bags, notebooks, and stationery to underprivileged students." },
    { id: '3', title: "Special Puja & Annadhanam", date: "September 5, 2024", description: "A special prayer ceremony followed by a grand feast for all devotees and visitors." },
];

export const initialGalleryImages: ImageProps[] = [
  { id: 'g1', src: "https://placehold.co/1200x800.png", alt: "Community event", hint: "community event" },
  { id: 'g2', src: "https://placehold.co/1200x800.png", alt: "Children receiving books", hint: "children books" },
  { id: 'g3', src: "https://placehold.co/1200x800.png", alt: "Food distribution", hint: "food distribution" },
  { id: 'g4', src: "https://placehold.co/1200x800.png", alt: "Tree planting drive", hint: "tree planting" },
  { id: 'g5', src: "https://placehold.co/1200x800.png", alt: "Medical check-up camp", hint: "medical camp" },
  { id: 'g6', src: "https://placehold.co/1200x800.png", alt: "Meditation session", hint: "meditation session" },
];

export const mainCategoriesData: MainCategory[] = [
  {
    id: "arulneri-thavachchalai",
    title: "Arulneri Thavachchalai",
    description: "Fostering spiritual growth and mindfulness, inspired by the teachings of Buddha and Ramana Maharshi.",
    icon: "Temple",
    images: [
      { id: 'at1', src: "https://placehold.co/1200x600.png", alt: "Meditation hall", hint: "meditation spiritual" },
      { id: 'at2', src: "https://placehold.co/1200x600.png", alt: "Spiritual discourse", hint: "spiritual discourse" },
      { id: 'at3', src: "https://placehold.co/1200x600.png", alt: "Community gathering", hint: "community gathering" },
    ],
    detailsComponent: 'ArulneriNeeds'
  },
  {
    id: "bhuseva-nithya-annadhanam",
    title: "Bhuseva Nithya Annadhanam",
    description: "Providing daily nutritious meals to those in need, embodying the principle of selfless service.",
    icon: "Donate",
    images: [
      { id: 'bna1', src: "https://placehold.co/1200x600.png", alt: "Serving food", hint: "food charity" },
      { id: 'bna2', src: "https://placehold.co/1200x600.png", alt: "Fresh produce", hint: "fresh vegetables" },
      { id: 'bna3', src: "https://placehold.co/1200x600.png", alt: "Volunteers cooking", hint: "volunteer cooking" },
    ],
    detailsComponent: 'AnnadhanamMenu'
  },
  {
    id: "saplings-distributions",
    title: "Saplings Distributions",
    description: "Promoting environmental stewardship by distributing and planting saplings for a greener future.",
    icon: "Sprout",
    images: [
      { id: 'sd1', src: "https://placehold.co/1200x600.png", alt: "Planting a sapling", hint: "planting sapling" },
      { id: 'sd2', src: "https://placehold.co/1200x600.png", alt: "Rows of saplings", hint: "nursery saplings" },
      { id: 'sd3', src: "https://placehold.co/1200x600.png", alt: "Children with plants", hint: "children environment" },
    ],
    detailsComponent: 'SaplingMenu'
  },
   {
    id: "other-social-needs",
    title: "Other Social Needs",
    description: "Addressing various community needs including education, healthcare, and support for the underprivileged.",
    icon: "Users",
    images: [
      { id: 'osn1', src: "https://placehold.co/1200x600.png", alt: "Educational support", hint: "children classroom" },
      { id: 'osn2', src: "https://placehold.co/1200x600.png", alt: "Medical camp", hint: "medical camp" },
      { id: 'osn3', src: "https://placehold.co/1200x600.png", alt: "Distributing supplies", hint: "charity distribution" },
    ]
  },
];
