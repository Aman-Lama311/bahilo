import { Bell, Search, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { useLogoutUserMutation } from "../../features/auth/authApi";

export const Topbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      // even if the request fails, still clear local state below so the UI doesn't get stuck
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

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
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-muted-foreground hover:text-destructive disabled:opacity-50"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
