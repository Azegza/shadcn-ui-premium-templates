"use client";

import React, { useState } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  useMotionTemplate 
} from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from "recharts";
import { 
  ChartLineUp, 
  Users, 
  CurrencyDollar, 
  ArrowUpRight, 
  ArrowDownRight,
  DotsThreeVertical,
  MagnifyingGlass,
  Bell,
  Envelope,
  UserCircle,
  Layout,
  ChartPieSlice,
  Wallet,
  Gear,
  Question,
  List,
  X,
  TrendUp,
  Circle,
  CreditCard,
  ShieldCheck,
  Notification,
  PencilSimple,
  Trash
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const revenueData = [
  { name: "Jan", value: 45000, expenses: 32000 },
  { name: "Feb", value: 52000, expenses: 35000 },
  { name: "Mar", value: 48000, expenses: 31000 },
  { name: "Apr", value: 61000, expenses: 38000 },
  { name: "May", value: 55000, expenses: 34000 },
  { name: "Jun", value: 67000, expenses: 40000 },
  { name: "Jul", value: 72000, expenses: 42000 },
];

const trafficData = [
  { name: "Direct", value: 40, color: "var(--chart-1)" },
  { name: "Social", value: 30, color: "var(--chart-2)" },
  { name: "Referral", value: 20, color: "oklch(0.7 0.1 200)" },
  { name: "Other", value: 10, color: "oklch(0.5 0.05 0)" },
];

const customers = [
  { id: 1, name: "Alex Rivera", email: "alex@rivera.com", plan: "Pro", status: "Active", spent: "$1,240", joined: "Oct 24, 2025" },
  { id: 2, name: "Sarah Chen", email: "sarah.c@tech.io", plan: "Enterprise", status: "Active", spent: "$4,500", joined: "Nov 12, 2025" },
  { id: 3, name: "Mike Johnson", email: "mikej@gmail.com", plan: "Free", status: "Inactive", spent: "$0", joined: "Dec 01, 2025" },
  { id: 4, name: "Emma Wilson", email: "emma.w@design.com", plan: "Pro", status: "Active", spent: "$890", joined: "Dec 15, 2025" },
  { id: 5, name: "Lucas Brown", email: "lucas@dev.net", plan: "Pro", status: "Active", spent: "$2,100", joined: "Jan 05, 2026" },
];

const recentActivity = [
  { id: 1, user: "Alex Rivera", action: "Purchased Pro Plan", time: "2m ago", amount: "$49.00", status: "success" },
  { id: 2, user: "Sarah Chen", action: "Upgraded to Enterprise", time: "15m ago", amount: "$149.00", status: "success" },
  { id: 3, user: "Mike Johnson", action: "Failed Payment", time: "1h ago", amount: "$49.00", status: "error" },
  { id: 4, user: "Emma Wilson", action: "New Registration", time: "3h ago", amount: "$0.00", status: "neutral" },
];

// ─── Components ─────────────────────────────────────────────────────────────

function MagneticCard({ children, className, variant = "premium" }: { children: React.ReactNode; className?: string; variant?: "standard" | "premium" }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const rotateX = useTransform(mouseY, [0, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [0, 300], [-5, 5]);
  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);

  const background = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      oklch(var(--chart-1) / 0.1),
      transparent 80%
    )
  `;

  return (
    <motion.div
      onMouseMove={onMouseMove}
      style={variant === "premium" ? { rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" } : {}}
      className={cn(
        "group relative rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900/50",
        variant === "premium" && "dark:hover:bg-zinc-800/40",
        className
      )}
    >
      {variant === "premium" && (
        <motion.div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity group-hover:opacity-100" style={{ background }} />
      )}
      {children}
    </motion.div>
  );
}

function StatCard({ title, value, trend, trendValue, icon: Icon, delay, variant = "premium" }: any) {
  return (
    <motion.div 
      initial={variant === "premium" ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <MagneticCard className="p-6" variant={variant}>
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
            <Icon size={20} weight="duotone" />
          </div>
          <Badge variant="secondary" className={cn("gap-1 font-semibold", trend === "up" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400")}>
            {trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trendValue}
          </Badge>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{title}</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{value}</h2>
        </div>
      </MagneticCard>
    </motion.div>
  );
}

// ─── Sub-UI Views ──────────────────────────────────────────────────────────

const OverviewUI = ({ data }: { data: any }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Revenue" value="$128,430" trend="up" trendValue="12.5%" icon={CurrencyDollar} delay={0.1} variant={data.variant} />
      <StatCard title="Active Users" value="43,520" trend="up" trendValue="8.2%" icon={Users} delay={0.2} variant={data.variant} />
      <StatCard title="Conversion Rate" value="3.42%" trend="down" trendValue="1.1%" icon={ChartLineUp} delay={0.3} variant={data.variant} />
      <StatCard title="Session Duration" value="4m 32s" trend="up" trendValue="24%" icon={Layout} delay={0.4} variant={data.variant} />
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2 rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/50">
        <CardHeader className="pb-2">
          <CardTitle as="h2" className="text-lg">Revenue Growth</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">Performance comparison over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "oklch(0.3 0.02 240)", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.3 0.02 240)", fontSize: 12 }} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--background)", borderRadius: "12px", border: "1px solid var(--border)", color: "var(--foreground)" }} 
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--chart-1)" strokeWidth={3} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/50">
        <CardHeader>
          <CardTitle as="h2" className="text-lg">Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {trafficData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full space-y-2 mt-4 text-sm text-zinc-700 dark:text-zinc-300">
            {trafficData.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item.name}</span>
                <span className="font-bold text-zinc-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const AnalyticsUI = () => (
  <div className="space-y-8">
     <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CardHeader>
            <CardTitle as="h2">Usage Metrics</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">API requests and computational load.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "oklch(0.3 0.02 240)", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.3 0.02 240)", fontSize: 12 }} />
                      <Tooltip 
                          cursor={{fill: 'transparent'}} 
                          contentStyle={{ backgroundColor: "var(--background)", borderRadius: "12px", border: "1px solid var(--border)", color: "var(--foreground)" }} 
                          itemStyle={{ color: "var(--foreground)" }}
                          labelStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
                      />
                      <Bar dataKey="expenses" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CardHeader>
            <CardTitle as="h2">Retention Rate</CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400">User stickiness over 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "oklch(0.3 0.02 240)", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.3 0.02 240)", fontSize: 12 }} />
                      <Tooltip 
                          contentStyle={{ backgroundColor: "var(--background)", borderRadius: "12px", border: "1px solid var(--border)", color: "var(--foreground)" }} 
                          itemStyle={{ color: "var(--foreground)" }}
                          labelStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
                      />
                      <Line type="step" dataKey="value" stroke="var(--chart-1)" strokeWidth={3} dot={{r: 4}} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
     </div>
  </div>
);

const RevenueUI = () => (
  <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/50">
    <CardHeader>
      <CardTitle as="h2">Detailed Revenue</CardTitle>
      <CardDescription className="text-zinc-700 dark:text-zinc-400">Monthly breakdown of gross and net profit.</CardDescription>
    </CardHeader>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-xs font-bold text-zinc-700 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Month</th>
              <th className="px-6 py-4">Gross Revenue</th>
              <th className="px-6 py-4">Expenses</th>
              <th className="px-6 py-4">Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {revenueData.map((row, i) => (
              <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                <td className="px-6 py-4 font-medium">{row.name}</td>
                <td className="px-6 py-4 text-emerald-600 font-bold">${row.value.toLocaleString()}</td>
                <td className="px-6 py-4 text-rose-500">${row.expenses.toLocaleString()}</td>
                <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">${(row.value - row.expenses).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

const CustomersUI = () => (
  <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/50">
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle as="h2">Customer Directory</CardTitle>
        <CardDescription className="text-zinc-700 dark:text-zinc-400">Manage your user base and their subscriptions.</CardDescription>
      </div>
      <Button className="bg-emerald-700 hover:bg-emerald-800">Add Customer</Button>
    </CardHeader>
    <CardContent className="p-0">
       <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-xs font-bold text-zinc-700 uppercase">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Spent</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs">{c.name.charAt(0)}</div>
                      <div>
                        <div className="text-sm font-bold">{c.name}</div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">{c.email}</div>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="rounded-full border-zinc-200 dark:border-zinc-700">{c.plan}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className={c.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"}>{c.status}</Badge>
                </td>
                <td className="px-6 py-4 font-bold">{c.spent}</td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Edit ${c.name}`}><PencilSimple /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500" aria-label={`Delete ${c.name}`}><Trash /></Button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

const SettingsUI = () => (
  <div className="max-w-3xl space-y-6">
    <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/50">
      <CardHeader>
        <CardTitle as="h2">General Settings</CardTitle>
        <CardDescription className="text-zinc-700 dark:text-zinc-400">Update your workspace profile and identity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Workspace Name</Label>
          <Input defaultValue="NovaMetrics HQ" className="rounded-xl border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="space-y-2">
          <Label>Contact Email</Label>
          <Input defaultValue="billing@novametrics.com" className="rounded-xl border-zinc-200 dark:border-zinc-800" />
        </div>
        <Button className="bg-emerald-700 hover:bg-emerald-800">Save Changes</Button>
      </CardContent>
    </Card>

    <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900/50">
      <CardHeader>
        <CardTitle as="h2">Preferences</CardTitle>
        <CardDescription className="text-zinc-700 dark:text-zinc-400">Manage your notification and security settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
           <div className="space-y-0.5">
             <Label>Email Notifications</Label>
             <p className="text-xs text-zinc-700 dark:text-zinc-300">Receive weekly revenue reports via email.</p>
           </div>
           <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
           <div className="space-y-0.5">
             <Label>Two-Factor Authentication</Label>
             <p className="text-xs text-zinc-700 dark:text-zinc-300">Secure your account with 2FA verification.</p>
           </div>
           <Switch />
        </div>
      </CardContent>
    </Card>
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────

export function MetricsDashboardBlock({ variant = "premium" }: { variant?: "standard" | "premium" }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [data, setData] = useState(revenueData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newData = data.map(item => ({
        ...item,
        value: item.value + (Math.random() * 4000 - 2000)
      }));
      setData(newData);
      setIsRefreshing(false);
    }, 800);
  };

  const renderContent = () => {
    const commonData = { ...data, variant };
    switch (activeTab) {
      case "Overview": return <OverviewUI data={commonData} />;
      case "Analytics": return <AnalyticsUI />;
      case "Revenue": return <RevenueUI />;
      case "Customers": return <CustomersUI />;
      case "Settings": return <SettingsUI />;
      default: return <OverviewUI data={commonData} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-e border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900/50 backdrop-blur-xl",
        isSidebarOpen ? "w-64" : "w-20",
        variant === "standard" && "dark:bg-zinc-900"
      )}>
        <div className="flex h-16 items-center justify-between px-6">
          {isSidebarOpen ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                <TrendUp weight="bold" />
              </div>
              <span>NovaMetrics</span>
            </motion.div>
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
              <TrendUp weight="bold" />
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-4 py-4">
          {[
            { icon: Layout, label: "Overview" },
            { icon: ChartPieSlice, label: "Analytics" },
            { icon: Wallet, label: "Revenue" },
            { icon: Users, label: "Customers" },
            { icon: Gear, label: "Settings" },
          ].map((item, i) => (
            <Button
              key={i}
              variant="ghost"
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "w-full justify-start gap-3 rounded-xl px-3 transition-all duration-200 active:scale-95",
                activeTab === item.label ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 font-semibold" : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/50",
                !isSidebarOpen && "justify-center"
              )}
            >
              <item.icon size={20} weight={activeTab === item.label ? "duotone" : "regular"} />
              {isSidebarOpen && <span>{item.label}</span>}
              {activeTab === item.label && isSidebarOpen && (
                <motion.div layoutId="active-pill" className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              )}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
           <Button
              variant="ghost"
              className={cn("w-full justify-start gap-3 rounded-xl px-3 text-zinc-700 dark:text-zinc-300", !isSidebarOpen && "justify-center")}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <List size={20} />
              {isSidebarOpen && <span>Collapse</span>}
            </Button>
        </div>
      </aside>

      <main className={cn("flex-1 transition-all duration-300", isSidebarOpen ? "ps-64" : "ps-20")}>
        <header className={cn(
          "sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-8 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80",
          variant === "standard" && "bg-white dark:bg-zinc-950"
        )}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-xs w-full">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
              <Input placeholder="Search analytics..." className="ps-10 h-9 rounded-xl border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 placeholder:text-zinc-700" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-zinc-700 dark:text-zinc-400">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
              <Bell size={20} className="text-zinc-700 dark:text-zinc-400" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emerald-700 border-2 border-white dark:border-zinc-950" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-300 dark:border-zinc-700">
               <UserCircle size={24} className="text-zinc-600 dark:text-zinc-400" />
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{activeTab}</h1>
              <p className="text-zinc-600 dark:text-zinc-400">Welcome back, here&apos;s what&apos;s happening with your projects today.</p>
            </div>
            {activeTab === "Overview" && (
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl dark:border-zinc-800 group" onClick={refreshData} disabled={isRefreshing}>
                  <ArrowUpRight className={cn("mr-2 h-4 w-4 transition-transform", isRefreshing && "animate-spin")} />
                  {isRefreshing ? "Refreshing..." : "Refresh Stats"}
                </Button>
                <Button className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">Add Widget</Button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
               {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
