'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface AdminNavBarProps {
  backHref?: string;
  backLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AdminNavBar({ backHref, backLabel, breadcrumbs }: AdminNavBarProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (breadcrumbs) return breadcrumbs;
    
    if (!pathname) return [{ label: 'Admin Dashboard', href: '/admin' }];
    
    const segments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];
    
    // Always start with Admin Dashboard
    items.push({ label: 'Admin Dashboard', href: '/admin' });
    
    // If we're on the main dashboard, just return that
    if (segments.length <= 1 || (segments.length === 1 && segments[0] === 'admin')) {
      return items;
    }
    
    // Map known segments to labels
    const segmentLabels: Record<string, string> = {
      'content': 'Content Tools',
      'social': 'Social Media Hub',
      'waitlist': 'Waitlist',
      'email': 'Email Marketing',
      'blog': 'Blog Admin',
      'thirst-trap-factory': 'Thirst Trap Factory',
      'the-laundromat': 'The Laundromat',
      'motivational-porn': 'Motivational Porn',
      'storyboard-studio': 'Storyboard Studio',
      'hook-generator': 'Hook Generator',
      'caption-studio': 'Caption Studio',
      'drafts': 'Drafts',
    };
    
    let currentPath = '';
    segments.forEach((segment, index) => {
      if (segment === 'admin') return; // Skip 'admin' segment
      
      currentPath += `/${segment}`;
      const label = segmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      // Include all segments in breadcrumbs (including current page)
      items.push({ label, href: currentPath });
    });
    
    return items;
  };

  const autoBreadcrumbs = generateBreadcrumbs();

  return (
    <div className="fixed top-[64px] left-0 right-0 z-10 border-b border-[var(--door24-border)] bg-[var(--door24-surface)]/30 backdrop-blur-sm">
      <div className="mx-auto max-w-[1080px] px-4 py-3 sm:px-8 sm:py-3.5">
        <div className="flex items-center gap-6">
          {/* Back Button */}
          {backHref && (
            <Link
              href={backHref}
              className="group inline-flex items-center gap-2 rounded-lg bg-[var(--door24-surface)] border border-[var(--door24-border)] px-4 py-2 transition-all duration-200 hover:bg-[var(--door24-surface-hover)] hover:border-[var(--door24-primary-end)] text-[var(--door24-muted)] hover:text-[var(--door24-foreground)]"
              aria-label="Go back"
            >
              <svg 
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </Link>
          )}

          {/* Breadcrumbs - Always show */}
          <div className="flex items-center gap-2 text-sm text-[var(--door24-muted)]">
            {autoBreadcrumbs.map((item, index) => (
              <div key={item.href} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-[var(--door24-muted)]/50">/</span>
                )}
                {index === autoBreadcrumbs.length - 1 ? (
                  <span className="text-[var(--door24-foreground)] font-medium">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors duration-200 hover:text-[var(--door24-foreground)]"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

