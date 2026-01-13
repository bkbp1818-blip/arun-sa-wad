"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Wallet, CreditCard, AlertCircle } from "lucide-react";

interface Withdrawal {
  id: string;
  amount: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
  transferRef: string | null;
}

interface Affiliate {
  id: string;
  pendingBalance: string;
  paidBalance: string;
  bankName: string | null;
  bankAccount: string | null;
  bankAccountName: string | null;
  withdrawals: Withdrawal[];
}

const statusLabels: Record<string, string> = {
  PENDING: "รอดำเนินการ",
  APPROVED: "อนุมัติแล้ว",
  COMPLETED: "โอนแล้ว",
  REJECTED: "ปฏิเสธ",
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  APPROVED: "default",
  COMPLETED: "outline",
  REJECTED: "destructive",
};

export default function AgentWithdrawPage() {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Bank info state
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [savingBank, setSavingBank] = useState(false);

  useEffect(() => {
    fetchAffiliate();
  }, []);

  async function fetchAffiliate() {
    try {
      const res = await fetch("/api/agent/me");
      if (res.ok) {
        const data = await res.json();
        setAffiliate(data);
        setBankName(data?.bankName || "");
        setBankAccount(data?.bankAccount || "");
        setBankAccountName(data?.bankAccountName || "");
      }
    } catch (error) {
      console.error("Failed to fetch affiliate:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveBankInfo(e: React.FormEvent) {
    e.preventDefault();
    setSavingBank(true);

    try {
      const res = await fetch("/api/agent/bank", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankName, bankAccount, bankAccountName }),
      });

      if (res.ok) {
        const data = await res.json();
        setAffiliate((prev) => (prev ? { ...prev, ...data } : null));
        alert("บันทึกข้อมูลธนาคารเรียบร้อย");
      } else {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      console.error("Error saving bank info:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSavingBank(false);
    }
  }

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();

    if (!affiliate?.bankAccount) {
      alert("กรุณากรอกข้อมูลธนาคารก่อน");
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || amount > Number(affiliate.pendingBalance)) {
      alert("จำนวนเงินไม่ถูกต้อง");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/agent/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (res.ok) {
        setWithdrawAmount("");
        fetchAffiliate();
        alert("แจ้งถอนเงินเรียบร้อย");
      } else {
        const data = await res.json();
        alert(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      console.error("Error withdrawing:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">ไม่พบข้อมูลตัวแทน</p>
      </div>
    );
  }

  const pendingBalance = Number(affiliate.pendingBalance);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ถอนเงิน</h1>
        <p className="text-muted-foreground">แจ้งถอนค่าคอมมิชชั่นเข้าบัญชีธนาคาร</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-80">ยอดเงินรอถอน</p>
              <p className="text-3xl font-bold">
                {pendingBalance.toLocaleString()} ฿
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bank Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              ข้อมูลบัญชีธนาคาร
            </CardTitle>
            <CardDescription>กรอกข้อมูลบัญชีสำหรับรับเงิน</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveBankInfo} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">ธนาคาร</label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="เช่น กสิกรไทย, กรุงเทพ, ไทยพาณิชย์"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">เลขบัญชี</label>
                <Input
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="XXX-X-XXXXX-X"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">ชื่อบัญชี</label>
                <Input
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  placeholder="ชื่อ-นามสกุล"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={savingBank}>
                {savingBank ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  "บันทึกข้อมูลธนาคาร"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Withdraw Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              แจ้งถอนเงิน
            </CardTitle>
            <CardDescription>ระบุจำนวนเงินที่ต้องการถอน</CardDescription>
          </CardHeader>
          <CardContent>
            {!affiliate.bankAccount ? (
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  กรุณากรอกข้อมูลบัญชีธนาคารก่อนแจ้งถอนเงิน
                </p>
              </div>
            ) : pendingBalance < 100 ? (
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  ยอดขั้นต่ำในการถอนคือ 100 บาท
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    จำนวนเงิน (฿)
                  </label>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0"
                    min={100}
                    max={pendingBalance}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ถอนได้สูงสุด {pendingBalance.toLocaleString()} ฿
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting || pendingBalance < 100}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      กำลังดำเนินการ...
                    </>
                  ) : (
                    "แจ้งถอนเงิน"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle>ประวัติการถอน</CardTitle>
        </CardHeader>
        <CardContent>
          {affiliate.withdrawals?.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              ยังไม่มีประวัติการถอน
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">วันที่</th>
                    <th className="text-left p-4 font-medium">จำนวน</th>
                    <th className="text-left p-4 font-medium">สถานะ</th>
                    <th className="text-left p-4 font-medium">เลขอ้างอิง</th>
                  </tr>
                </thead>
                <tbody>
                  {affiliate.withdrawals?.map((withdrawal) => (
                    <tr key={withdrawal.id} className="border-t">
                      <td className="p-4 text-sm">
                        {new Date(withdrawal.createdAt).toLocaleDateString("th-TH")}
                      </td>
                      <td className="p-4 font-medium">
                        {Number(withdrawal.amount).toLocaleString()} ฿
                      </td>
                      <td className="p-4">
                        <Badge variant={statusColors[withdrawal.status]}>
                          {statusLabels[withdrawal.status]}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {withdrawal.transferRef || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
