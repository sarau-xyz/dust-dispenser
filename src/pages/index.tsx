import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import React from "react";

const Home = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const recaptchaRef = useRef(null);

  return (
    <form
      onSubmit={handleSubmit(async (formData) => {
        if (recaptchaRef.current) {
          setSubmitting(true);
          setServerErrors([]);

          // @ts-ignore
          const token = await recaptchaRef.current.executeAsync();
          // @ts-ignore
          recaptchaRef.current.reset();

          const response = await fetch(`/api/${formData.network}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              address: formData.address,
              token,
            }),
          });

          const data = await response.json();
          console.log(data);
          if (data.errors) {
            setServerErrors(data.errors);
          } else {
            console.log("success, redirect to home page");
          }

          setSubmitting(false);
        }
      })}
    >
      <h1>Fund your Account</h1>
      <div></div>
      <div>Add Funds</div>
      <div>Enter the address of your account to receive additional funds.</div>
      <input defaultValue="alfajores" {...register("network")} />
      <input {...register("address")} />
      <input type="submit" disabled={submitting} />

      {errors.exampleRequired && <span>This field is required</span>}

      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        ref={recaptchaRef}
        size={"invisible"}
      />
    </form>
  );
};

export default Home;
