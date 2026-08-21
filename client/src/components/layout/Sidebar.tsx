import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Printer,
  Package,
  BookOpen,
  GraduationCap,
  BarChart3,
  Users,
  Settings,
  Menu,
  ChevronDown
} from 'lucide-react';

const dropdownGroups = [
  {
    label: 'Operations',
    icon: Printer,
    items: [
      { label: 'Print Logs', to: '/printing', icon: Printer },
      { label: 'Paper Stock', to: '/paper-stock', icon: Package }
    ]
  },
  {
    label: 'Notebook Register',
    icon: BookOpen,
    items: [
      { label: 'Issue Notebook', to: '/notebooks/issue', icon: BookOpen },
      { label: 'Issue History', to: '/notebooks/history', icon: BookOpen },
      { label: 'Students', to: '/students', icon: Users },
      { label: 'Notebook Stock', to: '/notebooks/stock', icon: Package },
      { label: 'Notebook Types', to: '/notebooks/types', icon: BookOpen },
      { label: 'Issue Reasons', to: '/notebooks/reasons', icon: BookOpen }
    ]
  },
  {
    label: 'Academic',
    icon: GraduationCap,
    items: [
      { label: 'Classes', to: '/academics/classes', icon: GraduationCap },
      { label: 'Sections', to: '/academics/sections', icon: GraduationCap },
      { label: 'Teachers', to: '/academics/teachers', icon: GraduationCap },
      { label: 'Departments', to: '/academics/departments', icon: GraduationCap }
    ]
  },
  {
    label: 'Reports',
    icon: BarChart3,
    items: [{ label: 'Reports', to: '/reports', icon: BarChart3 }]
  },
  {
    label: 'Administration',
    icon: Users,
    items: [{ label: 'Users', to: '/users', icon: Users }]
  },
  {
    label: 'Settings',
    icon: Settings,
    items: [{ label: 'Settings', to: '/settings', icon: Settings }]
  }
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (label: string) => {
    setOpenGroup((prev) => (prev === label ? null : label));
  };

  return (
    <aside
      className={`border-r border-border bg-card h-screen sticky top-0 overflow-y-auto transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <img src="/logo.svg" alt="Bahilo" className="h-5 w-auto" />
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="text-muted-foreground hover:text-foreground p-1.5 rounded hover:bg-secondary/50 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
      </div>

      <nav className="px-2 space-y-1 pb-6">
        {/* Dashboard — plain link, not a dropdown */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
              isActive
                ? 'bg-secondary text-secondary-foreground font-medium'
                : 'text-foreground hover:bg-secondary/50'
            }`
          }
        >
          <LayoutDashboard size={16} />
          {!collapsed && 'Dashboard'}
        </NavLink>

        {/* Everything else — dropdown groups */}
        {dropdownGroups.map((group) => {
          const isOpen = openGroup === group.label;
          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded text-sm text-foreground hover:bg-secondary/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <group.icon size={16} />
                  {!collapsed && group.label}
                </span>
                {!collapsed && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="space-y-0.5 mt-0.5 pl-2">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                          isActive
                            ? 'bg-secondary text-secondary-foreground font-medium'
                            : 'text-foreground hover:bg-secondary/50'
                        } ${collapsed ? 'justify-center' : 'pl-4'}`
                      }
                    >
                      <item.icon size={14} />
                      {!collapsed && item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};