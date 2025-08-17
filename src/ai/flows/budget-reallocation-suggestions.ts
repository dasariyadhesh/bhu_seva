'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing budget reallocation suggestions based on donor contributions and expenses.
 *
 * - budgetReallocationSuggestions - A function that takes donor contributions and expenses as input and returns AI-powered suggestions for budget reallocation.
 * - BudgetReallocationInput - The input type for the budgetReallocationSuggestions function.
 * - BudgetReallocationOutput - The return type for the budgetReallocationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetReallocationInputSchema = z.object({
  arulneriThavachchalaiContributions: z.number().describe('Donor contributions for Arulneri Thavachchalai.'),
  bhusevaNithyaAnnadhanamContributions: z.number().describe('Donor contributions for Bhuseva Nithya Annadhanam.'),
  saplingsDistributionsContributions: z.number().describe('Donor contributions for Saplings Distributions.'),
  otherSocialNeedsContributions: z.number().describe('Donor contributions for Other Social Needs.'),
  arulneriThavachchalaiExpenses: z.number().describe('Expenses for Arulneri Thavachchalai.'),
  bhusevaNithyaAnnadhanamExpenses: z.number().describe('Expenses for Bhuseva Nithya Annadhanam.'),
  saplingsDistributionsExpenses: z.number().describe('Expenses for Saplings Distributions.'),
  otherSocialNeedsExpenses: z.number().describe('Expenses for Other Social Needs.'),
});
export type BudgetReallocationInput = z.infer<typeof BudgetReallocationInputSchema>;

const BudgetReallocationOutputSchema = z.object({
  suggestions: z.string().describe('AI-powered suggestions for budget reallocation, including specific amounts and justifications.'),
});
export type BudgetReallocationOutput = z.infer<typeof BudgetReallocationOutputSchema>;

export async function budgetReallocationSuggestions(input: BudgetReallocationInput): Promise<BudgetReallocationOutput> {
  return budgetReallocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetReallocationPrompt',
  input: {schema: BudgetReallocationInputSchema},
  output: {schema: BudgetReallocationOutputSchema},
  prompt: `You are an AI assistant that analyzes donor contributions and expenses across different categories and provides suggestions for budget reallocation.

  Consider the following contributions and expenses for each category:

  Arulneri Thavachchalai Contributions: {{{arulneriThavachchalaiContributions}}}
  Bhuseva Nithya Annadhanam Contributions: {{{bhusevaNithyaAnnadhanamContributions}}}
  Saplings Distributions Contributions: {{{saplingsDistributionsContributions}}}
  Other Social Needs Contributions: {{{otherSocialNeedsContributions}}}

  Arulneri Thavachchalai Expenses: {{{arulneriThavachchalaiExpenses}}}
  Bhuseva Nithya Annadhanam Expenses: {{{bhusevaNithyaAnnadhanamExpenses}}}
  Saplings Distributions Expenses: {{{saplingsDistributionsExpenses}}}
  Other Social Needs Expenses: {{{otherSocialNeedsExpenses}}}

  Based on this data, suggest areas where budget reallocation is most useful. Provide specific amounts and justifications for your suggestions.
`,
});

const budgetReallocationFlow = ai.defineFlow(
  {
    name: 'budgetReallocationFlow',
    inputSchema: BudgetReallocationInputSchema,
    outputSchema: BudgetReallocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
