import {
  createFileRoute,
  Outlet,
  useMatchRoute,
  Link,
  useNavigate,
  redirect,
} from "@tanstack/react-router";
import { useLogoutUser } from "../../hooks/react-query/logout-user";
import {
  useAuthStore,
  useSetCurrentUser,
  useSetIsAuthenticated,
} from "../../zustand-stores/auth";
import apiClient from "../../api/apiClient";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ search }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    const userId = (search as { userId?: string }).userId;

    // Handle Google OAuth callback
    if (userId && !isAuthenticated) {
      try {
        const response = await apiClient.get(`/users/uuid/${userId}`);
        useAuthStore.setState({
          isAuthenticated: true,
          currentUser: response.data,
        });
        window.location.href = "/home";
        return;
      } catch (error) {
        console.error("Error setting user data:", error);
        throw redirect({
          to: "/",
          replace: true,
        });
      }
    }

    // Regular auth check
    if (!isAuthenticated) {
      throw redirect({
        to: "/",
        replace: true,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const matchRoute = useMatchRoute();
  const { mutate: logout } = useLogoutUser();
  const navigate = useNavigate();
  const setIsAuthenticated = useSetIsAuthenticated();
  const setCurrentUser = useSetCurrentUser();

  const handleLogout = () => {
    //setIsAuthenticated(false);
    logout(undefined, {
      onSuccess: () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        navigate({ to: "/" });
      },
    });
  };
  return (
    <div>
      <nav className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <Link
              to="/home"
              className={`transition-colors ${
                matchRoute({ to: "/home" })
                  ? "text-red-500"
                  : "hover:text-gray-300"
              }`}
            >
              Home
            </Link>
            <Link
              to="/profile"
              className={`transition-colors ${
                matchRoute({ to: "/profile" })
                  ? "text-red-500"
                  : "hover:text-gray-300"
              }`}
            >
              Profile
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="hover:text-gray-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
