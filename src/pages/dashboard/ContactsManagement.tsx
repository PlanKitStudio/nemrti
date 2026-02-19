import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trash2, Eye, Mail, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAllContacts, useUpdateContact, useDeleteContact } from "@/hooks/useContacts";
import Loading from "@/components/Loading";
import StatCard from "@/components/dashboard/StatCard";

export default function ContactsManagement() {
  const { data: contactsData, isLoading } = useAllContacts();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<any | null>(null);

  if (isLoading) {
    return <Loading />;
  }

  const contacts = Array.isArray(contactsData) ? contactsData : contactsData?.data || [];

  const filteredContacts = contacts.filter((contact: any) => {
    const matchesSearch = 
      (contact.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "read": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "replied": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "new": return "جديد";
      case "read": return "مقروء";
      case "replied": return "تم الرد";
      case "archived": return "مؤرشف";
      default: return "جديد";
    }
  };

  const handleStatusChange = async (contactId: string, status: string) => {
    await updateContact.mutateAsync({ id: contactId, data: status });
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    await deleteContact.mutateAsync(contactId);
  };

  const handleViewContact = (contact: any) => {
    setSelectedContact(contact);
    // Mark as read if new
    if (contact.status === "new") {
      handleStatusChange(contact.id, "read");
    }
  };

  const totalContacts = contacts.length;
  const newContacts = contacts.filter((c: any) => c.status === "new" || !c.status).length;
  const readContacts = contacts.filter((c: any) => c.status === "read").length;
  const repliedContacts = contacts.filter((c: any) => c.status === "replied").length;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">رسائل التواصل</h1>
          <p className="text-muted-foreground">إدارة رسائل العملاء الواردة من صفحة اتصل بنا</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="إجمالي الرسائل" value={totalContacts} icon={MessageSquare} />
        <StatCard title="رسائل جديدة" value={newContacts} icon={AlertCircle} />
        <StatCard title="مقروءة" value={readContacts} icon={Eye} />
        <StatCard title="تم الرد" value={repliedContacts} icon={CheckCircle} />
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في الرسائل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="new">جديد</SelectItem>
            <SelectItem value="read">مقروء</SelectItem>
            <SelectItem value="replied">تم الرد</SelectItem>
            <SelectItem value="archived">مؤرشف</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>الرسائل الواردة</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredContacts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الموضوع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact: any) => (
                  <TableRow 
                    key={contact.id} 
                    className={`cursor-pointer ${contact.status === 'new' || !contact.status ? 'font-semibold bg-primary/5' : ''}`}
                    onClick={() => handleViewContact(contact)}
                  >
                    <TableCell>
                      <span className="font-medium">{contact.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{contact.email}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm line-clamp-1">{contact.subject || 'بدون موضوع'}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contact.status || 'new')}>
                        {getStatusText(contact.status || 'new')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(contact.created_at).toLocaleDateString('ar-EG')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewContact(contact)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(contact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">لا توجد رسائل</h3>
              <p className="text-muted-foreground">لم يتم استقبال أي رسائل بعد</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>تفاصيل الرسالة</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">الاسم</Label>
                  <p className="font-medium">{selectedContact.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">البريد الإلكتروني</Label>
                  <p className="font-medium">{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <Label className="text-muted-foreground text-sm">رقم الهاتف</Label>
                    <p className="font-medium">{selectedContact.phone}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground text-sm">التاريخ</Label>
                  <p className="font-medium">
                    {new Date(selectedContact.created_at).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {selectedContact.subject && (
                <div>
                  <Label className="text-muted-foreground text-sm">الموضوع</Label>
                  <p className="font-medium">{selectedContact.subject}</p>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground text-sm">الرسالة</Label>
                <div className="mt-2 p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">
                  {selectedContact.message}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Label className="text-muted-foreground text-sm">تغيير الحالة:</Label>
                <Select 
                  value={selectedContact.status || 'new'} 
                  onValueChange={(value) => {
                    handleStatusChange(selectedContact.id, value);
                    setSelectedContact({ ...selectedContact, status: value });
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">جديد</SelectItem>
                    <SelectItem value="read">مقروء</SelectItem>
                    <SelectItem value="replied">تم الرد</SelectItem>
                    <SelectItem value="archived">مؤرشف</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    window.open(`mailto:${selectedContact.email}?subject=رد: ${selectedContact.subject || 'رسالة تواصل'}`);
                    handleStatusChange(selectedContact.id, 'replied');
                    setSelectedContact({ ...selectedContact, status: 'replied' });
                  }}
                >
                  <Mail className="h-4 w-4 ml-2" />
                  الرد بالبريد
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedContact.id);
                    setSelectedContact(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
