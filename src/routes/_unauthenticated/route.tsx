import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-screen flex flex-col justify-center p-4">
      <Outlet />
    </div>
  );
}
