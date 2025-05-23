'use server';

/**
 * @fileOverview Provides AI-powered book suggestions based on a given book title.
 *
 * - suggestBooks - A function that suggests related books.
 * - BookSuggestionsInput - The input type for the suggestBooks function.
 * - BookSuggestionsOutput - The return type for the suggestBooks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
// Note: getAllBookTitles would typically be imported from an action file
// For this example, we assume it's available or this flow is adapted.
// If using mockBookActions.ts, it would be:
// import { getAllBookTitles } from '@/app/admin/actions/bookActions';

const BookSuggestionsInputSchema = z.object({
  bookTitle: z.string().describe('The title of the book the user is viewing.'),
  bookDescription: z.string().describe('A description of the book.'),
  existingBooks: z.array(z.string()).describe('List of available book titles for suggestions.'),
});
export type BookSuggestionsInput = z.infer<typeof BookSuggestionsInputSchema>;

const BookSuggestionsOutputSchema = z.object({
  suggestedBooks: z.array(z.string()).describe('List of suggested book titles (at most 3).'),
});
export type BookSuggestionsOutput = z.infer<typeof BookSuggestionsOutputSchema>;

export async function suggestBooks(input: BookSuggestionsInput): Promise<BookSuggestionsOutput> {
  return suggestBooksFlow(input);
}

const bookSuggestionPrompt = ai.definePrompt({
  name: 'bookSuggestionPrompt',
  input: {schema: BookSuggestionsInputSchema},
  output: {schema: BookSuggestionsOutputSchema},
  prompt: `You are a book recommendation expert. A user is currently viewing a book with the title "{{bookTitle}}" and description "{{bookDescription}}". Given the following list of available books: {{{existingBooks}}}, suggest up to 3 books that are thematically similar or that readers might enjoy if they like the book they are viewing. Only suggest books from the list provided. Return the suggestions as a simple list of titles. Do not include any other explanation or numbering.`,
});

const suggestBooksFlow = ai.defineFlow(
  {
    name: 'suggestBooksFlow',
    inputSchema: BookSuggestionsInputSchema,
    outputSchema: BookSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await bookSuggestionPrompt(input);
    // Ensure the output is correctly formatted and contains at most 3 books.
    if (output && output.suggestedBooks && Array.isArray(output.suggestedBooks)) {
        return { suggestedBooks: output.suggestedBooks.slice(0, 3) };
    }
    return { suggestedBooks: [] }; // Fallback to empty array if output is not as expected
  }
);
