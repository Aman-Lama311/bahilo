import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Login } from "@/features/auth/pages/Login";
import { ProtectedRoute } from "@/app/ProtectedRoute";
import { PublicRoute } from "@/app/PublicRoute";

const Placeholder = ({ title }: { title: string }) => (
  <>
    <PageHeader title={title} />
    <div className="px-6 pb-6 text-muted-foreground text-sm">Coming soon.</div>
  </>
);

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<Placeholder title="Dashboard" />}
            />
            <Route
              path="/printing"
              element={<Placeholder title="Print Logs" />}
            />
            <Route
              path="/paper-stock"
              element={<Placeholder title="Paper Stock" />}
            />
            <Route
              path="/notebooks/issue"
              element={<Placeholder title="Issue Notebook" />}
            />
            <Route
              path="/notebooks/history"
              element={<Placeholder title="Issue History" />}
            />
            <Route
              path="/students"
              element={<Placeholder title="Students" />}
            />
            <Route
              path="/notebooks/stock"
              element={<Placeholder title="Notebook Stock" />}
            />
            <Route
              path="/notebooks/types"
              element={<Placeholder title="Notebook Types" />}
            />
            <Route
              path="/notebooks/reasons"
              element={<Placeholder title="Issue Reasons" />}
            />
            <Route
              path="/academics/classes"
              element={<Placeholder title="Classes" />}
            />
            <Route
              path="/academics/sections"
              element={<Placeholder title="Sections" />}
            />
            <Route
              path="/academics/teachers"
              element={<Placeholder title="Teachers" />}
            />
            <Route
              path="/academics/departments"
              element={<Placeholder title="Departments" />}
            />
            <Route path="/reports" element={<Placeholder title="Reports" />} />
            <Route path="/users" element={<Placeholder title="Users" />} />
            <Route
              path="/settings"
              element={<Placeholder title="Settings" />}
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
