"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import Link from "next/link";
type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// yup schema
const schema = yup.object().shape({
  name: yup.string().required("Name is a required field"),
  email: yup
    .string()
    .required("Email is a required field")
    .email("Email is invalid"),
  password: yup
    .string()
    .required("Password is a required field")
    .min(6, "password must contain 6 or more characters"),
  confirmPassword: yup
    .string()
    .required("Confirm password is a required field")
    .min(6, "password must contain 6 or more characters")
    .oneOf([yup.ref("password")], "Passwords must match"),
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
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, params, router, session]);

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, password } = form;

    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      console.log("res===>", res);
      if (res.status === 201) {
        return router.push(
          `/signin?callbackUrl=${callbackUrl}&success=Account has been created`
        );
      } else {
        const errorData = res.data;
        throw new Error(errorData.message);
      }
    } catch (err: any) {
      const error =
        err.response.data.message &&
        err.response.data.message.indexOf("E11000") === 0
          ? "Email is duplicate"
          : err.response.data.message;
      toast.error(error || "error");
    }
  };

  return (
    <div className="max-w-sm mx-auto card bg-base-300 my-4">
      <div className="card-body">
        <h1 className="card-title">Register</h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-2">
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.name?.message && (
              <div className="text-error">{errors.name.message}</div>
            )}
          </div>
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

          <div className="my-2">
            <label className="label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.confirmPassword?.message && (
              <div className="text-error">{errors.confirmPassword.message}</div>
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
              Register
            </button>
          </div>
        </form>
        <div className="divider"> </div>
        <div>
          Already have an account?{" "}
          <Link className="link" href={`/signin?callbackUrl=${callbackUrl}`}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Form;