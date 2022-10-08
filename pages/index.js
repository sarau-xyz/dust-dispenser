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

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(address)
    


    recaptchaRef.current.execute();


  };
  
  const onReCAPTCHAChange = async (token) => {

    if (!token) {
      return;
    }
    const response = await fetch("/api/celo", {
      method: "POST",
      body: JSON.stringify({ address, token }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response)


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