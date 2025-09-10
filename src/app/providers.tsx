"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerSW } from "@/lib/pwa/register-sw";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  useEffect(() => {
    registerSW();
  }, []);
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
