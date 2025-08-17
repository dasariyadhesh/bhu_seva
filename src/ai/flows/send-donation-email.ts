
'use server';

/**
 * @fileOverview This file defines a Genkit flow for sending an email notification to the admin when a new donation is successful.
 * In a real application, this would integrate with an email service like SendGrid or Resend.
 * For this demo, it will log the action to the console.
 *
 * - sendDonationEmail - A function that takes donation details and "sends" an email.
 * - SendDonationEmailInput - The input type for the sendDonationEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SendDonationEmailInputSchema = z.object({
  to: z.string().email().describe('The recipient email address (admin).'),
  donorName: z.string().describe('The name of the donor.'),
  amount: z.number().describe('The donation amount.'),
  purpose: z.string().describe('The purpose of the donation, may include UTR.'),
});

export type SendDonationEmailInput = z.infer<typeof SendDonationEmailInputSchema>;

export async function sendDonationEmail(input: SendDonationEmailInput): Promise<void> {
  return sendDonationEmailFlow(input);
}

const sendDonationEmailFlow = ai.defineFlow(
  {
    name: 'sendDonationEmailFlow',
    inputSchema: SendDonationEmailInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    console.log('***********************************');
    console.log('SIMULATING SENDING DONATION EMAIL');
    console.log('Recipient:', input.to);
    console.log('Subject: New Donation Submitted for Verification!');
    console.log('Body:');
    console.log(`  A new donation has been submitted and is awaiting verification.`);
    console.log(`  Donor: ${input.donorName}`);
    console.log(`  Amount: Rs.${input.amount}`);
    console.log(`  Purpose/UTR: ${input.purpose}`);
    console.log('***********************************');

    // In a real application, you would add your email sending logic here.
    // For example, using a service like Nodemailer, SendGrid, or Resend.
    //
    // const { data, error } = await resend.emails.send({
    //   from: 'Bhu Seva Trust <noreply@yourdomain.com>',
    //   to: [input.to],
    //   subject: 'New Donation Received!',
    //   html: `
    //     <h1>New Donation Received!</h1>
    //     <p>A new donation has been successfully processed.</p>
    //     <ul>
    //       <li><strong>Donor:</strong> ${input.donorName}</li>
    //       <li><strong>Amount:</strong> Rs.${input.amount}</li>
    //       <li><strong>Purpose:</strong> ${input.purpose}</li>
    //     </ul>
    //   `,
    // });
    
    return;
  }
);
