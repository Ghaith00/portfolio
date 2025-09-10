"use client";
import { SiteContext, SiteData } from "@/lib/types";
import React from "react";


export function SiteProvider({
  initialSite,
  children,
}: React.PropsWithChildren<{ initialSite: SiteData }>) {
  const [site, setSite] = React.useState<SiteData>(initialSite);
  const value = React.useMemo(() => ({ site, setSite }), [site]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = React.useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within <SiteProvider>");
  return ctx; // { site, setSite }
}
