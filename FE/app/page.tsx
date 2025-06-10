import { Marathons } from "@/components/marathons";
import { AuthGuard } from "@/components/auth-guard";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <AuthGuard>
      <Navbar />
      <main className="container mx-auto py-10 px-4">
        <Marathons />
      </main>
    </AuthGuard>
  );
}
