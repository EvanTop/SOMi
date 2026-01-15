import { cn } from "@/lib/utils";
import type { Domain } from "@/lib/data";

interface DomainCardProps {
  domain: Domain;
  className?: string;
}

export function DomainCard({ domain, className }: DomainCardProps) {
  return (
    <a
      href={`http://${domain.name}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex flex-col p-4 bg-card/30 hover:bg-card/80 border border-border/30 hover:border-border transition-all duration-200 rounded-lg",
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold font-display tracking-tight text-foreground group-hover:text-primary transition-colors uppercase truncate">
          {domain.name}
        </h3>
        {domain.price && (
           <span className="text-sm font-mono text-muted-foreground/80">
             {domain.price}
           </span>
        )}
      </div>
      
      <div className="flex items-center gap-2 mt-auto">
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground uppercase tracking-wider">
          {domain.provider || "Unknown"}
        </span>
        <span className="text-xs text-muted-foreground/50 lowercase truncate flex-1 text-right">
          {domain.name.toLowerCase()}
        </span>
      </div>
    </a>
  );
}
