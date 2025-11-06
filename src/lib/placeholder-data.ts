import { PlaceHolderImages } from '@/lib/placeholder-images';

export const articles = [
  {
    title: 'Understanding Contract Law in the Digital Age',
    summary: 'An overview of how traditional contract principles are adapting to e-signatures, smart contracts, and online agreements.',
    image: PlaceHolderImages.find(p => p.id === 'article1'),
  },
  {
    title: 'Intellectual Property: A Startup\'s Guide',
    summary: 'Key considerations for protecting your trademarks, copyrights, and patents from day one.',
    image: PlaceHolderImages.find(p => p.id === 'article2'),
  },
  {
    title: 'Navigating Employment Law Compliance',
    summary: 'Best practices for hiring, firing, and managing employees while mitigating legal risks.',
    image: PlaceHolderImages.find(p => p.id === 'article3'),
  },
  {
    title: 'The Basics of Corporate Governance',
    summary: 'Learn about the structures and processes for directing and controlling a company.',
    image: PlaceHolderImages.find(p => p.id === 'article4'),
  },
];

export const emergencyNumbers = [
    { service: 'National Emergency', number: '112' },
    { service: 'Police', number: '100' },
    { service: 'Fire', number: '101' },
    { service: 'Ambulance', number: '102' },
    { service: 'Women Helpline', number: '1091' },
    { service: 'Cyber Crime Helpline', number: '1930' },
];

export const lawyers = [
  {
    id: 1,
    name: 'Ananya Sharma',
    specialty: 'Corporate Law',
    address: '123 Business Bay, Mumbai, MH',
    phone: '+91-987-654-3210',
    email: 'ananya.sharma@example.com',
  },
  {
    id: 2,
    name: 'Vikram Singh',
    specialty: 'Criminal Defense',
    address: '456 Justice Avenue, Delhi, DL',
    phone: '+91-987-654-3211',
    email: 'vikram.singh@example.com',
  },
  {
    id: 3,
    name: 'Priya Patel',
    specialty: 'Family Law',
    address: '789 Harmony Street, Ahmedabad, GJ',
    phone: '+91-987-654-3212',
    email: 'priya.patel@example.com',
  },
  {
    id: 4,
    name: 'Rohan Mehta',
    specialty: 'Intellectual Property',
    address: '101 Innovation Plaza, Bengaluru, KA',
    phone: '+91-987-654-3213',
    email: 'rohan.mehta@example.com',
  },
  {
    id: 5,
    name: 'Sunita Reddy',
    specialty: 'Real Estate Law',
    address: '212 Landview Park, Hyderabad, TS',
    phone: '+91-987-654-3214',
    email: 'sunita.reddy@example.com',
  },
  {
    id: 6,
    name: 'Arjun Gupta',
    specialty: 'Tax Law',
    address: '333 Finance Tower, Chennai, TN',
    phone: '+91-987-654-3215',
    email: 'arjun.gupta@example.com',
  },
];