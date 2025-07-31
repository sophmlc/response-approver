import { useState } from "react";
import { DashboardStats } from "@/components/dashboard-stats";
import { TicketList, type Ticket } from "@/components/ticket-list";
import { TicketDetailModal } from "@/components/ticket-detail-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeadphonesIcon, Filter } from "lucide-react";

// Sample data
const sampleTickets: Ticket[] = [
  {
    id: "1",
    title: "Account Login Issues",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.johnson@email.com",
    status: "pending",
    priority: "high",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    responseText: "Hi Sarah, I apologize for the login issues you're experiencing. I've reset your password and sent the new credentials to your email. Please try logging in again and let me know if you continue to have problems. Our technical team has also been notified to prevent this issue in the future.",
    agentName: "Mike Chen"
  },
  {
    id: "2",
    title: "Billing Discrepancy",
    customerName: "Robert Davis",
    customerEmail: "robert.davis@company.com",
    status: "pending",
    priority: "medium",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    responseText: "Hello Robert, thank you for bringing this billing discrepancy to our attention. I've reviewed your account and found that there was indeed an error in our billing system. I've processed a full refund of $45.99 which should appear in your account within 3-5 business days. I've also applied a 10% discount to your next bill as an apology for the inconvenience.",
    agentName: "Lisa Rodriguez"
  },
  {
    id: "3",
    title: "Feature Request - Dark Mode",
    customerName: "Alex Thompson",
    customerEmail: "alex.t@startup.io",
    status: "approved",
    priority: "low",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    responseText: "Hi Alex, thank you for your feature request regarding dark mode! I'm excited to let you know that our development team has already been working on this feature and it's scheduled to be released in our next major update in Q2. I'll make sure to add you to our beta testing list so you can try it out early. We really appreciate customers like you who help us improve our product!",
    agentName: "David Park"
  },
  {
    id: "4",
    title: "Service Cancellation Request",
    customerName: "Maria Garcia",
    customerEmail: "maria.garcia@email.com",
    status: "rejected",
    priority: "medium",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    responseText: "Hi Maria, I understand you'd like to cancel your service. However, I see you're currently in a contract period that doesn't end until next month. Canceling now would incur a $150 early termination fee. Instead, I'd like to offer you a 50% discount for the next 3 months to see if we can resolve any issues you're having with our service.",
    agentName: "Emma Wilson"
  }
];

const Index = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(sampleTickets);
  const [activeTab, setActiveTab] = useState("all");

  const handleViewTicket = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setIsModalOpen(true);
    }
  };

  const handleApprove = (ticketId: string, comment?: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: "approved" as const }
        : ticket
    ));
  };

  const handleUpdateResponse = (ticketId: string, newResponse: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, responseText: newResponse }
        : ticket
    ));
  };

  const handleReject = (ticketId: string, comment: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: "rejected" as const }
        : ticket
    ));
  };

  const filteredTickets = tickets.filter(ticket => {
    if (activeTab === "all") return true;
    return ticket.status === activeTab;
  });

  const stats = {
    pending: tickets.filter(t => t.status === "pending").length,
    approved: tickets.filter(t => t.status === "approved").length,
    rejected: tickets.filter(t => t.status === "rejected").length,
    total: tickets.length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <HeadphonesIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Support Approval Center</h1>
                <p className="text-muted-foreground">Review and approve customer support responses</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <DashboardStats {...stats} />

        {/* Tickets Section */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab} className="mt-6">
                {filteredTickets.length > 0 ? (
                  <TicketList
                    tickets={filteredTickets}
                    onViewTicket={handleViewTicket}
                    onApprove={handleApprove}
                    onUpdateResponse={handleUpdateResponse}
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No tickets found for this status.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default Index;