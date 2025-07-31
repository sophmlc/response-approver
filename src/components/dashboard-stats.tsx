import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, Users } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  className?: string;
}

function StatsCard({ title, value, icon: Icon, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export function DashboardStats({ pending, approved, rejected, total }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Pending Review"
        value={pending}
        icon={Clock}
        className="border-l-4 border-l-pending"
      />
      <StatsCard
        title="Approved"
        value={approved}
        icon={CheckCircle}
        className="border-l-4 border-l-success"
      />
      <StatsCard
        title="Rejected"
        value={rejected}
        icon={XCircle}
        className="border-l-4 border-l-destructive"
      />
      <StatsCard
        title="Total Tickets"
        value={total}
        icon={Users}
        className="border-l-4 border-l-primary"
      />
    </div>
  );
}