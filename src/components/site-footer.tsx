import Link from "next/link";
import { LogoLockup } from "@/components/brand-mark";

const links = [
  { href: "/signal", label: "Signal" },
  { href: "/slides", label: "Slides" },
  { href: "/text", label: "Text" },
  { href: "/map", label: "Map" },
  { href: "/evidence", label: "Sources" },
  { href: "/how", label: "How" },
  { href: "/pitch", label: "Pitch" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--rule)] bg-[color:var(--ink)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <LogoLockup markSize={28} />
          <p className="text-xs text-[color:var(--fog)]/50">
            Built in the City for Hack for Humanity · Gemini + Photon. The
            live demo is the thread, not a text from the seats.
          </p>
        </div>
        <div className="space-y-2 text-xs text-[color:var(--fog)]/50">
          <nav className="flex flex-wrap gap-x-3 gap-y-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-[color:var(--fog)]">
                {link.label}
              </Link>
            ))}
          </nav>
          <p>
            Not an emergency service. If a person is in danger, call{" "}
            <span className="text-[color:var(--fog)]">911</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
