'use server'

import { z } from 'zod';
import { Invoice } from './definitions';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const CreateInvoiceSchema = z.object({
          id: z.string(),
          customerId: z.string(),
          amount: z.coerce.number().positive(),
          status: z.enum(['paid', 'pending']),
          date: z.string(),
});

const CreateInvoiceFormSchema = CreateInvoiceSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
          const { customerId, amount, status } = CreateInvoiceFormSchema.parse({

                    customerId: formData.get('customerId'),
                    amount: formData.get('amount'),
                    status: formData.get('status'),
          });

          const amountInCents = amount * 100;
          const [date] = new Date().toISOString().split('T');

          try {
                    await sql`
                              INSERT INTO invoices (customer_id, amount, status, date)
                              VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
                    `;
          }
          catch (error) {
                    return {
                              message: 'Database Error: Failed to Create Invoice.',
                    };
          }
          
          revalidatePath('/dashboard/invoices');
          redirect('/dashboard/invoices');
}

const UpdateInvoiceSchema = CreateInvoiceSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, FormData: FormData) {
          const { customerId, amount, status } = UpdateInvoiceSchema.parse({
                    customerId: FormData.get('customerId'),
                    amount: FormData.get('amount'),
                    status: FormData.get('status'),
          });

          const amountInCents = amount * 100;

          try {
                    await sql`
                              UPDATE invoices
                              SET customer_id = ${customerId},
                              amount = ${amountInCents},
                              status = ${status}
                              WHERE id = ${id}
                    `;
          } catch (error) {
                    return {
                              message: 'Database Error: Failed to Update Invoice.',
                    };
          }

          revalidatePath('/dashboard/invoices');
          redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {

          try {
                    await sql`
                              DELETE FROM invoices
                              WHERE id = ${id}
                    `;
          } catch (error) {
                    return {
                              message: 'Database Error: Failed to Delete Invoice.',
                    };
          }

          revalidatePath('/dashboard/invoices');
}