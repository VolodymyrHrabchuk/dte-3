"use client";

import { Suspense } from "react";
import DashboardDemoInner from "@/components/dashboard/DashboardDemoInner";

export default function DashboardDemo() {
  return (
    <Suspense fallback={<div className='text-white'>Loading...</div>}>
      <DashboardDemoInner />
    </Suspense>
  );
}
