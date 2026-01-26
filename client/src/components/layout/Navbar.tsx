import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, ShoppingCart, LogIn, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/portfolio", label: "أعمالي" },
    { href: "/identities", label: "هويات بصرية" },
    { href: "/shop", label: "المتجر" },
    { href: "/courses", label: "الدورات" },
    { href: "/contact", label: "تواصل" },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
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
            
            <Link
              href="/cart"
              className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {isLoading ? (
              <div className="w-16 h-8 bg-secondary/50 animate-pulse rounded" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.profileImageUrl && (
                  <img 
                    src={user.profileImageUrl} 
                    alt="صورة المستخدم" 
                    className="w-8 h-8 rounded-full object-cover"
                    data-testid="img-profile"
                  />
                )}
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </button>
              </div>
            ) : (
              <a href="/api/login" data-testid="link-login">
                <Button variant="outline" size="sm">
                  <LogIn className="w-4 h-4 me-2" />
                  دخول
                </Button>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/cart"
              className="relative p-2 text-foreground"
              data-testid="link-cart-mobile"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="فتح القائمة"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background pt-20 md:hidden"
          >
            <div className="container mx-auto px-6 py-8">
              <div className="flex flex-col gap-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "text-2xl font-medium py-3 border-b border-border transition-colors",
                      location === link.href
                        ? "text-primary"
                        : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                {isLoading ? (
                  <div className="py-3 border-b border-border">
                    <div className="h-10 bg-secondary/50 animate-pulse rounded" />
                  </div>
                ) : isAuthenticated ? (
                  <div className="flex items-center gap-4 py-3 border-b border-border">
                    {user?.profileImageUrl && (
                      <img 
                        src={user.profileImageUrl} 
                        alt="صورة المستخدم" 
                        className="w-10 h-10 rounded-full object-cover"
                        data-testid="img-profile-mobile"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium" data-testid="text-username-mobile">{user?.firstName || 'مستخدم'}</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-email-mobile">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { logout(); handleLinkClick(); }}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                      data-testid="button-logout-mobile"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <a 
                    href="/api/login" 
                    onClick={handleLinkClick}
                    className="text-2xl font-medium py-3 border-b border-border text-primary flex items-center gap-3"
                    data-testid="link-login-mobile"
                  >
                    <LogIn className="w-6 h-6" />
                    تسجيل الدخول
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
