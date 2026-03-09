import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Pages
import Home from "@/pages/Home";
import Portfolio from "@/pages/Portfolio";
import Identities from "@/pages/Identities";
import IdentityDetail from "@/pages/IdentityDetail";
import ProjectDetail from "@/pages/ProjectDetail";
import ProductDetail from "@/pages/ProductDetail";
import Shop from "@/pages/Shop";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Courses from "@/pages/Courses";
import CourseViewer from "@/pages/CourseViewer";
import Contact from "@/pages/Contact";
import Questionnaire from "@/pages/Questionnaire";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import DashboardHome from "@/pages/DashboardHome";
import DashboardProducts from "@/pages/DashboardProducts";
import DashboardIdentities from "@/pages/DashboardIdentities";
import DashboardProjects from "@/pages/DashboardProjects";
import DashboardTestimonials from "@/pages/DashboardTestimonials";
import DashboardCourses from "@/pages/DashboardCourses";
import DashboardSettings from "@/pages/DashboardSettings";
import DashboardLogos from "@/pages/DashboardLogos";

// Layouts & Components
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingAdminButton from "@/components/FloatingAdminButton";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <CartProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
              <Routes>
                {/* Public Routes with Shared Layout */}
                <Route element={
                  <>
                    <Navbar />
                    <main className="flex-grow">
                      <Outlet />
                    </main>
                    <Footer />
                  </>
                }>
                  <Route path="/" element={<Home />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/portfolio/:id" element={<ProjectDetail />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:id" element={<ProductDetail />} />
                  <Route path="/identities" element={<Identities />} />
                  <Route path="/identities/:id" element={<IdentityDetail />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseViewer />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/questionnaire" element={<Questionnaire />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                </Route>

                <Route path="/login" element={<LoginPage />} />

                {/* Protected Dashboard Routes */}
                <Route path="/dashboard" element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="products" element={<DashboardProducts />} />
                    <Route path="identities" element={<DashboardIdentities />} />
                    <Route path="projects" element={<DashboardProjects />} />
                    <Route path="testimonials" element={<DashboardTestimonials />} />
                    <Route path="courses" element={<DashboardCourses />} />
                    <Route path="settings" element={<DashboardSettings />} />
                    <Route path="logos" element={<DashboardLogos />} />
                    <Route path="users" element={<div>إدارة المستخدمين</div>} />
                    <Route path="logs" element={<div>سجل النشاطات</div>} />
                  </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <FloatingAdminButton />
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
