import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground px-6 pt-4">
      <Link to="/dashboard" className="hover:text-foreground">Home</Link>
      {segments.map((segment, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/');
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight size={14} />
            <Link to={path} className="hover:text-foreground capitalize">{label}</Link>
          </span>
        );
      })}
    </div>
  );
};