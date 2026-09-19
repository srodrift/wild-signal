import Link from "next/link";
import { LogoLockup } from "@/components/brand-mark";
import { SoundToggle } from "@/components/sound-toggle";

const links = [
  { href: "/signal", label: "Thread" },
  { href: "/slides", label: "Slides" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-[color:var(--ink)]/90 backdrop-blur-xl">
      <div className="bridge-bar" />
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
        <Link href="/" aria-label="wild signal home">
          <LogoLockup />
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-[color:var(--fog)]/70 hover:text-[color:var(--fog)]"
            >
              {link.label}
            </Link>
          ))}
          <SoundToggle />
        </nav>
      </div>
    </header>
  );
}
