import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { useCreateUser } from "../../hooks/react-query/create-user";
import { useLoginUser } from "../../hooks/react-query/login-user";
import type { SubmitHandler } from "react-hook-form";
import type { inferredCreateUserSchema } from "../../types/sign-up";
import {
  useSetCurrentUser,
  useSetIsAuthenticated,
} from "../../zustand-stores/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "../../types/sign-up";
import { GoogleButton } from "../../components/GoogleButton";

export const Route = createFileRoute("/_unauthenticated/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { mutate: createUser } = useCreateUser();
  const { mutate: loginUser } = useLoginUser();
  const setCurrentUser = useSetCurrentUser();
  const setIsAuthenticated = useSetIsAuthenticated();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit: SubmitHandler<inferredCreateUserSchema> = (data) => {
    createUser(data, {
      onSuccess: () => {
        loginUser(
          {
            email: data.email,
            password: data.password,
          },
          {
            onSuccess: (data) => {
              setCurrentUser(data);
              setIsAuthenticated(true);
              navigate({ to: "/home" });
            },
            onError: (error) => {
              console.log("error login in signup user", error);
            },
          }
        );
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/auth/google`;
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | Nest Auth UI</title>
        <meta name="description" content="Create account to login" />
      </Helmet>
      <div className="w-full max-w-sm mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          <div className="space-y-1 w-full">
            <input
              {...register("firstName")}
              type="text"
              placeholder="First name"
              className={`w-full border p-2 rounded ${
                errors.firstName ? "border-red-500" : ""
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1 w-full">
            <input
              {...register("lastName")}
              type="text"
              placeholder="Last name"
              className={`w-full border p-2 rounded ${
                errors.lastName ? "border-red-500" : ""
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
          <div className="space-y-1 w-full">
            <input
              {...register("email")}
              type="email"
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
            className="w-full cursor-pointer bg-black text-white p-2 rounded"
          >
            Create an account
          </button>
        </form>
        <div className="mt-4">
          <GoogleButton
            text="Sign up with Google"
            onClick={() => handleGoogleAuth()}
          />
        </div>
        <p className="mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-red-500">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
