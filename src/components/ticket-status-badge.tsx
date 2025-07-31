import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export type TicketStatus = "pending" | "approved" | "rejected";

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const config = {
    pending: {
      label: "Pending Review",
      className: "bg-pending text-pending-foreground hover:bg-pending/80",
      icon: Clock,
    },
    approved: {
      label: "Approved",
      className: "bg-success text-success-foreground hover:bg-success/80",
      icon: CheckCircle,
    },
    rejected: {
      label: "Rejected",
      className: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
      icon: XCircle,
    },
  };

  const { label, className, icon: Icon } = config[status];

  return (
    <Badge className={className}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
}