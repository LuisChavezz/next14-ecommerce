import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";

export default async function ProfilePage() {

  const session = await auth()

  if (!session) {
    redirect('/')
  }

  return (
    <div>
      <Title title="Profile" />

      <pre>
        {JSON.stringify(session.user, null, 2)}
      </pre>

      <h4 className="text-3xl mb-10">{ session.user.role }</h4>
    </div>
  );
}