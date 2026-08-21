import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Breadcrumb } from './Breadcrumb';

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <Breadcrumb />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};