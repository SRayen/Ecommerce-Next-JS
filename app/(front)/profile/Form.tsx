"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// yup schema
const schema = yup.object().shape(
  {
    name: yup.string().required("Name is a required field"),
    email: yup
      .string()
      .required("Email is a required field")
      .email("Email is invalid"),
    password: yup
      .string()
      .nullable()
      .notRequired()
      .when("password", {
        is: (value: string) => value?.length,
        then: (rule) =>
          rule.min(6, "password must contain 6 or more characters"),
      }),
    confirmPassword: yup
      .string()
      .nullable()
      .notRequired()
      .when("confirmPassword", {
        is: (value: string) => value?.length,
        then: (rule) =>
          rule
            .min(6, "password must contain 6 or more characters")
            .oneOf([yup.ref("password")], "Passwords must match"),
      }),
  },
  [
    // Add Cyclic deps here because when require itself
    ["password", "password"],
    ["confirmPassword", "confirmPassword"],
  ]
);

const Form = () => {
  const { data: session, update } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session && session.user) {
      setValue("name", session.user.name!);
      setValue("email", session.user.email!);
    }
  }, [router, session, setValue]);

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, password } = form;
    try {
      const response = await axios.put("/api/auth/profile", {
        name,
        email,
        password,
      });
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        const newSession = {
          ...session,
          user: {
            ...session?.user,
            name,
            email,
          },
        };
        await update(newSession);
      } else {
        toast.error(response.data.message || "error");
      }
    } catch (err: any) {
      const error =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message;
      toast.error(error || "error");
    }
  };
  return (
    <div className="max-w-sm  mx-auto card bg-base-300 my-4">
      <div className="card-body">
        <h1 className="card-title">Profile</h1>
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
              New Password
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
              Confirm New Password
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

          <div className="my-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
