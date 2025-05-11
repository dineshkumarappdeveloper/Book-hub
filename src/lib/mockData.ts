import type { Book } from '@/lib/types';

// This array serves as the INITIAL seed for the mockDataStore.
// It should not be mutated directly by components after initialization.
export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    coverImage: 'https://picsum.photos/seed/midnightlibrary/300/450',
    price: 15.99,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth Pitself will perish.',
    coverImage: 'https://picsum.photos/seed/projecthailmary/300/450',
    price: 18.50,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
  },
  {
    id: '3',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    description: 'A novel about Klara, an Artificial Friend with outstanding observational qualities, who, from her place in the store, watches carefully the behavior of those who come in to browse, and of those who pass on the street outside.',
    coverImage: 'https://picsum.photos/seed/klaraandthesun/300/450',
    price: 16.75,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: '4',
    title: 'The Vanishing Half',
    author: 'Brit Bennett',
    description: 'The Vignes twin sisters will always be identical. But after growing up together in a small, southern black community and running away at age sixteen, it\'s not justthe shape of their daily lives that is different as adults, it\'s everything: their families, their communities, their racial identities.',
    coverImage: 'https://picsum.photos/seed/vanishinghalf/300/450',
    price: 14.99,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15, // 15 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
  },
  {
    id: '5',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the “spice” melange, a drug capable of extending life and enhancing consciousness.',
    coverImage: 'https://picsum.photos/seed/dune/300/450',
    price: 12.99,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: '6',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    description: 'A tale of gods, kings, immortal fame, and the human heart, The Song of Achilles is a dazzling literary feat that brilliantly reimagines Homer’s enduring masterwork, The Iliad.',
    coverImage: 'https://picsum.photos/seed/songofachilles/300/450',
    price: 13.50,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: '7',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.',
    coverImage: 'https://picsum.photos/seed/atomichabits/300/450',
    price: 19.99,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20, // 20 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  },
  {
    id: '8',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    description: 'A stunning debut novel, Where the Crawdads Sing is at once an exquisite ode to the natural world, a heartbreaking coming-of-age story, and a surprising tale of possible murder.',
    coverImage: 'https://picsum.photos/seed/crawdadssing/300/450',
    price: 11.80,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
];

// The functions below are now for legacy use or direct access to the initial seed,
// but application logic should prefer actions that use the mockDataStore for live data.

/** @deprecated Prefer using `getBookById` from `app/admin/actions/bookActions.ts` for live data */
export const getBookById_Legacy = (id: string): Book | undefined => {
  return mockBooks.find(book => book.id === id);
};

/** @deprecated Prefer using `getAllBookTitles` from `app/admin/actions/bookActions.ts` for live data */
export const getAllBookTitles_Legacy = (): string[] => {
  return mockBooks.map(book => book.title);
};
