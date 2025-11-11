import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Blog — Door 24",
  description: "Read the latest articles and insights from Door 24.",
};

export default function Blog() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto max-w-[1080px] px-4 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">Blog</h1>
            <p className="mt-4 text-base leading-7 text-[var(--door24-muted)] sm:text-lg sm:leading-8">
              Insights, updates, and stories from Door 24.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur text-center">
            <p className="text-[var(--door24-muted)]">
              Blog posts coming soon. Check back later for articles and updates.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

