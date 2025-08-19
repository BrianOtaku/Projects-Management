import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/utils";

export default async function Page() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/signin");
    }
    redirect("/admin");
}
