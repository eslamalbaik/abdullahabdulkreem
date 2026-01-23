import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-secondary/30 pt-20 pb-10 border-t border-border mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <h3 className="text-2xl font-serif font-bold mb-6">ELENA GRID</h3>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Crafting distinct visual identities for brands that dare to be different. 
              Based in Copenhagen, working globally.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif font-semibold mb-4">Sitemap</h4>
            <ul className="space-y-3">
              <li><Link href="/portfolio"><a className="text-muted-foreground hover:text-foreground transition-colors">Portfolio</a></Link></li>
              <li><Link href="/shop"><a className="text-muted-foreground hover:text-foreground transition-colors">Shop</a></Link></li>
              <li><Link href="/courses"><a className="text-muted-foreground hover:text-foreground transition-colors">Courses</a></Link></li>
              <li><Link href="/blog"><a className="text-muted-foreground hover:text-foreground transition-colors">Journal</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Social</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Instagram</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Twitter</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">LinkedIn</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Behance</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Elena Grid. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
