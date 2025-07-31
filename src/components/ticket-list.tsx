import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TicketStatusBadge, type TicketStatus } from "./ticket-status-badge";
import { formatDistanceToNow } from "date-fns";
import { Eye, User, MessageSquare } from "lucide-react";

export interface Ticket {
  id: string;
  title: string;
  customerName: string;
  customerEmail: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  responseText: string;
  agentName: string;
}

interface TicketListProps {
  tickets: Ticket[];
  onViewTicket: (ticketId: string) => void;
}

export function TicketList({ tickets, onViewTicket }: TicketListProps) {
  const getPriorityColor = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-warning";
      case "low":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg">{ticket.title}</h3>
                <TicketStatusBadge status={ticket.status} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewTicket(ticket.id)}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{ticket.customerName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>Agent: {ticket.agentName}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority} Priority
                </span>
                <span>{formatDistanceToNow(ticket.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground mb-1">Proposed Response:</p>
              <p className="text-sm line-clamp-2">{ticket.responseText}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}