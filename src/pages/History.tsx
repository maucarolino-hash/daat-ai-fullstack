import { useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReportCard } from "@/components/history/ReportCard";

const reports = [
  { id: 1, title: "SaaS B2B Market Analysis", date: "Dec 5, 2024", status: "complete" as const, score: 87, riskLevel: "low" as const },
  { id: 2, title: "Fintech Mobile Competitive Scan", date: "Dec 3, 2024", status: "complete" as const, score: 72, riskLevel: "medium" as const },
  { id: 3, title: "E-commerce Platform Review", date: "Dec 1, 2024", status: "processing" as const, score: 0, riskLevel: "low" as const },
  { id: 4, title: "Healthcare SaaS Deep Dive", date: "Nov 28, 2024", status: "complete" as const, score: 93, riskLevel: "low" as const },
  { id: 5, title: "EdTech Market Entry Analysis", date: "Nov 25, 2024", status: "failed" as const, score: 0, riskLevel: "high" as const },
  { id: 6, title: "Logistics Software Comparison", date: "Nov 20, 2024", status: "complete" as const, score: 68, riskLevel: "medium" as const },
];

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Analysis History</h1>
        <p className="text-muted-foreground">View and manage your past competitive analyses</p>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Sort
        </Button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <ReportCard key={report.id} {...report} />
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12 glass-card">
          <p className="text-muted-foreground">No reports found matching your search.</p>
        </div>
      )}
    </div>
  );
}
