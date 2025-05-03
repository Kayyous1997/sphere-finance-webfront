
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen text-white w-full">
      <Navbar />
      <div className="flex flex-1 relative z-10">
        <main className="flex-grow">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
