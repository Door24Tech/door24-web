import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Page Not Found | Door 24 Sobriety App",
  description: "The page you're looking for doesn't exist. Return to Door 24 to keep building your freedom and progress.",
  keywords: "404 page, missing page, Door 24 error",
  authors: [{ name: "Brett Booker" }],
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)]">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[1080px] flex-col items-center justify-start px-4 py-8 pt-20 sm:px-8 sm:py-12 sm:pt-24 lg:px-12">
        <div className="flex w-full flex-col items-center gap-5 text-center sm:gap-6 pt-4 sm:pt-6">
          {/* Astra as focal point */}
          <div className="relative flex flex-col items-center gap-4">
            {/* Astra Image */}
            <div className="relative">
              <Image
                src="/assets/Astra-Dark.svg"
                alt="Astra the owl"
                width={160}
                height={160}
                className="h-auto w-32 object-contain sm:w-40"
                unoptimized
                priority
              />
            </div>
            
            {/* Message */}
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
                Astra wandered off the path.
              </h1>
              <div className="flex flex-col gap-0">
                <p className="mx-auto max-w-2xl text-sm leading-6 text-[var(--door24-muted)] sm:text-base sm:leading-7">
                  Even the wisest guides get curious.
                </p>
                <p className="mx-auto max-w-2xl text-sm leading-6 text-[var(--door24-muted)] sm:text-base sm:leading-7 -mt-4 sm:-mt-5">
                  Don't worry — clarity is right around the corner.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link 
              href="/"
              className="group inline-flex"
            >
              <span className="relative inline-flex overflow-hidden rounded-full border border-[var(--door24-border)] bg-gradient-to-br from-[var(--door24-surface)] to-[var(--door24-surface)] px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-[var(--door24-foreground)] transition-all duration-300 ease-out group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-[#6b46c2] group-hover:to-[#8b5cf6] group-hover:shadow-lg group-hover:shadow-[rgba(107,70,198,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--door24-primary-end)] sm:px-8 sm:py-3 sm:text-base">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                <span className="relative z-10">Guide Me Back</span>
              </span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
