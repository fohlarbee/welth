import { inngest } from "@/inngest/client";
// import { auth, clerkClient } from "@clerk/nextjs/server";
// import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const {clerkUser} = await req.json();


    if(!clerkUser) 
        return new Response("User data is required", { status: 400 });
    
    const result = await inngest.send({
        name:"user.create",
        data: {
                userId: clerkUser.id,
                email: clerkUser.emailAddresses[0]?.emailAddress as string,
        },
    });


    return NextResponse.json({result: result}, {status: 200});
}