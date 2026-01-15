import { useState, useRef } from "react";
import { Upload, FileText, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Domain } from "@/lib/data";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (domains: Partial<Domain>[]) => void;
}

export function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("text");
  const [textInput, setTextInput] = useState("");
  const [parsedData, setParsedData] = useState<Partial<Domain>[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseLine = (line: string): Partial<Domain> | null => {
    const cleanLine = line.trim();
    if (!cleanLine) return null;

    // Split by comma or tab, handle quotes if necessary (simple split for now)
    const parts = cleanLine.split(/,|，/).map(s => s.trim());
    
    if (parts.length === 0) return null;

    const name = parts[0];
    const price = parts[1] || "";
    const provider = parts[2] || "Manual";
    let status = (parts[3] || "available").toLowerCase();

    if (!["available", "sold", "reserved"].includes(status)) {
      status = "available";
    }

    return {
      name,
      price,
      provider,
      status: status as any,
    };
  };

  const handleParseText = () => {
    const lines = textInput.split("\n");
    const results: Partial<Domain>[] = [];
    
    lines.forEach(line => {
      const parsed = parseLine(line);
      if (parsed) results.push(parsed);
    });

    if (results.length > 0) {
      setParsedData(results);
      setPreviewMode(true);
    } else {
      toast.error(t("import.error_format"));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split(/\r\n|\n/);
      const results: Partial<Domain>[] = [];

      lines.forEach((line, index) => {
        // Skip header if it looks like a header (optional, simple check)
        if (index === 0 && line.toLowerCase().includes("domain")) return;
        
        const parsed = parseLine(line);
        if (parsed) results.push(parsed);
      });

      if (results.length > 0) {
        setParsedData(results);
        setPreviewMode(true);
      } else {
        toast.error(t("import.error_format"));
      }
    };
    reader.readAsText(file);
  };

  const handleConfirm = () => {
    onImport(parsedData);
    setPreviewMode(false);
    setParsedData([]);
    setTextInput("");
    onOpenChange(false);
  };

  const handleBack = () => {
    setPreviewMode(false);
    setParsedData([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800 text-white max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("import.title")}</DialogTitle>
          <DialogDescription>
            {t("import.desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {!previewMode ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
                <TabsTrigger value="text">{t("import.tab_text")}</TabsTrigger>
                <TabsTrigger value="csv">{t("import.tab_csv")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Textarea 
                    placeholder={t("import.text_placeholder")}
                    className="min-h-[200px] font-mono text-sm bg-zinc-950 border-zinc-800 text-white focus-visible:ring-zinc-700"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                </div>
                <Button onClick={handleParseText} className="w-full bg-white text-black hover:bg-zinc-200">
                  <FileText className="w-4 h-4 mr-2" />
                  {t("import.preview")}
                </Button>
              </TabsContent>
              
              <TabsContent value="csv" className="space-y-4 mt-4">
                <div className="border-2 border-dashed border-zinc-800 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors bg-zinc-950/50">
                  <Upload className="w-10 h-10 text-zinc-500 mb-4" />
                  <Input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".csv,.txt"
                    className="hidden" 
                    id="csv-upload"
                    onChange={handleFileUpload}
                  />
                  <label 
                    htmlFor="csv-upload"
                    className="cursor-pointer text-sm font-medium text-white hover:underline"
                  >
                    {t("import.csv_label")}
                  </label>
                  <p className="text-xs text-zinc-500 mt-2">.csv or .txt files</p>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-zinc-400">
                  {t("import.preview")} ({parsedData.length})
                </h4>
                <Button variant="ghost" size="sm" onClick={handleBack} className="text-zinc-400 hover:text-white">
                  Back
                </Button>
              </div>
              <div className="border border-zinc-800 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-zinc-900 sticky top-0">
                    <TableRow className="border-zinc-800 hover:bg-zinc-900">
                      <TableHead className="text-zinc-400">{t("import.col_domain")}</TableHead>
                      <TableHead className="text-zinc-400">{t("import.col_price")}</TableHead>
                      <TableHead className="text-zinc-400">{t("import.col_provider")}</TableHead>
                      <TableHead className="text-zinc-400">{t("import.col_status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((item, i) => (
                      <TableRow key={i} className="border-zinc-800 hover:bg-zinc-900/50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.provider}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-500">
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button onClick={handleConfirm} className="w-full bg-white text-black hover:bg-zinc-200">
                <Check className="w-4 h-4 mr-2" />
                {t("import.confirm").replace("{count}", parsedData.length.toString())}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
