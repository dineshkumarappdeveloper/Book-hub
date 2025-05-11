import type { Book } from '@/lib/types';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    coverImage: 'https://picsum.photos/seed/midnightlibrary/300/450',
    price: 15.99,
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth Pitself will perish.',
    coverImage: 'https://picsum.photos/seed/projecthailmary/300/450',
    price: 18.50,
  },
  {
    id: '3',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    description: 'A novel about Klara, an Artificial Friend with outstanding observational qualities, who, from her place in the store, watches carefully the behavior of those who come in to browse, and of those who pass on the street outside.',
    coverImage: 'https://picsum.photos/seed/klaraandthesun/300/450',
    price: 16.75,
  },
  {
    id: '4',
    title: 'The Vanishing Half',
    author: 'Brit Bennett',
    description: 'The Vignes twin sisters will always be identical. But after growing up together in a small, southern black community and running away at age sixteen, it\'s not justthe shape of their daily lives that is different as adults, it\'s everything: their families, their communities, their racial identities.',
    coverImage: 'https://picsum.photos/seed/vanishinghalf/300/450',
    price: 14.99,
  },
  {
    id: '5',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the “spice” melange, a drug capable of extending life and enhancing consciousness.',
    coverImage: 'https://picsum.photos/seed/dune/300/450',
    price: 12.99,
  },
  {
    id: '6',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    description: 'A tale of gods, kings, immortal fame, and the human heart, The Song of Achilles is a dazzling literary feat that brilliantly reimagines Homer’s enduring masterwork, The Iliad.',
    coverImage: 'https://picsum.photos/seed/songofachilles/300/450',
    price: 13.50,
  },
  {
    id: '7',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results.',
    coverImage: 'https://picsum.photos/seed/atomichabits/300/450',
    price: 19.99,
  },
  {
    id: '8',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    description: 'A stunning debut novel, Where the Crawdads Sing is at once an exquisite ode to the natural world, a heartbreaking coming-of-age story, and a surprising tale of possible murder.',
    coverImage: 'https://picsum.photos/seed/crawdadssing/300/450',
    price: 11.80,
  },
];

export const getBookById = (id: string): Book | undefined => {
  return mockBooks.find(book => book.id === id);
};

export const getAllBookTitles = (): string[] => {
  return mockBooks.map(book => book.title);
};
