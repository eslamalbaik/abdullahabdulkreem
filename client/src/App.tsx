import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Home from "@/pages/Home";
import Portfolio from "@/pages/Portfolio";
import Identities from "@/pages/Identities";
import IdentityDetail from "@/pages/IdentityDetail";
import ProjectDetail from "@/pages/ProjectDetail";
import Admin from "@/pages/Admin";
import Shop from "@/pages/Shop";
import Courses from "@/pages/Courses";
import Contact from "@/pages/Contact";
import Questionnaire from "@/pages/Questionnaire";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/portfolio/:id" component={ProjectDetail} />
      <Route path="/identities" component={Identities} />
      <Route path="/identities/:id" component={IdentityDetail} />
      <Route path="/shop" component={Shop} />
      <Route path="/courses" component={Courses} />
      <Route path="/contact" component={Contact} />
      <Route path="/questionnaire" component={Questionnaire} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
          <Navbar />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
