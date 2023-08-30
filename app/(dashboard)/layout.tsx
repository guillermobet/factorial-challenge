import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { NavBar } from "@/components/nav-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignedIn>
        <div className="flex flex-col items-center gap-8 w-full">
          <div>
            <NavBar />
          </div>
          <div className="flex-1 flex flex-row justify-center w-full">
            {children}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
