import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingBag,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  DollarSign,
  Phone,
  User,
  Ticket,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { useAllOrders, useAdminUpdateOrder } from "@/hooks/useOrders";
import { formatPrice } from "@/lib/helpers";
import Loading from "@/components/Loading";
import { useState } from "react";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "معلق", color: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30", icon: Clock },
  processing: { label: "قيد التنفيذ", color: "bg-blue-500/15 text-blue-600 border-blue-500/30", icon: Truck },
  completed: { label: "مكتمل", color: "bg-green-500/15 text-green-600 border-green-500/30", icon: CheckCircle },
  cancelled: { label: "ملغي", color: "bg-red-500/15 text-red-600 border-red-500/30", icon: XCircle },
};

const paymentLabels: Record<string, string> = {
  cash: "كاش",
  bank_transfer: "تحويل بنكي",
  vodafone_cash: "فودافون كاش",
  instapay: "إنستاباي",
};

const OrdersManagement = () => {
  const { data: orders, isLoading, isError } = useAllOrders();
  const updateOrder = useAdminUpdateOrder();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-bold">خطأ في تحميل الطلبات</h2>
      </div>
    );
  }

  const orderList = Array.isArray(orders) ? orders : orders?.data || [];

  const filtered = orderList.filter((order: any) => {
    const matchesSearch =
      !search ||
      order.id?.toLowerCase().includes(search.toLowerCase()) ||
      order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_phone?.includes(search) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesPayment = filterPayment === "all" || order.payment_method === filterPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const stats = {
    total: orderList.length,
    pending: orderList.filter((o: any) => o.status === "pending").length,
    completed: orderList.filter((o: any) => o.status === "completed").length,
    revenue: orderList
      .filter((o: any) => o.status === "completed")
      .reduce((sum: number, o: any) => sum + (parseFloat(o.total_price) || 0), 0),
  };

  const handleStatusChange = (orderId: string, status: string) => {
    updateOrder.mutate({ id: orderId, data: { status } });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الطلبات", value: stats.total, icon: ShoppingBag, color: "text-primary" },
          { label: "معلقة", value: stats.pending, icon: Clock, color: "text-yellow-500" },
          { label: "مكتملة", value: stats.completed, icon: CheckCircle, color: "text-green-500" },
          { label: "الإيرادات", value: formatPrice(stats.revenue), icon: DollarSign, color: "text-primary" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted/60`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو البريد أو رقم الطلب..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="processing">قيد التنفيذ</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الطرق</SelectItem>
                <SelectItem value="cash">كاش</SelectItem>
                <SelectItem value="vodafone_cash">فودافون كاش</SelectItem>
                <SelectItem value="instapay">إنستاباي</SelectItem>
                <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الطلب</TableHead>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">الدفع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right w-28">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    لا توجد طلبات
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order: any) => {
                  const sc = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = sc.icon;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        #{order.order_number || order.id?.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{order.user?.name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-sm">{formatPrice(order.total_price)}</p>
                          {order.discount_amount > 0 && (
                            <p className="text-xs text-green-500">خصم: {formatPrice(order.discount_amount)}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {paymentLabels[order.payment_method] || order.payment_method || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${sc.color} gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString("ar-EG", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select
                            value={order.status}
                            onValueChange={(v) => handleStatusChange(order.id, v)}
                          >
                            <SelectTrigger className="h-8 w-24 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">معلق</SelectItem>
                              <SelectItem value="processing">قيد التنفيذ</SelectItem>
                              <SelectItem value="completed">مكتمل</SelectItem>
                              <SelectItem value="cancelled">ملغي</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              تفاصيل الطلب
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              {/* Order info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">رقم الطلب</p>
                  <p className="font-mono text-sm font-bold">#{selectedOrder.order_number || selectedOrder.id?.slice(0, 8)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">التاريخ</p>
                  <p className="text-xs">
                    {selectedOrder.created_at
                      ? new Date(selectedOrder.created_at).toLocaleDateString("ar-EG", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Status change */}
              <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">تغيير الحالة</p>
                <div className="flex flex-wrap gap-2">
                  {(["pending", "processing", "completed", "cancelled"] as const).map((s) => {
                    const sc = statusConfig[s];
                    const isActive = selectedOrder.status === s;
                    return (
                      <Button
                        key={s}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={`text-xs h-8 ${isActive ? "" : ""}`}
                        disabled={isActive || updateOrder.isPending}
                        onClick={() => {
                          handleStatusChange(selectedOrder.id, s);
                          setSelectedOrder({ ...selectedOrder, status: s });
                        }}
                      >
                        <sc.icon className="w-3 h-3 ml-1" />
                        {sc.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Customer (account info) */}
              <div className="p-3 rounded-lg bg-muted/40 space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{selectedOrder.user?.name || "—"}</span>
                </div>
                <p className="text-xs text-muted-foreground mr-6">{selectedOrder.user?.email}</p>
                {selectedOrder.user?.phone && (
                  <p className="text-xs text-muted-foreground mr-6">{selectedOrder.user?.phone}</p>
                )}
              </div>

              {/* Customer Details (checkout info) */}
              {(selectedOrder.customer_name || selectedOrder.customer_phone) && (
                <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 space-y-1.5">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">بيانات التواصل</p>
                  {selectedOrder.customer_name && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">الاسم</span>
                      <span className="font-medium">{selectedOrder.customer_name}</span>
                    </div>
                  )}
                  {selectedOrder.customer_phone && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">الموبايل</span>
                      <span className="font-mono font-medium" dir="ltr">{selectedOrder.customer_phone}</span>
                    </div>
                  )}
                  {selectedOrder.customer_whatsapp && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">واتساب</span>
                      <span className="font-mono font-medium" dir="ltr">{selectedOrder.customer_whatsapp}</span>
                    </div>
                  )}
                  {selectedOrder.customer_city && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">المدينة</span>
                      <span className="font-medium">{selectedOrder.customer_city}</span>
                    </div>
                  )}
                  {selectedOrder.customer_address && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">العنوان</span>
                      <span className="font-medium">{selectedOrder.customer_address}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-sm font-semibold mb-2">العناصر</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium direction-ltr" dir="ltr">
                          {item.phone_number || item.phone_number_details?.number || "—"}
                        </span>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Coupon */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    <span>طريقة الدفع</span>
                  </div>
                  <span>{paymentLabels[selectedOrder.payment_method] || selectedOrder.payment_method || "—"}</span>
                </div>
                {selectedOrder.coupon_code && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Ticket className="w-4 h-4" />
                      <span>كوبون</span>
                    </div>
                    <Badge variant="secondary">{selectedOrder.coupon_code}</Badge>
                  </div>
                )}
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الخصم</span>
                    <span className="text-green-500">- {formatPrice(selectedOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="font-semibold">الإجمالي</span>
                  <span className="font-bold text-primary text-base">{formatPrice(selectedOrder.total_price)}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">ملاحظات</p>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Payment Proof */}
              {selectedOrder.payment_proof && (
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">إثبات الدفع</p>
                  <a
                    href={selectedOrder.payment_proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={selectedOrder.payment_proof}
                      alt="إثبات الدفع"
                      className="w-full max-h-48 object-contain rounded-lg border border-border cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;
