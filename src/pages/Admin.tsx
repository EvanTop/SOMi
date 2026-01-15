import { useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  Globe, 
  Settings, 
  LogOut, 
  Plus, 
  Search,
  MoreVertical,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Languages,
  Upload,
  Download,
  FileJson,
  Calendar,
  StickyNote,
  CheckSquare,
  Square,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useDomains } from "@/hooks/useDomains";
import { useLanguage } from "@/contexts/LanguageContext";
import { ImportDialog } from "@/components/ImportDialog";
import { AdminDashboard } from "@/components/AdminDashboard";
import type { Domain } from "@/lib/data";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { domains, setDomains } = useDomains();
  const { t, language, setLanguage } = useLanguage();
  const [isAuth, setIsAuth] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Auth Check
  useEffect(() => {
    const auth = localStorage.getItem("somi_auth");
    if (auth !== "true") {
      toast.error("Unauthorized access");
      setLocation("/");
    } else {
      setIsAuth(true);
    }
  }, [setLocation]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("somi_auth");
    toast.success(t("toast.logout"));
    setLocation("/");
  };

  // States
  const [activeTab, setActiveTab] = useState<"dashboard" | "list">("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<Partial<Domain>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter
  const filteredDomains = domains.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Batch Operations
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredDomains.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDomains.map(d => d.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBatchDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} domains?`)) {
      setDomains(domains.filter(d => !selectedIds.has(d.id)));
      setSelectedIds(new Set());
      toast.success(t("toast.deleted"));
    }
  };

  const handleBatchStatus = (status: "available" | "sold" | "reserved") => {
    setDomains(domains.map(d => selectedIds.has(d.id) ? { ...d, status } : d));
    setSelectedIds(new Set());
    toast.success(t("toast.updated"));
  };

  // CRUD Operations
  const handleBatchImport = (newDomains: Partial<Domain>[]) => {
    const currentMaxId = Math.max(...domains.map(d => parseInt(d.id)), 0);
    const addedDomains = newDomains.map((d, index) => ({
      ...d,
      id: (currentMaxId + index + 1).toString(),
      name: d.name || "unknown",
      provider: d.provider || "Manual",
      status: d.status || "available",
      price: d.price || "",
    } as Domain));

    setDomains([...domains, ...addedDomains]);
    toast.success(t("import.success").replace("{count}", addedDomains.length.toString()));
  };

  const handleAdd = () => {
    if (!currentDomain.name) {
      toast.error("Domain name is required");
      return;
    }
    const newId = (Math.max(...domains.map(d => parseInt(d.id)), 0) + 1).toString();
    const newDomain: Domain = {
      id: newId,
      name: currentDomain.name,
      price: currentDomain.price,
      provider: currentDomain.provider || "Manual",
      status: (currentDomain.status as any) || "available",
      expiryDate: currentDomain.expiryDate,
      note: currentDomain.note,
    };
    setDomains([...domains, newDomain]);
    setIsAddOpen(false);
    setCurrentDomain({});
    toast.success(t("toast.added"));
  };

  const handleEdit = () => {
    if (!currentDomain.id || !currentDomain.name) return;
    setDomains(domains.map(d => d.id === currentDomain.id ? currentDomain as Domain : d));
    setIsEditOpen(false);
    setCurrentDomain({});
    toast.success(t("toast.updated"));
  };

  const handleDelete = (id: string) => {
    setDomains(domains.filter(d => d.id !== id));
    toast.success(t("toast.deleted"));
  };

  const openEdit = (domain: Domain) => {
    setCurrentDomain({ ...domain });
    setIsEditOpen(true);
  };

  // Export & Backup
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Domain", "Provider", "Price", "Status", "Expiry Date", "Note"];
    const rows = domains.map(d => [
      d.id,
      d.name,
      d.provider || "",
      d.price || "",
      d.status,
      d.expiryDate || "",
      `"${(d.note || "").replace(/"/g, '""')}"` // Escape quotes
    ]);
    
    // Add BOM for Excel UTF-8 compatibility
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    downloadFile(csvContent, `somi_domains_${new Date().toISOString().split('T')[0]}.csv`, "text/csv;charset=utf-8;");
    toast.success(t("toast.exported"));
  };

  const handleBackup = () => {
    const jsonContent = JSON.stringify(domains, null, 2);
    downloadFile(jsonContent, `somi_backup_${new Date().toISOString().split('T')[0]}.json`, "application/json");
    toast.success(t("toast.backup_created"));
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const restoredDomains = JSON.parse(content);
        if (Array.isArray(restoredDomains)) {
          setDomains(restoredDomains);
          toast.success(t("toast.restored"));
        } else {
          toast.error("Invalid backup file format");
        }
      } catch (err) {
        toast.error("Failed to parse backup file");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Expiry Check
  const isExpiringSoon = (dateStr?: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);
    return date > now && date < threeMonthsLater;
  };

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col transition-colors duration-300">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2 text-foreground">
            <LayoutDashboard className="w-5 h-5" />
            {t("admin.title")}
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start gap-2", activeTab === "dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50")}
            onClick={() => setActiveTab("dashboard")}
          >
            <Globe className="w-4 h-4" />
            {t("admin.dashboard_overview")}
          </Button>
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start gap-2", activeTab === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50")}
            onClick={() => setActiveTab("list")}
          >
            <Settings className="w-4 h-4" />
            {t("admin.dashboard")}
          </Button>
        </nav>
        <div className="p-4 border-t border-border space-y-2">
          <Button 
            variant="outline" 
            className="w-full gap-2 border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={() => setLanguage(language === "en" ? "zh" : "en")}
          >
            <Languages className="w-4 h-4" />
            {language === "en" ? "中文" : "English"}
          </Button>
          <Button variant="outline" className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            {t("admin.logout")}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background relative transition-colors duration-300">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm px-6 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-4 w-full max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder={t("admin.search")}
              className="bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-auto text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".json"
              onChange={handleRestore} 
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-border text-muted-foreground hover:bg-accent hover:text-foreground">
                  <Download className="w-4 h-4" />
                  {t("admin.export")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                <DropdownMenuLabel>Export & Backup</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={handleExportCSV} className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  {t("admin.export_csv")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBackup} className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                  <FileJson className="w-4 h-4 mr-2" />
                  {t("admin.backup_download")}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  {t("admin.backup_restore")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 scrollbar-hide">
          {activeTab === "dashboard" ? (
            <AdminDashboard domains={domains} />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold font-display text-foreground">{t("admin.dashboard")}</h1>
                  <p className="text-muted-foreground">Manage your digital assets portfolio.</p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="gap-2 border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => setIsImportOpen(true)}
                  >
                    <Upload className="w-4 h-4" />
                    {t("admin.import")}
                  </Button>
                  <Button 
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setIsAddOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    {t("admin.add")}
                  </Button>
                </div>
              </div>

              <div className="border border-border rounded-lg bg-card/50 shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-accent/50">
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectedIds.size === filteredDomains.length && filteredDomains.length > 0}
                          onCheckedChange={toggleSelectAll}
                          className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      </TableHead>
                      <TableHead className="text-muted-foreground">{t("admin.domain_name")}</TableHead>
                      <TableHead className="text-muted-foreground">{t("admin.status")}</TableHead>
                      <TableHead className="text-muted-foreground">Provider</TableHead>
                      <TableHead className="text-muted-foreground">{t("admin.price")}</TableHead>
                      <TableHead className="text-muted-foreground">{t("admin.expiry")}</TableHead>
                      <TableHead className="text-right text-muted-foreground">{t("admin.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDomains.map((domain) => (
                      <TableRow key={domain.id} className="border-border hover:bg-accent/50">
                         <TableCell>
                          <Checkbox 
                            checked={selectedIds.has(domain.id)}
                            onCheckedChange={() => toggleSelect(domain.id)}
                            className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                        </TableCell>
                        <TableCell className="font-medium font-display text-foreground">{domain.name}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={
                              domain.status === "available" 
                                ? "border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/10" 
                                : "border-border text-muted-foreground"
                            }
                          >
                            {domain.status === "available" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {domain.status !== "available" && <XCircle className="w-3 h-3 mr-1" />}
                            {t(`status.${domain.status}`)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{domain.provider}</TableCell>
                        <TableCell className="text-foreground font-mono">{domain.price || "—"}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "font-mono text-sm", 
                            isExpiringSoon(domain.expiryDate) ? "text-red-500 font-bold" : "text-muted-foreground"
                          )}>
                            {domain.expiryDate || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-accent text-muted-foreground">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                              <DropdownMenuItem onClick={() => openEdit(domain)} className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                                <Edit2 className="w-4 h-4 mr-2" />
                                {t("admin.edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer" onClick={() => handleDelete(domain.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t("admin.delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        {/* Batch Action Bar */}
        {selectedIds.size > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border rounded-full shadow-2xl px-6 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300 z-50">
             <span className="text-sm font-medium text-foreground">{t("admin.selected").replace("{count}", selectedIds.size.toString())}</span>
             <div className="h-4 w-px bg-border" />
             <Button variant="ghost" size="sm" onClick={() => handleBatchStatus("available")} className="text-green-500 hover:text-green-600 hover:bg-green-500/10">
               Set Available
             </Button>
             <Button variant="ghost" size="sm" onClick={() => handleBatchStatus("sold")} className="text-muted-foreground hover:text-foreground hover:bg-accent">
               Set Sold
             </Button>
             <Button variant="ghost" size="sm" onClick={handleBatchDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10">
               Delete
             </Button>
             <Button variant="ghost" size="icon" className="rounded-full w-6 h-6 ml-2" onClick={() => setSelectedIds(new Set())}>
               <XCircle className="w-4 h-4 text-muted-foreground" />
             </Button>
          </div>
        )}
      </main>

      <ImportDialog 
        open={isImportOpen} 
        onOpenChange={setIsImportOpen} 
        onImport={handleBatchImport} 
      />

      {/* Add/Edit Dialog */}
      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false);
          setIsEditOpen(false);
        }
      }}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditOpen ? t("admin.edit") : t("admin.add")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-muted-foreground">{t("admin.domain_name")}</Label>
                <Input 
                  className="bg-secondary/50 border-border text-foreground focus-visible:ring-ring"
                  value={currentDomain.name || ""} 
                  onChange={(e) => setCurrentDomain({...currentDomain, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">Provider</Label>
                <Input 
                   className="bg-secondary/50 border-border text-foreground focus-visible:ring-ring"
                  value={currentDomain.provider || ""} 
                  onChange={(e) => setCurrentDomain({...currentDomain, provider: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-muted-foreground">{t("admin.price")}</Label>
                <Input 
                   className="bg-secondary/50 border-border text-foreground focus-visible:ring-ring"
                  value={currentDomain.price || ""} 
                  onChange={(e) => setCurrentDomain({...currentDomain, price: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-muted-foreground">{t("admin.status")}</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={currentDomain.status}
                  onChange={(e) => setCurrentDomain({...currentDomain, status: e.target.value as any})}
                >
                   <option value="available">{t("status.available")}</option>
                   <option value="sold">{t("status.sold")}</option>
                   <option value="reserved">{t("status.reserved")}</option>
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-muted-foreground">{t("admin.expiry")}</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                   type="date"
                   className="pl-10 bg-secondary/50 border-border text-foreground focus-visible:ring-ring block w-full"
                   value={currentDomain.expiryDate || ""} 
                   onChange={(e) => setCurrentDomain({...currentDomain, expiryDate: e.target.value})}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-muted-foreground">{t("admin.note")}</Label>
              <div className="relative">
                <StickyNote className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                 <textarea 
                   className="flex min-h-[80px] w-full rounded-md border border-border bg-secondary/50 px-3 py-2 pl-10 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                   value={currentDomain.note || ""} 
                   onChange={(e) => setCurrentDomain({...currentDomain, note: e.target.value})}
                />
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button onClick={isEditOpen ? handleEdit : handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t("admin.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
