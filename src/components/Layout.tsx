
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen text-white w-full">
        <Navbar />
        <div className="flex flex-1 relative z-10">
          <div className="hidden md:block">
            <AppSidebar />
          </div>
          <main className="flex-grow">
            <div className="p-4">
              <SidebarTrigger className="md:mb-4" />
              <Outlet />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
