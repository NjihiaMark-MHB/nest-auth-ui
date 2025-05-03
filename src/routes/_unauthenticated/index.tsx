import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { inferredLoginSchema, loginSchema } from "../../types/login";
import { useLoginUser } from "../../hooks/react-query/login-user";
import {
  useSetCurrentUser,
  useSetIsAuthenticated,
} from "../../zustand-stores/auth";

export const Route = createFileRoute("/_unauthenticated/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate: loginUser } = useLoginUser();
  const setIsAuthenticated = useSetIsAuthenticated();
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<inferredLoginSchema> = (data) => {
    loginUser(data, {
      onSuccess: (data) => {
        setCurrentUser(data);
        setIsAuthenticated(true);
        navigate({ to: "/home", replace: true });
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>Login | Nest Auth UI</title>
        <meta name="description" content="login to access Nest Auth Ui" />
      </Helmet>
      <div className="w-full max-w-sm mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="space-y-1 w-full">
            <input
              {...register("email")}
              placeholder="Email"
              className={`w-full border p-2 rounded ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1 w-full">
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className={`w-full border p-2 rounded ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded"
          >
            Login
          </button>
        </form>
        <p className="mt-4">
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-red-500">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
