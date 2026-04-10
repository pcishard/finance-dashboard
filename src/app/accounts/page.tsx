"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { Input, Select, Textarea } from "@/components/input";
import { Modal } from "@/components/modal";
import { formatCurrency } from "@/lib/utils";
import { Plus, Pencil, Trash2, Wallet, PiggyBank, TrendingUp, CreditCard, DollarSign } from "lucide-react";

interface Account {
  id: string;
  name: string;
  category: string;
  balance: number;
  currency: string;
  notes: string | null;
}

const categories = [
  { value: "bank", label: "Bank Account" },
  { value: "savings", label: "Savings" },
  { value: "brokerage", label: "Brokerage" },
  { value: "crypto", label: "Crypto" },
  { value: "credit_card", label: "Credit Card" },
  { value: "loan", label: "Loan" },
  { value: "other", label: "Other" },
];

const emptyForm = { name: "", category: "bank", balance: 0, currency: "GBP", notes: "" };

export default function AccountsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchAccounts = useCallback(() => {
    fetch("/api/accounts")
      .then((r) => r.json())
      .then(setAccounts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") fetchAccounts();
  }, [status, router, fetchAccounts]);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (a: Account) => {
    setEditId(a.id);
    setForm({ name: a.name, category: a.category, balance: a.balance, currency: a.currency, notes: a.notes || "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editId ? `/api/accounts/${editId}` : "/api/accounts";
    const method = editId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, balance: Number(form.balance) }),
    });
    setSaving(false);
    setModalOpen(false);
    fetchAccounts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this account?")) return;
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    fetchAccounts();
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    bank: <Wallet className="h-5 w-5" />,
    savings: <PiggyBank className="h-5 w-5" />,
    brokerage: <TrendingUp className="h-5 w-5" />,
    crypto: <DollarSign className="h-5 w-5" />,
    credit_card: <CreditCard className="h-5 w-5" />,
    loan: <CreditCard className="h-5 w-5" />,
  };

  if (status === "loading" || loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="text-slate-500">Loading...</div></div>;
  }

  const grouped = categories.map((cat) => ({
    ...cat,
    accounts: accounts.filter((a) => a.category === cat.value),
    total: accounts.filter((a) => a.category === cat.value).reduce((sum, a) => sum + a.balance, 0),
  })).filter((g) => g.accounts.length > 0);

  return (
    <div className="p-4 pt-16 md:p-8 md:pt-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
          <p className="text-sm text-slate-500">Manage your financial accounts</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card className="border-dashed text-center">
          <Wallet className="mx-auto mb-2 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-700">No accounts yet</p>
          <p className="mb-4 text-xs text-slate-400">Add your bank accounts, savings, and credit cards</p>
          <Button onClick={openCreate} variant="secondary">
            <Plus className="h-4 w-4" /> Add Your First Account
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.value}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </h2>
                <span className="text-sm font-medium text-slate-700">
                  {formatCurrency(group.total)}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.accounts.map((account) => (
                  <Card key={account.id} className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        {categoryIcons[account.category] || <Wallet className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{account.name}</p>
                        <p className={`text-lg font-bold ${account.balance >= 0 ? "text-slate-900" : "text-red-500"}`}>
                          {formatCurrency(account.balance)}
                        </p>
                        {account.notes && (
                          <p className="mt-1 text-xs text-slate-400">{account.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(account)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(account.id)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? "Edit Account" : "Add Account"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Account Name"
            placeholder="e.g. Barclays Current"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
          <Input
            label="Balance"
            type="number"
            step="0.01"
            value={form.balance}
            onChange={(e) => setForm({ ...form, balance: parseFloat(e.target.value) || 0 })}
          />
          <Select
            label="Currency"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          >
            <option value="GBP">GBP (£)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </Select>
          <Textarea
            label="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Saving..." : editId ? "Update" : "Add Account"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
