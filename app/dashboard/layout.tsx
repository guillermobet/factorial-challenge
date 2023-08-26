import { UserButton } from "@clerk/nextjs";
import NavBar from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <NavBar />
      {children}
    </div>
  );
}
