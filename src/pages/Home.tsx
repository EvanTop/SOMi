import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DomainCard } from "@/components/DomainCard";
import { useDomains } from "@/hooks/useDomains";
import { useState, useMemo } from "react";

export default function Home() {
  const { domains } = useDomains();
  const [searchTerm, setSearchTerm] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [suffixFilter, setSuffixFilter] = useState("all");

  const providers = useMemo(() => {
    const uniqueProviders = new Set(domains.map(d => d.provider || "Unknown"));
    return Array.from(uniqueProviders).sort();
  }, [domains]);

  const suffixes = useMemo(() => {
    const uniqueSuffixes = new Set(domains.map(d => {
      const parts = d.name.split(".");
      return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "unknown";
    }));
    return Array.from(uniqueSuffixes).sort();
  }, [domains]);

  const filteredDomains = domains.filter((domain) => {
    const matchesSearch = domain.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = providerFilter === "all" || domain.provider === providerFilter;
    const matchesSuffix = suffixFilter === "all" || domain.name.toLowerCase().endsWith(`.${suffixFilter.toLowerCase()}`);
    return matchesSearch && matchesProvider && matchesSuffix;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-foreground selection:text-background">
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        providerFilter={providerFilter}
        setProviderFilter={setProviderFilter}
        suffixFilter={suffixFilter}
        setSuffixFilter={setSuffixFilter}
        providers={providers}
        suffixes={suffixes}
      />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-0 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredDomains.map((domain) => (
             <DomainCard key={domain.id} domain={domain} />
          ))}
          
          {filteredDomains.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No domains found.
            </div>
          )}
        </div>
        

      </main>

      <Footer />
    </div>
  );
}
