
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => currentPath === path;
  
  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/login');
  };
  
  return (
    <header className={cn(
      "w-full px-6 py-4 flex items-center justify-between glass z-10 sticky top-0",
      className
    )}>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-primary animate-pulse" />
        <h1 className="text-xl font-medium tracking-tight">Timetable</h1>
      </div>
      
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink className={cn(
                navigationMenuTriggerStyle(),
                isActive('/') && "bg-primary/10 text-primary font-medium"
              )}>
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/schedules">
              <NavigationMenuLink className={cn(
                navigationMenuTriggerStyle(),
                isActive('/schedules') && "bg-primary/10 text-primary font-medium"
              )}>
                Schedules
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/faculty">
              <NavigationMenuLink className={cn(
                navigationMenuTriggerStyle(),
                isActive('/faculty') && "bg-primary/10 text-primary font-medium"
              )}>
                Faculty
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/classrooms">
              <NavigationMenuLink className={cn(
                navigationMenuTriggerStyle(),
                isActive('/classrooms') && "bg-primary/10 text-primary font-medium"
              )}>
                Classrooms
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="flex items-center gap-2">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors cursor-pointer">
                <span className="text-xs font-medium text-secondary-foreground">{user.username.substring(0, 2).toUpperCase()}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{user.username}</span>
                <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive cursor-pointer flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
