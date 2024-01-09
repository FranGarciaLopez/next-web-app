export default function CustomersPage() {
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