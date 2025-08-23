import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/utils";

export default async function DefaultPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/signin");
    }

    if (user.role === "LEADER") {
        redirect("/admin/assigned-projects")
    }

    if (user.role === "STAFF") {
        redirect("/admin/assigned-tasks")
    }

    if (user.role === "MANAGER") {
        redirect("/admin")
    }
}
