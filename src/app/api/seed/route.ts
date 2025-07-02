import { NextResponse } from "next/server";
import { seedTransactions } from "../../../../actions/seed";

export async function GET(){
    const result =  await seedTransactions();
    return NextResponse.json(result);
}