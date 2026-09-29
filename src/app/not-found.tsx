import Link from "next/link";
import { button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-5 text-center text-white">
      <p className="font-display text-7xl font-bold text-sun">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-white/70">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className={button({ className: "mt-8" })}>
        Back home
      </Link>
    </main>
  );
}
