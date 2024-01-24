"use client";
import { signIn, useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useCartService from "@/lib/hooks/useCartStore";
import { ShippingAddress } from "@/lib/models/OrderModel";
import CheckoutSteps from "@/components/CheckoutSteps";

// yup schema
const schema = yup.object().shape({
  fullName: yup.string().required("Full name is a required field"),
  address: yup.string().required("address is a required field"),
  city: yup.string().required("city is a required field"),
  postalCode: yup.string().required("Postal code is a required field"),
  country: yup.string().required("Country is a required field"),
});

const Form = () => {
  const router = useRouter();
  const { saveShippingAddress, shippingAddress } = useCartService();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  //setValue contributes to an improved user experience by pre-filling the form fields with existing shipping address details
  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, [setValue, shippingAddress]);

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    saveShippingAddress(form);
    router.push("/payment");
  };

  return (
    <div>
      <CheckoutSteps current={1} />
      <div className="max-w-sm mx-auto card bg-base-300 my-4">
        <div className="card-body">
          <h1 className="card-title">Shipping Address</h1>

          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="my-2">
              <label className="label" htmlFor="fullName">
                Full Name
              </label>
              <input
                type="text"
                id="text"
                {...register("fullName")}
                className="input input-bordered w-full max-w-sm"
              />
              {errors.fullName?.message && (
                <div className="text-error">{errors.fullName.message}</div>
              )}
            </div>
            <div className="my-2">
              <label className="label" htmlFor="address">
                Address
              </label>
              <input
                type="address"
                id="address"
                {...register("address")}
                className="input input-bordered w-full max-w-sm"
              />
              {errors.address?.message && (
                <div className="text-error">{errors.address.message}</div>
              )}
            </div>
            <div className="my-2">
              <label className="label" htmlFor="city">
                City
              </label>
              <input
                type="text"
                id="text"
                {...register("city")}
                className="input input-bordered w-full max-w-sm"
              />
              {errors.city?.message && (
                <div className="text-error">{errors.city.message}</div>
              )}
            </div>
            <div className="my-2">
              <label className="label" htmlFor="postalCode">
                Postal Code
              </label>
              <input
                type="text"
                id="text"
                {...register("postalCode")}
                className="input input-bordered w-full max-w-sm"
              />
              {errors.postalCode?.message && (
                <div className="text-error">{errors.postalCode.message}</div>
              )}
            </div>
            <div className="my-2">
              <label className="label" htmlFor="country">
                Country
              </label>
              <input
                type="text"
                id="text"
                {...register("country")}
                className="input input-bordered w-full max-w-sm"
              />
              {errors.country?.message && (
                <div className="text-error">{errors.country.message}</div>
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
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Form;
