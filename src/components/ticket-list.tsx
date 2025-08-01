import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TicketStatusBadge, type TicketStatus } from "./ticket-status-badge";
import { formatDistanceToNow } from "date-fns";
import { Eye, User, MessageSquare, CheckCircle, Edit, Save, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Ticket {
  id: string;
  title: string;
  customerName: string;
  customerEmail: string;
  customerId: string;
  customerQuery: string;
  queryType: string;
  querySubtype: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  responseText: string;
  agentName: string;
  isEdited: boolean;
}

interface TicketListProps {
  tickets: Ticket[];
  onViewTicket: (ticketId: string) => void;
  onApprove: (ticketId: string) => void;
  onUpdateResponse: (ticketId: string, newResponse: string) => void;
}

export function TicketList({ tickets, onViewTicket, onApprove, onUpdateResponse }: TicketListProps) {
  const [editingTicket, setEditingTicket] = useState<string | null>(null);
  const [editedResponse, setEditedResponse] = useState("");
  const { toast } = useToast();

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

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket.id);
    setEditedResponse(ticket.responseText);
  };

  const handleSave = (ticketId: string) => {
    if (editedResponse.trim()) {
      onUpdateResponse(ticketId, editedResponse);
      setEditingTicket(null);
      setEditedResponse("");
      toast({
        title: "Response Updated",
        description: "The proposed response has been updated successfully.",
      });
    }
  };

  const handleCancel = () => {
    setEditingTicket(null);
    setEditedResponse("");
  };

  const handleApprove = (ticketId: string) => {
    onApprove(ticketId);
    toast({
      title: "Response Approved",
      description: "The response has been approved and will be sent to the student.",
    });
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
                 {ticket.isEdited && (
                   <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
                     Edited
                   </Badge>
                 )}
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
          <CardContent className="space-y-4">
            {/* Customer Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{ticket.customerName}</span>
                  </div>
                  <div className="text-muted-foreground font-mono text-xs bg-muted px-2 py-1 rounded">
                    ID: {ticket.customerId}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{ticket.queryType} - {ticket.querySubtype}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority} Priority
                  </span>
                  <span className="text-muted-foreground">{formatDistanceToNow(ticket.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Customer Query */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Customer Query:</p>
              <div className="bg-blue-50 border-l-4 border-l-primary p-3 rounded-md">
                <p className="text-sm">{ticket.customerQuery}</p>
              </div>
            </div>

            {/* Proposed Response */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Proposed Response:</p>
              {editingTicket === ticket.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editedResponse}
                    onChange={(e) => setEditedResponse(e.target.value)}
                    className="min-h-[120px]"
                    placeholder="Edit the proposed response..."
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(ticket.id)}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/50 p-4 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{ticket.responseText}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {ticket.status === "pending" && editingTicket !== ticket.id && (
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => handleApprove(ticket.id)}
                  className="gap-2"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Response
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleEdit(ticket)}
                  className="gap-2"
                  size="sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit Response
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}