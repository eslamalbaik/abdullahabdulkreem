import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/portfolio", label: "أعمالي" },
    { href: "/shop", label: "المتجر" },
    { href: "/courses", label: "الدورات" },
    { href: "/blog", label: "المدونة" },
    { href: "/contact", label: "تواصل" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="الشعار" className="h-20" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-primary",
                location === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="md:hidden">
          <Link href="/menu" className="text-sm font-medium">
            القائمة
          </Link>
        </div>
      </div>
    </nav>
  );
}
