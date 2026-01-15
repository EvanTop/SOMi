import { useState, useEffect } from "react";
import { initialDomains } from "@/lib/data";
import type { Domain } from "@/lib/data";

const STORAGE_KEY = "somi_domains_data";

export function useDomains() {
  const [domains, setDomainsState] = useState<Domain[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialDomains;
  });

  const setDomains = (newDomains: Domain[]) => {
    setDomainsState(newDomains);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newDomains));
  };

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setDomainsState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return { domains, setDomains };
}
