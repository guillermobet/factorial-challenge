import { NavBar } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div>
        <NavBar />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
