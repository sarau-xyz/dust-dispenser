import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ReCAPTCHA from "react-google-recaptcha";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";


export default function Home() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();


  const [submitting, setSubmitting ] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const reRef = useRef(null);

  return (

    <form onSubmit={handleSubmit( async (formData) => {
      console.log(formData)
      setSubmitting(true);
      setServerErrors([]);

      const token = await reRef.current.getValue()  ;
      console.log(token)
      reRef.current.reset();

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
      console.log(data)
        if (data.errors) {
          setServerErrors(data.errors);
        } else {
          console.log("success, redirect to home page");
        }

        setSubmitting(false);
    } 
      )}>

      <h1>Fund your Account</h1>
      <div></div>
      <div>Add Funds</div>
      <div>Enter the address of your account to receive additional funds.</div>
      <input defaultValue="alfajores" {...register("network")} />
      <div></div>
      <input  {...register("address")} />
      <input type="submit" />
      
      {errors.exampleRequired && <span>This field is required</span>}
      
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        ref={reRef}
      />  

      
    </form>
  );

}