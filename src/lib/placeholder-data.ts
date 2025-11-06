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
    name: 'Rohan Deshpande',
    specialty: 'Cyber Law',
    address: 'A-101, Cyber Heights, Bandra, Mumbai, MH',
    phone: '+91-912-345-6789',
    email: 'rohan.deshpande@example.com',
  },
  {
    id: 2,
    name: 'Priya Kapoor',
    specialty: 'Family Law & Divorce',
    address: '22B, Ocean View Apts, Juhu, Mumbai, MH',
    phone: '+91-998-765-4321',
    email: 'priya.kapoor@example.com',
  },
  {
    id: 3,
    name: 'Arjun Verma',
    specialty: 'Real Estate Law',
    address: 'Suite 5, Landmark Towers, Connaught Place, Delhi, DL',
    phone: '+91-987-123-4567',
    email: 'arjun.verma@example.com',
  },
  {
    id: 4,
    name: 'Sameera Ali',
    specialty: 'Intellectual Property Rights',
    address: 'Tech Park One, HSR Layout, Bengaluru, KA',
    phone: '+91-965-874-1230',
    email: 'sameera.ali@example.com',
  },
  {
    id: 5,
    name: 'Kabir Sheikh',
    specialty: 'Criminal Defense',
    address: '4th Floor, Justice Chambers, Fort, Mumbai, MH',
    phone: '+91-900-456-7890',
    email: 'kabir.sheikh@example.com',
  },
  {
    id: 6,
    name: 'Meera Iyer',
    specialty: 'Corporate & Commercial Law',
    address: 'Level 12, Global Business Park, Anna Salai, Chennai, TN',
    phone: '+91-944-556-6778',
    email: 'meera.iyer@example.com',
  },
];
