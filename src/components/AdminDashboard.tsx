import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Globe, AlertTriangle, Database } from "lucide-react";
import type { Domain } from "@/lib/data";

interface AdminDashboardProps {
  domains: Domain[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export function AdminDashboard({ domains }: AdminDashboardProps) {
  const { t } = useLanguage();

  const stats = useMemo(() => {
    const total = domains.length;
    
    // Calculate total value
    const totalValue = domains.reduce((sum, d) => {
      // Remove currency symbols and non-numeric chars
      const priceStr = d.price?.replace(/[^0-9.]/g, "") || "0";
      return sum + parseFloat(priceStr);
    }, 0);

    // Calculate status distribution
    const statusCount = domains.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusData = Object.keys(statusCount).map((status) => ({
      name: t(`status.${status}`),
      value: statusCount[status],
      rawStatus: status
    }));

    // Calculate suffix distribution
    const suffixCount = domains.reduce((acc, d) => {
      const parts = d.name.split(".");
      if (parts.length > 1) {
        const suffix = "." + parts[parts.length - 1].toLowerCase();
        acc[suffix] = (acc[suffix] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const suffixData = Object.entries(suffixCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Calculate provider distribution
    const providerCount = domains.reduce((acc, d) => {
      const provider = d.provider || "Unknown";
      acc[provider] = (acc[provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const providerData = Object.entries(providerCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
      
    // Calculate expiring soon
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);
    
    const expiringSoon = domains.filter(d => {
      if (!d.expiryDate) return false;
      const date = new Date(d.expiryDate);
      return date > now && date < threeMonthsLater;
    }).length;

    return { total, totalValue, statusData, suffixData, providerData, expiringSoon };
  }, [domains, t]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.total_assets")}
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.total_value")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
               ~{stats.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("admin.expiring_soon")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringSoon}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border text-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Health
            </CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Healthy</div>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Pie Charts (Distributions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <Card className="bg-card border-border text-foreground col-span-1">
          <CardHeader>
            <CardTitle>{t("dashboard.status_dist")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)' }}
                  itemStyle={{ color: 'var(--popover-foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {stats.statusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Suffix Share (New Pie Chart) */}
        <Card className="bg-card border-border text-foreground col-span-1">
          <CardHeader>
            <CardTitle>{t("dashboard.suffix_share")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.suffixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#82ca9d"
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stats.suffixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)' }}
                  itemStyle={{ color: 'var(--popover-foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
              {stats.suffixData.slice(0, 5).map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Bar Charts (Rankings) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Suffix Distribution (Bar) */}
        <Card className="bg-card border-border text-foreground col-span-1">
          <CardHeader>
            <CardTitle>{t("dashboard.suffix_dist")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.suffixData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip 
                  cursor={{ fill: 'var(--accent)' }}
                  contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)' }}
                />
                <Bar dataKey="value" fill="var(--foreground)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Provider Distribution (Bar) */}
        <Card className="bg-card border-border text-foreground col-span-1">
          <CardHeader>
            <CardTitle>{t("dashboard.provider_dist")}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.providerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip 
                  cursor={{ fill: 'var(--accent)' }}
                  contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)' }}
                />
                <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
