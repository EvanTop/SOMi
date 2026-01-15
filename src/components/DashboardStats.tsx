import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Domain } from "@/lib/data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { differenceInDays, parseISO } from "date-fns";
import { Coins, Layers, AlertTriangle, CheckCircle2 } from "lucide-react";

interface DashboardStatsProps {
  domains: Domain[];
}

const COLORS = ['#22c55e', '#ef4444', '#eab308', '#3b82f6', '#a855f7'];

export function DashboardStats({ domains }: DashboardStatsProps) {
  const { t } = useLanguage();

  const stats = useMemo(() => {
    let totalValue = 0;
    let soldCount = 0;
    let expiringSoonCount = 0;
    const statusCounts: Record<string, number> = { available: 0, sold: 0, reserved: 0 };
    const tldCounts: Record<string, number> = {};

    domains.forEach(d => {
      // Value
      const priceStr = d.price?.replace(/[^\d.]/g, "") || "0";
      totalValue += parseFloat(priceStr);

      // Status
      if (d.status === "sold") soldCount++;
      if (statusCounts[d.status] !== undefined) statusCounts[d.status]++;

      // Expiry (assuming expiryDate is YYYY-MM-DD)
      if (d.expiryDate) {
        try {
          const days = differenceInDays(parseISO(d.expiryDate), new Date());
          if (days <= 30 && days >= 0) expiringSoonCount++;
        } catch (e) {
          // ignore invalid dates
        }
      }

      // TLD
      const parts = d.name.split('.');
      if (parts.length > 1) {
        const tld = '.' + parts[parts.length - 1].toLowerCase();
        tldCounts[tld] = (tldCounts[tld] || 0) + 1;
      }
    });

    const statusData = Object.keys(statusCounts).map(key => ({
      name: key, // We will translate this in render
      value: statusCounts[key]
    })).filter(d => d.value > 0);

    const tldData = Object.keys(tldCounts)
      .map(key => ({ name: key, value: tldCounts[key] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5

    return { totalValue, soldCount, expiringSoonCount, statusData, tldData };
  }, [domains]);

  return (
    <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              {t("dashboard.total_domains")}
            </CardTitle>
            <Layers className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              {t("dashboard.total_value")}
            </CardTitle>
            <Coins className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{stats.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              {t("dashboard.sold_domains")}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.soldCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              {t("dashboard.expiring_soon")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{stats.expiringSoonCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">
              {t("dashboard.status_dist")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
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
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-400">
              {t("dashboard.tld_dist")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.tldData}>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#27272a' }}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#e4e4e7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
