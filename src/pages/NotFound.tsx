
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-sphere-green mb-6">404</h1>
        <p className="text-2xl text-gray-300 mb-8">Page not found</p>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-sphere-green text-black hover:bg-green-400">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
