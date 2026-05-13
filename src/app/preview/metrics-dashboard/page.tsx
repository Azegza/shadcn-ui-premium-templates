import { Metadata } from "next";
import { MetricsDashboardBlock } from "@/components/blocks/metrics-dashboard";

export const metadata: Metadata = {
  title: "Nova Metrics Dashboard",
  description: "A premium, high-performance analytics dashboard with real-time charts and data visualization.",
};

export default function MetricsDashboardPreviewPage() {
  return <MetricsDashboardBlock />;
}
