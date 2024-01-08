'use server'

import { z } from 'zod';
import { Invoice } from './definitions';
import { sql } from '@vercel/postgres';

const CreateInvoiceSchema = z.object({
          id: z.string(),
          customerId: z.string(),
          amount: z.coerce.number().positive(),
          status: z.enum(['paid', 'pending']),
          date: z.string(),
});

const CreateInvoiceFormSchema = CreateInvoiceSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
          const { customerId, amount, status} = CreateInvoiceFormSchema.parse({

                    customerId: formData.get('customerId'),
                    amount: formData.get('amount'),
                    status: formData.get('status'),
          });

          const amountInCents = amount * 100;
          const [date] = new Date().toISOString().split('T');

          await sql`
                    INSERT INTO invoices (customer_id, amount, status, date)
                    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
          `;
}