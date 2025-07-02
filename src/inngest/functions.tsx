import { clerkClient } from "@clerk/nextjs/server";
import { inngest } from "./client";
import { dbEdge } from "@/lib/db/prisma-edge";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);


export const createNewUser = inngest.createFunction(
  {id:'create-new-user'},
  {event:'user.create'},
  async ({event, step}) => {
    // Get Event Data
    const {userId, email} = event.data;
    await step.run('Check user and send mail', async () => {

      if (!userId || !email) throw new Error("User not found");

      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);


      const user = await dbEdge.user.findUnique({
        where:{
          id:userId
        }
      });
      if (!user){
        await dbEdge.user.create({
          data:{
            id:userId!,
            email:clerkUser.emailAddresses[0]?.emailAddress as string,
            name: clerkUser.fullName as string,
            imageUrl: clerkUser.imageUrl as string
          }
        })
      }
      });
      return "Success";
  }

  // Step to send Welcome email

  // Step to send notification mail 3 days later
);