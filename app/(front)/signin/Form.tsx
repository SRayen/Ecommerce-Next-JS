"use client";
import { signIn, useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { Session } from "inspector";
type Inputs = {
  email: string;
  password: string;
};

// yup schema
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Name is a required field")
    .email("Email is invalid"),
  password: yup
    .string()
    .required("Password is a required field")
    .min(6, "password must contain 6 or more characters"),
});

const Form = () => {
  const { data: session } = useSession();

  const params = useSearchParams();
  let callbackUrl = params.get("callbackUrl") || "/";
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, params, router, session]);

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { email, password } = form;
    signIn("credentials", {
      email,
      password,
    });
  };

  return (
    <div className="max-w-sm mx-auto card bg-base-300 my-4">
      <div className="card-body">
        <h1 className="card-title">Sign in</h1>
        {params.get("error") && (
          <div className="alert text-error">
            {params.get("error") === "CredentialsSignin"
              ? "Invalid email or password"
              : params.get("error")}
          </div>
        )}
        {params.get("success") && (
          <div className="alert text-success">{params.get("success")}</div>
        )}
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-2">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register("email")}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.email?.message && (
              <div className="text-error">{errors.email.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.password?.message && (
              <div className="text-error">{errors.password.message}</div>
            )}
          </div>
          <div className="my-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Form;
