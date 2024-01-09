import React, { Suspense } from 'react';
import Table from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { TableRowSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';

export const metadata: Metadata = {
       title: 'Customers',
};

export default async function CustomersPage({
       searchParams,
}: {
       searchParams?: {
              query?: string;
       };
}) {
       const query = searchParams?.query || '';
       
       const customers = await fetchFilteredCustomers(query);

       return (
              <div className="w-full">
                     <Suspense key={query} fallback={<TableRowSkeleton />}>
                            <Table customers={customers} />
                     </Suspense>
              </div>
       );
}