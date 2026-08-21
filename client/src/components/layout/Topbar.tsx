import { Bell, Search, User } from 'lucide-react';

export const Topbar = () => {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-64"
        />
      </div>
      <div className="flex items-center gap-4">
        <Bell size={18} className="text-muted-foreground" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User size={16} className="text-secondary-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};