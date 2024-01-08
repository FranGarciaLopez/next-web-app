import { fetchLatestInvoices } from "../lib/data";
import LatestInvoices from "../ui/dashboard/latest-invoices";
import RevenueChart from "../ui/dashboard/revenue-chart";
import CardWrapper from "../ui/dashboard/cards";
import { lusitana } from "../ui/fonts";
import { Suspense } from "react";
import { CardsSkeleton, RevenueChartSkeleton } from "../ui/skeletons";


export default async function Page() {
       const latestsInvoices = await fetchLatestInvoices()

       return (
              <main>
                     <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                            Dashboard
                     </h1>
                     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <Suspense fallback={<CardsSkeleton />}>
                                   <CardWrapper />
                            </Suspense>
                     </div>
                     <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                            <Suspense fallback={<RevenueChartSkeleton />}>
                                   <RevenueChart />
                            </Suspense>
                            <LatestInvoices latestInvoices={latestsInvoices} />
                     </div>
              </main>
       )
}