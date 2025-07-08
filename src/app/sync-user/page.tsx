
import { auth, clerkClient} from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import axios from "axios";

const SyncUser = async() => {
    const {userId} = await auth();
    if (!userId) throw new Error("User not found");
    const baseUrl = process.env.NEXT_PUBLIC_URL as string;

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);



     await axios.post(`${baseUrl}/api/create-user`, {clerkUser});


    return redirect('/');
}

export default SyncUser;