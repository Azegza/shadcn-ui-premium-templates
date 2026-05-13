"use client";

import { useState } from "react";
import { 
  Users, 
  CurrencyDollar, 
  ChartLineUp, 
  Layout, 
  MagnifyingGlass, 
  Bell, 
  Gear, 
  ArrowUpRight, 
  ArrowDownRight,
  List,
  House,
  ChartBar,
  CreditCard,
  UserCircle
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ─── Dummy Data ─────────────────────────────────────────────────────────────

const revenueData = [
  { name: "Jan", revenue: 4500 },
  { name: "Feb", revenue: 5200 },
  { name: "Mar", revenue: 4800 },
  { name: "Apr", revenue: 6100 },
  { name: "May", revenue: 5900 },
  { name: "Jun", revenue: 7200 },
];

// ─── Components ─────────────────────────────────────────────────────────────

function StatCard({ title, value, trend, trendValue, icon: Icon }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-zinc-500">
          <Icon size={16} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
          <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
            {trend === "up" ? <ArrowUpRight /> : <ArrowDownRight />} {trendValue}
          </span>
          from last month
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Main Block ─────────────────────────────────────────────────────────────

export function MetricsDashboardStandard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { title: "Total Revenue", value: "$128,430", trend: "up", trendValue: "12.5%", icon: CurrencyDollar },
    { title: "Active Users", value: "43,520", trend: "up", trendValue: "8.2%", icon: Users },
    { title: "Conversion", value: "3.42%", trend: "down", trendValue: "1.1%", icon: ChartLineUp },
    { title: "Sessions", value: "4m 32s", trend: "up", trendValue: "24%", icon: Layout },
  ];

  const filteredStats = stats.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-e border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="flex h-16 items-center justify-between px-6">
          {isSidebarOpen && <span className="text-xl font-bold tracking-tighter">NOVA LITE</span>}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <List size={20} />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {[
            { name: "Overview", icon: House },
            { name: "Analytics", icon: ChartBar },
            { name: "Revenue", icon: CreditCard },
            { name: "Customers", icon: Users },
            { name: "Settings", icon: Gear },
          ].map((item) => (
            <Button key={item.name} variant="ghost" className={cn(
              "w-full justify-start gap-3",
              !isSidebarOpen && "justify-center px-0"
            )}>
              <item.icon size={20} />
              {isSidebarOpen && <span>{item.name}</span>}
            </Button>
          ))}
        </nav>
      </aside>

      <main className={cn("flex-1 transition-all duration-300", isSidebarOpen ? "ps-64" : "ps-20")}>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-xs w-full">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <Input 
                placeholder="Search metrics..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-zinc-50 dark:bg-zinc-900" 
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell size={20} /></Button>
            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </header>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
              <p className="text-zinc-500">Welcome back, here is what is happening today.</p>
            </div>
            <Button>Download Report</Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {filteredStats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center text-zinc-400 italic">
                Charts require Recharts dependency.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 border-b border-zinc-100 pb-3 last:border-0 dark:border-zinc-800">
                      <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-500/20" />
                      <div>
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-zinc-500">2 minutes ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
