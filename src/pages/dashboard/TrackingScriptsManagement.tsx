import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { adminTrackingScriptsAPI } from "@/lib/api";
import { Plus, Trash2, Edit, Code2, Globe, FileCode, Copy, Info } from "lucide-react";

interface TrackingScript {
  id: string;
  name: string;
  code: string;
  page: string;
  position: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const PAGE_OPTIONS: Record<string, string> = {
  global: "جميع الصفحات",
  home: "الصفحة الرئيسية",
  numbers: "صفحة الأرقام",
  number_detail: "تفاصيل رقم",
  cart: "السلة",
  checkout: "الدفع (Checkout)",
  thank_you: "بعد الطلب (Thank You)",
  blog: "المدونة",
  contact: "اتصل بنا",
  auth: "تسجيل الدخول",
};

const POSITION_OPTIONS: Record<string, string> = {
  head: "داخل <head>",
  body_start: "أول <body>",
  body_end: "آخر <body>",
};

const GTM_TEMPLATES = {
  head: (id: string) => `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');</script>
<!-- End Google Tag Manager -->`,
  body: (id: string) => `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`,
};

export default function TrackingScriptsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScript, setEditingScript] = useState<TrackingScript | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [gtmId, setGtmId] = useState("");

  // Fetch all scripts
  const { data: scripts = [], isLoading } = useQuery<TrackingScript[]>({
    queryKey: ["tracking-scripts"],
    queryFn: adminTrackingScriptsAPI.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: typeof emptyForm) => adminTrackingScriptsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracking-scripts"] });
      toast({ title: "تم إضافة الكود بنجاح" });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof emptyForm }) =>
      adminTrackingScriptsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracking-scripts"] });
      toast({ title: "تم تحديث الكود بنجاح" });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminTrackingScriptsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracking-scripts"] });
      toast({ title: "تم حذف الكود بنجاح" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      adminTrackingScriptsAPI.update(id, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracking-scripts"] });
    },
  });

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingScript(null);
    setForm(emptyForm);
  };

  const openEdit = (script: TrackingScript) => {
    setEditingScript(script);
    setForm({
      name: script.name,
      code: script.code,
      page: script.page,
      position: script.position,
      is_active: script.is_active,
      sort_order: script.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.code.trim()) {
      toast({ title: "الاسم والكود مطلوبين", variant: "destructive" });
      return;
    }
    if (editingScript) {
      updateMutation.mutate({ id: editingScript.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleAddGTM = () => {
    if (!gtmId.trim()) {
      toast({ title: "أدخل GTM ID أولاً", variant: "destructive" });
      return;
    }
    const id = gtmId.trim();

    // Create head script
    createMutation.mutate(
      {
        name: `Google Tag Manager (Head) - ${id}`,
        code: GTM_TEMPLATES.head(id),
        page: "global",
        position: "head",
        is_active: true,
        sort_order: -10,
      },
      {
        onSuccess: () => {
          // Create body_start noscript
          createMutation.mutate({
            name: `Google Tag Manager (Body) - ${id}`,
            code: GTM_TEMPLATES.body(id),
            page: "global",
            position: "body_start",
            is_active: true,
            sort_order: -10,
          });
          setGtmId("");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">أكواد التتبع والتحليلات</h2>
          <p className="text-muted-foreground mt-1">
            أضف أكواد التتبع مثل Google Tag Manager و Facebook Pixel وغيرها — في صفحات ومواضع محددة
          </p>
        </div>
      </div>

      <Tabs defaultValue="gtm" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gtm">Google Tag Manager</TabsTrigger>
          <TabsTrigger value="custom">أكواد مخصصة ({scripts.length})</TabsTrigger>
        </TabsList>

        {/* GTM Tab */}
        <TabsContent value="gtm" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Google Tag Manager (GTM)
              </CardTitle>
              <CardDescription>
                أضف كود GTM مرة واحدة وربط باقي الأكواد (Facebook Pixel, GA4, TikTok, إلخ) من داخل GTM نفسه
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span>
                  الـ GTM ID بيكون بالشكل <code className="font-mono bg-muted px-1 rounded">GTM-XXXXXXX</code> — تلاقيه في حسابك على{" "}
                  <a href="https://tagmanager.google.com" target="_blank" rel="noopener" className="text-blue-500 underline">
                    tagmanager.google.com
                  </a>
                </span>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="gtm-id">GTM Container ID</Label>
                  <Input
                    id="gtm-id"
                    value={gtmId}
                    onChange={(e) => setGtmId(e.target.value.toUpperCase())}
                    placeholder="GTM-XXXXXXX"
                    className="font-mono mt-1"
                    dir="ltr"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleAddGTM}
                    disabled={createMutation.isPending || !gtmId.trim()}
                    className="bg-gradient-primary"
                  >
                    {createMutation.isPending ? "جاري الإضافة..." : "إضافة GTM"}
                  </Button>
                </div>
              </div>

              {/* Show existing GTM scripts */}
              {scripts.filter((s) => s.name.includes("Google Tag Manager")).length > 0 && (
                <div className="border rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-sm">أكواد GTM المضافة:</h4>
                  {scripts
                    .filter((s) => s.name.includes("Google Tag Manager"))
                    .map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={s.is_active}
                            onCheckedChange={(checked) =>
                              toggleMutation.mutate({ id: s.id, is_active: checked })
                            }
                          />
                          <span className="text-sm">{s.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {POSITION_OPTIONS[s.position]}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 h-8 w-8"
                          onClick={() => deleteMutation.mutate(s.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* GTM Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">إزاي تربط باقي الأكواد من GTM؟</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                <span>ادخل على <strong>tagmanager.google.com</strong> واعمل Container جديد</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                <span>اضغط <strong>Tags → New</strong> واختار نوع الـ Tag (مثلاً Facebook Pixel أو GA4)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                <span>في الـ <strong>Trigger</strong> اختار الصفحات المحددة أو "All Pages"</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">4</span>
                <span>اعمل <strong>Publish</strong> — الأكواد هتشتغل أوتوماتيك على الموقع</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Scripts Tab */}
        <TabsContent value="custom" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              أضف أي كود تتبع أو سكريبت مخصص في صفحة معينة ومكان محدد
            </p>
            <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeDialog()}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-primary"
                  onClick={() => {
                    setEditingScript(null);
                    setForm(emptyForm);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة كود
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle>{editingScript ? "تعديل الكود" : "إضافة كود جديد"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="script-name">اسم الكود</Label>
                    <Input
                      id="script-name"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="مثل: Facebook Pixel - Purchase Event"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>الصفحة</Label>
                      <Select value={form.page} onValueChange={(v) => setForm((p) => ({ ...p, page: v }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PAGE_OPTIONS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>الموضع</Label>
                      <Select value={form.position} onValueChange={(v) => setForm((p) => ({ ...p, position: v }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(POSITION_OPTIONS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="script-code">الكود</Label>
                    <Textarea
                      id="script-code"
                      value={form.code}
                      onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                      placeholder={"<script>\n  // الكود بتاعك هنا\n</script>"}
                      className="mt-1 font-mono text-sm min-h-[200px]"
                      dir="ltr"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label htmlFor="sort-order">ترتيب التنفيذ</Label>
                      <Input
                        id="sort-order"
                        type="number"
                        value={form.sort_order}
                        onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                        className="mt-1 w-24"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={form.is_active}
                        onCheckedChange={(checked) => setForm((p) => ({ ...p, is_active: checked }))}
                      />
                      <Label>مفعّل</Label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={closeDialog}>
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="bg-gradient-primary"
                    >
                      {createMutation.isPending || updateMutation.isPending
                        ? "جاري الحفظ..."
                        : editingScript
                        ? "حفظ التعديلات"
                        : "إضافة الكود"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Scripts Table */}
          {isLoading ? (
            <Card className="p-8 text-center text-muted-foreground">جاري التحميل...</Card>
          ) : scripts.filter((s) => !s.name.includes("Google Tag Manager")).length === 0 ? (
            <Card className="p-12 text-center">
              <Code2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">لا توجد أكواد مخصصة</h3>
              <p className="text-muted-foreground mb-4">
                أضف أكواد تتبع مخصصة لصفحات محددة مثل صفحة Checkout أو Thank You
              </p>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">الصفحة</TableHead>
                    <TableHead className="text-right">الموضع</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scripts
                    .filter((s) => !s.name.includes("Google Tag Manager"))
                    .map((script) => (
                      <TableRow key={script.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileCode className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{script.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{PAGE_OPTIONS[script.page] || script.page}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{POSITION_OPTIONS[script.position] || script.position}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={script.is_active}
                            onCheckedChange={(checked) =>
                              toggleMutation.mutate({ id: script.id, is_active: checked })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(script)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                if (confirm("هل أنت متأكد من حذف هذا الكود؟")) {
                                  deleteMutation.mutate(script.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Quick Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">أمثلة على أكواد شائعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickExample
                title="Facebook Pixel - Purchase Event (صفحة Thank You)"
                page="thank_you"
                position="body_end"
                code={`<script>
  fbq('track', 'Purchase', {
    currency: 'EGP',
    value: 0 // القيمة هتتحدد من GTM أو الداتا لاير
  });
</script>`}
                onAdd={(data) => {
                  setForm(data);
                  setIsDialogOpen(true);
                }}
              />
              <QuickExample
                title="Google Ads Conversion (صفحة Checkout)"
                page="checkout"
                position="head"
                code={`<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXX');
</script>`}
                onAdd={(data) => {
                  setForm(data);
                  setIsDialogOpen(true);
                }}
              />
              <QuickExample
                title="Hotjar Tracking (كل الصفحات)"
                page="global"
                position="head"
                code={`<script>
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:XXXXXXX,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>`}
                onAdd={(data) => {
                  setForm(data);
                  setIsDialogOpen(true);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QuickExample({
  title,
  page,
  position,
  code,
  onAdd,
}: {
  title: string;
  page: string;
  position: string;
  code: string;
  onAdd: (data: typeof emptyForm) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        <Code2 className="h-4 w-4 text-muted-foreground" />
        <div>
          <span className="text-sm font-medium">{title}</span>
          <div className="flex gap-1 mt-1">
            <Badge variant="outline" className="text-xs">
              {PAGE_OPTIONS[page]}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {POSITION_OPTIONS[position]}
            </Badge>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onAdd({
            name: title,
            code,
            page,
            position,
            is_active: true,
            sort_order: 0,
          })
        }
      >
        <Copy className="h-3.5 w-3.5 ml-1" />
        استخدم
      </Button>
    </div>
  );
}

const emptyForm = {
  name: "",
  code: "",
  page: "global" as string,
  position: "head" as string,
  is_active: true,
  sort_order: 0,
};
