import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-9xl font-serif mb-4">404</h1>
      <p className="text-2xl text-muted-foreground mb-8">Page not found</p>
      <Link to="/">
        <Button size="lg" variant="outline">Return Home</Button>
      </Link>
    </div>
  );
}
