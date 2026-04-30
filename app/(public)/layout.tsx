import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top classification stripe */}
      <div className="h-0.5 w-full bg-accent-red" />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
