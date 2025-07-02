"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction } from "../[accountId]/page";
import Image from "next/image";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

type DateRangeKey = keyof typeof DATE_RANGES;

export function AccountChart({ transactions }: {transactions:Transaction[]}) {
  const [dateRange, setDateRange] = useState<DateRangeKey>("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    // Filter transactions within date range
    const filtered = transactions.filter(
      (t) => new Date(t.occurredAt) >= startDate && new Date(t.occurredAt) <= endOfDay(now)
    );

    // Group transactions by date
    const grouped = filtered.reduce((acc: { [date: string]: { date: string; credit: number; debit: number } }, transaction) => {
      const date = format(new Date(transaction.occurredAt), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, credit: 0, debit: 0 };
      }
      if (transaction.type === "credit") {
        acc[date].credit += transaction.amount;
      } else {
        acc[date].debit += transaction.amount;
      }
      return acc;
    }, {} as { [date: string]: { date: string; credit: number; debit: number } });

    // Convert to array and sort by date
    return Object.values(grouped).sort(
      (a, b) => {
        // Parse the date string back to a Date object for sorting
        const aDate = new Date(`${a.date} ${new Date().getFullYear()}`);
        const bDate = new Date(`${b.date} ${new Date().getFullYear()}`);
        return aDate.getTime() - bDate.getTime();
      }
    );
  }, [transactions, dateRange]);

  // Calculate totals for the selected period
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        credit: acc.credit + day.credit,
        debit: acc.debit + day.debit,
      }),
      { credit: 0, debit: 0 }
    );
  }, [filteredData]);

  return (
    <Card className="border-sidebar-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-normal">
          Transaction Overview
        </CardTitle>
        <Select defaultValue={dateRange} onValueChange={(value) => setDateRange(value as DateRangeKey)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-6 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Total Income</p>
            <p className="text-lg font-bold text-green-500 flex">
                 <Image src='/naira.png' width={15} height={5} alt="expense"
              className="bg-green-400
              font-extrabold tracking-tighter pr-0.5 text-transparent bg-clip-text capitalize"/>
              ${totals.credit.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-bold text-red-500 flex">
              <Image src='/naira.png' width={15} height={5} alt="expense"
              className="bg-red-400
        font-extrabold tracking-tighter pr-0.5 text-transparent bg-clip-text capitalize"/>{totals.debit.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Net</p>
            <p
              className={`text-lg font-bold flex ${
                totals.credit - totals.debit >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
                 <Image src='/naira.png' width={15} height={5} alt="expense"
              className="bg-green-500
                     font-extrabold tracking-tighter pr-0.5 text-transparent bg-clip-text capitalize"/>
              {(totals.credit - totals.debit).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => [`$${value}`, undefined]}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}