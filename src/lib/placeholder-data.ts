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
