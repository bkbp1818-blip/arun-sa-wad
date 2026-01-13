"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

interface Withdrawal {
  id: string;
  amount: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
  transferRef: string | null;
  notes: string | null;
  affiliate: {
    id: string;
    bankName: string | null;
    bankAccount: string | null;
    bankAccountName: string | null;
    user: {
      name: string | null;
      email: string | null;
    };
  };
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

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // Dialog state
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(null);
  const [transferRef, setTransferRef] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  async function fetchWithdrawals() {
    try {
      const res = await fetch("/api/admin/withdrawals");
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data);
      }
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction() {
    if (!selectedWithdrawal || !dialogAction) return;

    setProcessing(selectedWithdrawal.id);

    try {
      const res = await fetch(`/api/admin/withdrawals/${selectedWithdrawal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: dialogAction,
          transferRef: dialogAction === "approve" ? transferRef : undefined,
          notes,
        }),
      });

      if (res.ok) {
        fetchWithdrawals();
        closeDialog();
      } else {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      console.error("Failed to process withdrawal:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setProcessing(null);
    }
  }

  function openDialog(withdrawal: Withdrawal, action: "approve" | "reject") {
    setSelectedWithdrawal(withdrawal);
    setDialogAction(action);
    setTransferRef("");
    setNotes("");
  }

  function closeDialog() {
    setSelectedWithdrawal(null);
    setDialogAction(null);
    setTransferRef("");
    setNotes("");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingWithdrawals = withdrawals.filter((w) => w.status === "PENDING");
  const processedWithdrawals = withdrawals.filter((w) => w.status !== "PENDING");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">จัดการการถอนเงิน</h1>
        <p className="text-muted-foreground">อนุมัติหรือปฏิเสธคำขอถอนเงินจากตัวแทน</p>
      </div>

      {/* Pending Withdrawals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            รอดำเนินการ ({pendingWithdrawals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingWithdrawals.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              ไม่มีคำขอถอนเงินที่รอดำเนินการ
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">ตัวแทน</th>
                    <th className="text-left p-4 font-medium">บัญชีธนาคาร</th>
                    <th className="text-left p-4 font-medium">จำนวน</th>
                    <th className="text-left p-4 font-medium">วันที่แจ้ง</th>
                    <th className="text-left p-4 font-medium">ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="border-t">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">
                            {withdrawal.affiliate.user.name || "ไม่ระบุชื่อ"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {withdrawal.affiliate.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p>{withdrawal.affiliate.bankName}</p>
                          <p className="font-mono">{withdrawal.affiliate.bankAccount}</p>
                          <p className="text-muted-foreground">
                            {withdrawal.affiliate.bankAccountName}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-lg">
                        {Number(withdrawal.amount).toLocaleString()} ฿
                      </td>
                      <td className="p-4 text-sm">
                        {new Date(withdrawal.createdAt).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => openDialog(withdrawal, "approve")}
                            disabled={processing === withdrawal.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            อนุมัติ
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openDialog(withdrawal, "reject")}
                            disabled={processing === withdrawal.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            ปฏิเสธ
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Withdrawals */}
      <Card>
        <CardHeader>
          <CardTitle>ประวัติการดำเนินการ</CardTitle>
        </CardHeader>
        <CardContent>
          {processedWithdrawals.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              ยังไม่มีประวัติ
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">ตัวแทน</th>
                    <th className="text-left p-4 font-medium">จำนวน</th>
                    <th className="text-left p-4 font-medium">สถานะ</th>
                    <th className="text-left p-4 font-medium">เลขอ้างอิง</th>
                    <th className="text-left p-4 font-medium">วันที่ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {processedWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="border-t">
                      <td className="p-4">
                        <p className="font-medium">
                          {withdrawal.affiliate.user.name || withdrawal.affiliate.user.email}
                        </p>
                      </td>
                      <td className="p-4 font-medium">
                        {Number(withdrawal.amount).toLocaleString()} ฿
                      </td>
                      <td className="p-4">
                        <Badge variant={statusColors[withdrawal.status]}>
                          {statusLabels[withdrawal.status]}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm font-mono">
                        {withdrawal.transferRef || "-"}
                      </td>
                      <td className="p-4 text-sm">
                        {withdrawal.processedAt
                          ? new Date(withdrawal.processedAt).toLocaleDateString("th-TH", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedWithdrawal} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "approve" ? "อนุมัติการถอนเงิน" : "ปฏิเสธการถอนเงิน"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "approve"
                ? "ยืนยันการโอนเงินให้ตัวแทน"
                : "ปฏิเสธคำขอถอนเงินของตัวแทน"}
            </DialogDescription>
          </DialogHeader>

          {selectedWithdrawal && (
            <div className="space-y-4 py-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">จำนวนเงิน</p>
                <p className="text-2xl font-bold">
                  {Number(selectedWithdrawal.amount).toLocaleString()} ฿
                </p>
              </div>

              {dialogAction === "approve" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    เลขอ้างอิงการโอน
                  </label>
                  <Input
                    value={transferRef}
                    onChange={(e) => setTransferRef(e.target.value)}
                    placeholder="เช่น REF123456789"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  หมายเหตุ (ถ้ามี)
                </label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="หมายเหตุเพิ่มเติม"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              ยกเลิก
            </Button>
            <Button
              variant={dialogAction === "approve" ? "default" : "destructive"}
              onClick={handleAction}
              disabled={processing !== null}
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  กำลังดำเนินการ...
                </>
              ) : dialogAction === "approve" ? (
                "ยืนยันอนุมัติ"
              ) : (
                "ยืนยันปฏิเสธ"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
