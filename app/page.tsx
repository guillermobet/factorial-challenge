import AuthForm from "@/components/auth-form";
import { checkAuth } from "./lib/auth";

export default function Home() {
  return (
    <div className="flex flex-col h-4/5">
      <AuthForm onSubmit={checkAuth} />
    </div>
  );
}
