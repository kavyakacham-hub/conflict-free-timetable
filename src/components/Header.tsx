
import React from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => currentPath === path;
  
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
        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-xs font-medium text-secondary-foreground">TT</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
