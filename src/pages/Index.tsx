import { useState } from "react";
import { DashboardStats } from "@/components/dashboard-stats";
import { TicketList, type Ticket } from "@/components/ticket-list";
import { TicketDetailModal } from "@/components/ticket-detail-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeadphonesIcon, Filter } from "lucide-react";

// Sample data
const sampleTickets: Ticket[] = [
  {
    id: "1",
    title: "Account Login Issues",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.johnson@email.com",
    customerId: "STU-001",
    customerQuery: "Dear Support Team,\n\nI've been trying to log into my student portal for the past hour but keep getting an 'invalid credentials' error message. I've tried resetting my password twice using the 'Forgot Password' link, but I still can't access my account.\n\nThis is urgent as I need to submit my Psychology assignment that's due tonight at 11:59 PM. I've been working on it all week and really don't want to miss the deadline.\n\nPlease help me resolve this as soon as possible.\n\nBest regards,\nSarah Johnson\nStudent ID: STU-001",
    queryType: "Technical Support",
    querySubtype: "Login Issues",
    status: "pending",
    priority: "high",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    responseText: "Hi Sarah, I apologize for the login issues you're experiencing. I've reset your password and sent the new credentials to your email. Please try logging in again and let me know if you continue to have problems. Our technical team has also been notified to prevent this issue in the future.",
    agentName: "Mike Chen",
    isEdited: false
  },
  {
    id: "2",
    title: "Billing Discrepancy",
    customerName: "Robert Davis",
    customerEmail: "robert.davis@company.com",
    customerId: "STU-002",
    customerQuery: "Hello Billing Department,\n\nI just received my monthly tuition statement and noticed an extra charge of $145.99 that I don't recognize. The line item shows 'LAB-FEE-SUPP' but I'm not enrolled in any lab courses this semester.\n\nI've reviewed my course schedule and I'm only taking:\n- English Literature (ENG-201)\n- History of Art (ART-150) \n- Business Communications (BUS-100)\n\nNone of these require lab fees. Could you please investigate this charge and let me know what it's for? If it's an error, I'd appreciate a refund.\n\nThank you,\nRobert Davis",
    queryType: "Billing & Payments",
    querySubtype: "Billing Inquiry",
    status: "pending",
    priority: "medium",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    responseText: "Hello Robert, thank you for bringing this billing discrepancy to our attention. I've reviewed your account and found that there was indeed an error in our billing system. I've processed a full refund of $145.99 which should appear in your account within 3-5 business days. I've also applied a 10% discount to your next bill as an apology for the inconvenience.",
    agentName: "Lisa Rodriguez",
    isEdited: false
  },
  {
    id: "3",
    title: "Course Access Request",
    customerName: "Alex Thompson",
    customerEmail: "alex.t@startup.io",
    customerId: "STU-003",
    customerQuery: "Hi Academic Services,\n\nI'm writing to request access to the Advanced Web Development course (CS-450) for next semester. I understand that this course typically requires completion of Intermediate Programming (CS-350) as a prerequisite.\n\nWhile I haven't taken CS-350 at your institution, I have extensive professional experience in web development and have completed equivalent coursework through online certifications. I'm attaching my portfolio and certificates for your review.\n\nI'm particularly interested in this course because it covers React and Node.js, which are directly relevant to my current internship at a tech startup.\n\nWould it be possible to waive the prerequisite or take a placement exam?\n\nThank you for your consideration,\nAlex Thompson",
    queryType: "Academic Support",
    querySubtype: "Course Enrollment",
    status: "approved",
    priority: "low",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    responseText: "Hi Alex, thank you for your course access request for Advanced Web Development! After reviewing your portfolio and professional experience, I'm pleased to inform you that we can waive the CS-350 prerequisite. Your practical experience clearly demonstrates the necessary skills. I've enrolled you in CS-450 for next semester and you should see it in your course schedule within 24 hours.",
    agentName: "David Park",
    isEdited: false
  },
  {
    id: "4",
    title: "Graduation Requirements Query",
    customerName: "Maria Garcia",
    customerEmail: "maria.garcia@email.com",
    customerId: "STU-004",
    customerQuery: "Dear Academic Advising,\n\nI'm planning to graduate at the end of this academic year and want to make sure I'm on track to meet all requirements for my Business Administration degree.\n\nAccording to my degree audit, I have completed 118 out of 120 required credits. The system shows I still need:\n- 1 upper-level elective (3 credits)\n- Capstone project (3 credits)\n\nHowever, I'm currently enrolled in Strategic Management (BUS-485) which should fulfill the capstone requirement, but it's not showing up in my audit yet.\n\nCould someone please review my transcript and confirm what I still need to complete? I want to make sure I can graduate on time in May.\n\nThank you,\nMaria Garcia\nExpected graduation: May 2024",
    queryType: "Academic Support",
    querySubtype: "Graduation Requirements",
    status: "rejected",
    priority: "medium",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    responseText: "Hi Maria, I've reviewed your degree audit and academic transcript. Unfortunately, there's an issue with your graduation timeline. While BUS-485 does fulfill your capstone requirement, you're still missing a required International Business course (3 credits) that was added to the curriculum in 2022. This course wasn't reflected in your original degree plan but is now mandatory for all Business Administration degrees. I recommend meeting with an academic advisor to discuss your options, which may include summer coursework.",
    agentName: "Emma Wilson",
    isEdited: false
  }
];

const Index = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(sampleTickets);
  const [activeTab, setActiveTab] = useState("all");
  const [queryTypeFilter, setQueryTypeFilter] = useState<string>("all");
  const [querySubtypeFilter, setQuerySubtypeFilter] = useState<string>("all");

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
        ? { ...ticket, responseText: newResponse, isEdited: true }
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

  const queryTypes = ["all", ...Array.from(new Set(tickets.map(t => t.queryType)))];
  const querySubtypes = queryTypeFilter === "all" 
    ? ["all", ...Array.from(new Set(tickets.map(t => t.querySubtype)))]
    : ["all", ...Array.from(new Set(tickets.filter(t => t.queryType === queryTypeFilter).map(t => t.querySubtype)))];

  const filteredTickets = tickets.filter(ticket => {
    let matches = true;
    
    if (activeTab !== "all") {
      matches = matches && ticket.status === activeTab;
    }
    
    if (queryTypeFilter !== "all") {
      matches = matches && ticket.queryType === queryTypeFilter;
    }
    
    if (querySubtypeFilter !== "all") {
      matches = matches && ticket.querySubtype === querySubtypeFilter;
    }
    
    return matches;
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
            <div className="flex gap-3">
              <Select value={queryTypeFilter} onValueChange={(value) => {
                setQueryTypeFilter(value);
                setQuerySubtypeFilter("all");
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by query type" />
                </SelectTrigger>
                <SelectContent>
                  {queryTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Query Types" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={querySubtypeFilter} onValueChange={setQuerySubtypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by subtype" />
                </SelectTrigger>
                <SelectContent>
                  {querySubtypes.map((subtype) => (
                    <SelectItem key={subtype} value={subtype}>
                      {subtype === "all" ? "All Subtypes" : subtype}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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