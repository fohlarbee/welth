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
import { formatNumberWithCommas, Transaction } from "../[accountId]/page";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

type DateRangeKey = keyof typeof DATE_RANGES;
import { TooltipProps } from "recharts";
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip = ({
  active,
  payload,
  label,
  
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length > 0) {
    return (
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'var(--radius)',
          padding: '0.5rem',
          alignItems:'center',
          justifyItems:'center',
          margin:'10px'
        }}
      >
        <p className="font-semibold text-sm text-muted-foreground mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            style={{
              color: entry.name === 'Credit' ? '#22c55e' : '#dc2626',
              fontWeight: 'bold',
              margin: 0,
            }}
          >
            {entry.name}: {formatNumberWithCommas(Array.isArray(entry.value) ? entry.value[0] : entry.value!)}
          </p>
        ))}
      </div>
    );
  }

  return null;
};



export function AccountChart({ transactions }: {transactions:Transaction[]}) {
  const [dateRange, setDateRange] = useState<DateRangeKey>("7D");

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
      (a, b) => (
        // Parse the date string back to a Date object for sorting
        // const aDate = new Date(`${a.date} ${new Date().getFullYear()}`);
        // const bDate = new Date(`${b.date} ${new Date().getFullYear()}`);
        // return a.getTime() - bDate.getTime();
         new Date(a.date).getTime() - new Date(b.date).getTime()
      )
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
            <p className="text-muted-foreground text-xs md:text-lg">Total Credit</p>
            <p className="md:text-lg text-xs font-bold text-green-500 flex">
              {formatNumberWithCommas(totals.credit.toFixed(2))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-xs md:text-lg">Total debit</p>
            <p className="md:text-lg text-xs font-bold text-red-500 flex">
             { formatNumberWithCommas(totals.debit.toFixed(2))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-xs md:text-lg">Net</p>
            <p
              className={`md:text-lg text-xs font-bold flex ${
                totals.credit - totals.debit >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
               
              {formatNumberWithCommas((totals.credit - totals.debit).toFixed(2))}
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
              tickFormatter={(value) => formatNumberWithCommas(value)}
              />
              <Tooltip
              content={(props) => <CustomTooltip {...props}/>}
              />
              <Legend
               layout="horizontal"
               verticalAlign="top"
               align="right"
               />
              <Bar
              dataKey="credit"
              name="Credit"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            
              />
              <Bar
              dataKey="debit"
              name="Debit"
              fill="#FF6363"
              radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}