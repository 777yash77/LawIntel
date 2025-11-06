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
    name: 'Anjali Rao',
    specialty: 'Civil Litigation',
    address: '123 Law Lane, R.S. Puram, Coimbatore, TN',
    phone: '+91-987-654-3210',
    email: 'anjali.rao@example.com',
  },
  {
    id: 2,
    name: 'Baskar Sundaram',
    specialty: 'Tax Law',
    address: '45A, Cross-Cut Road, Gandhipuram, Coimbatore, TN',
    phone: '+91-912-345-6780',
    email: 'baskar.sundaram@example.com',
  },
  {
    id: 3,
    name: 'Priya Kapoor',
    specialty: 'Family Law & Divorce',
    address: '22B, Ocean View Apts, Juhu, Mumbai, MH',
    phone: '+91-998-765-4321',
    email: 'priya.kapoor@example.com',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    specialty: 'Corporate Law',
    address: '7th Floor, Biz Tower, Peelamedu, Coimbatore, TN',
    phone: '+91-900-112-2334',
    email: 'vikram.singh@example.com',
  },
  {
    id: 5,
    name: 'Sameera Ali',
    specialty: 'Intellectual Property Rights',
    address: 'Tech Park One, HSR Layout, Bengaluru, KA',
    phone: '+91-965-874-1230',
    email: 'sameera.ali@example.com',
  },
  {
    id: 6,
    name: 'Kabir Sheikh',
    specialty: 'Criminal Defense',
    address: '4th Floor, Justice Chambers, Fort, Mumbai, MH',
    phone: '+91-900-456-7890',
    email: 'kabir.sheikh@example.com',
  },
];
