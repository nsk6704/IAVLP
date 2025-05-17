import { cn } from "@/lib/utils";

// Background component with animated gradients
const BackgroundGradient = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 to-black" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-20" />
    </div>
  );
};

export default function TheoryOfComputationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen">
      <BackgroundGradient />
      {children}
    </section>
  );
}
