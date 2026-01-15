import { siteConfig } from "@/lib/data";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Search, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  providerFilter: string;
  setProviderFilter: (provider: string) => void;
  suffixFilter: string;
  setSuffixFilter: (suffix: string) => void;
  providers: string[];
  suffixes: string[];
}

export function Header({ 
  searchTerm, 
  setSearchTerm, 
  providerFilter, 
  setProviderFilter,
  suffixFilter,
  setSuffixFilter,
  providers,
  suffixes
}: HeaderProps) {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="w-full pt-20 pb-10 px-4 md:px-0 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
      <div className="flex flex-col items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-foreground">
          {siteConfig.description}
        </h1>
        <p className="text-lg text-muted-foreground font-sans">
          {siteConfig.subtitle}
        </p>
      </div>

      <div className="w-full max-w-5xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 px-1">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder={t("admin.search")}
            className="pl-10 h-11 bg-card/50 border-border/50 focus:border-primary/50 transition-colors rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
           {/* Left Aligned Title */}
           <h2 className="text-xl font-bold font-display tracking-tight hidden md:block">
             Domain Names
           </h2>
           
           {/* Right Aligned Controls Group */}
           <div className="flex items-center gap-2 flex-1 md:flex-none justify-end">
             <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-[140px] h-9 text-xs bg-card/50 border-border/50">
                <SelectValue placeholder="All Providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {providers.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={suffixFilter} onValueChange={setSuffixFilter}>
              <SelectTrigger className="w-[140px] h-9 text-xs bg-card/50 border-border/50">
                <SelectValue placeholder="All Extensions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Extensions</SelectItem>
                {suffixes.map((s) => (
                  <SelectItem key={s} value={s}>.{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button 
              onClick={() => setLanguage(language === "en" ? "zh" : "en")}
              className="h-9 px-3 text-xs font-medium border border-border/50 rounded-md hover:bg-accent/50 transition-colors"
            >
              {language === "en" ? "EN" : "中"}
            </button>

            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center border border-border/50 rounded-md hover:bg-accent/50 transition-colors"
            >
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
           </div>
        </div>
      </div>
    </header>
  );
}
