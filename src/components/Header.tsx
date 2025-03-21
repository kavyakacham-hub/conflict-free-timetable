
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "w-full px-6 py-4 flex items-center justify-between glass z-10 sticky top-0",
      className
    )}>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-primary animate-pulse" />
        <h1 className="text-xl font-medium tracking-tight">Timetable</h1>
      </div>
      <nav className="hidden md:block">
        <ul className="flex items-center gap-6">
          <li className="text-sm font-medium text-primary">Dashboard</li>
          <li className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Schedules
          </li>
          <li className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Faculty
          </li>
          <li className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Classrooms
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-xs font-medium text-secondary-foreground">TT</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
