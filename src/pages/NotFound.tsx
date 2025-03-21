
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center glass p-12 rounded-lg max-w-md animate-scale-in">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl font-semibold">404</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent rounded-full animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-medium mb-3">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn't find the page you were looking for. It might have been moved or deleted.
        </p>
        
        <Button 
          asChild
          className="transition-all duration-200 hover:opacity-90 hover:shadow-md"
        >
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
