import { SignIn, auth } from "@clerk/nextjs";
// import type { User } from "@clerk/nextjs/api";

export default function Page() {
  const { userId }: { userId: string | null } = auth();
  // const user: User | null = await currentUser();
  return (
    <div className="flex flex-col justify-center items-center">
      <SignIn />
    </div>
  );
}
