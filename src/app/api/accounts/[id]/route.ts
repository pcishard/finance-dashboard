import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const existing = await prisma.account.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { name, category, balance, currency, notes } = await req.json();

    const account = await prisma.account.update({
      where: { id },
      data: { name, category, balance, currency, notes },
    });

    if (balance !== undefined && balance !== existing.balance) {
      await prisma.balanceHistory.create({
        data: { balance, accountId: id },
      });
    }

    return NextResponse.json(account);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.account.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.account.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
