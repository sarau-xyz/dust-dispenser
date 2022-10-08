import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";


export default function Home() {
  const [address, setAddress] = React.useState("");
  const recaptchaRef = React.useRef(null);

  const handleChange = ({ target: { value } }) => {
    setAddress(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    recaptchaRef.current.execute();
  };

  const onReCAPTCHAChange = async (captchaCode) => {

    if (!captchaCode) {
      return;
    }

    try {
      const response = await fetch("/api/celo", {
        method: "POST",
        body: JSON.stringify({ address, captcha: captchaCode }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // If the response is ok than show the success alert
        alert("address registered successfully");
      } else {
        // Else throw an error with the message returned
        // from the API
        const error = await response.json();
        throw new Error(error.message)
      }
    } catch (error) {
      alert(error?.message || "Something went wrong");
    } finally {
      // Reset the hCaptcha when the request has failed or succeeeded
      // so that it can be executed again if user submits another email.
      setAddress("");
    }



    alert(`Hey, ${address}`);

    recaptchaRef.current.reset();
  };

  return (
    <div className="container">
      <Head>
        <title>Add Funds Celo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="feedback-form">
        <h2 className="header">Add Funds</h2>
        <div>
          <form onSubmit={handleSubmit}>
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={onReCAPTCHAChange}
            />
            <input
              onChange={handleChange}
              required
              type="address"
              name="address"
              placeholder="address"
            />
            <button type="submit">Get Stared</button>
          </form>
        </div>
      </div>
    </div>
  );
}