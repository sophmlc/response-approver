import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TicketStatusBadge, type TicketStatus } from "./ticket-status-badge";
import { type Ticket } from "./ticket-list";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { User, Mail, Calendar, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (ticketId: string, comment?: string) => void;
  onReject: (ticketId: string, comment: string) => void;
}

export function TicketDetailModal({ 
  ticket, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject 
}: TicketDetailModalProps) {
  const [comment, setComment] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const { toast } = useToast();

  if (!ticket) return null;

  const handleSubmit = () => {
    if (action === "approve") {
      onApprove(ticket.id, comment);
      toast({
        title: "Response Approved",
        description: "The customer support response has been approved and sent.",
      });
    } else if (action === "reject") {
      if (!comment.trim()) {
        toast({
          title: "Comment Required",
          description: "Please provide a reason for rejecting this response.",
          variant: "destructive",
        });
        return;
      }
      onReject(ticket.id, comment);
      toast({
        title: "Response Rejected",
        description: "The response has been rejected and sent back for revision.",
      });
    }
    
    setComment("");
    setAction(null);
    onClose();
  };

  const getPriorityColor = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {ticket.title}
            <TicketStatusBadge status={ticket.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{ticket.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{ticket.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{formatDistanceToNow(ticket.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge className={getPriorityColor(ticket.priority)}>
                {ticket.priority.toUpperCase()} Priority
              </Badge>
              <span className="text-sm text-muted-foreground">
                Agent: {ticket.agentName}
              </span>
            </div>
          </div>

          {/* Proposed Response */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Proposed Customer Response
            </h3>
            <div className="bg-card border rounded-lg p-4">
              <p className="whitespace-pre-wrap">{ticket.responseText}</p>
            </div>
          </div>

          {/* Action Section */}
          {ticket.status === "pending" && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold">Review Action</h3>
              
              <div className="flex gap-3">
                <Button
                  variant={action === "approve" ? "default" : "outline"}
                  onClick={() => setAction("approve")}
                  className="gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Response
                </Button>
                <Button
                  variant={action === "reject" ? "destructive" : "outline"}
                  onClick={() => setAction("reject")}
                  className="gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Response
                </Button>
              </div>

              {action && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    {action === "approve" ? "Comments (Optional)" : "Rejection Reason (Required)"}
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      action === "approve"
                        ? "Add any additional comments..."
                        : "Please explain why this response needs to be revised..."
                    }
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSubmit} size="sm">
                      Confirm {action === "approve" ? "Approval" : "Rejection"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setAction(null);
                        setComment("");
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}