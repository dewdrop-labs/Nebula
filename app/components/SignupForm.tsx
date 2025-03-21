import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import {  EyeIcon, EyeOff} from "lucide-react";

import Loader from "./loader";

const appleLogo = "/apple-logo.svg";
const googleLogo = "/google.svg";

export default function SignupForm() {
  interface FormValues {
    name: string;
    email: string;
    password: string;
    agreement: boolean;
  }

  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    agreement: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    console.log(formValues);
    setTimeout(() => {
      console.log("Form submitted", formValues);
      setLoading(false);
      window.location.href = '/verify-email';
    }, 8000);
  };

  const togglePassword = () => {
    setShowPassword((prevPassword) => !prevPassword)
  }

  return (
    <>
    {loading && (
      <Loader
        steps={[
          "Registering your account",
          "Generating your wallet",
          "Securing your credentials",
          "Account registered",
        ]}
        onComplete={() => setLoading(false)}
      />
    )}
    <form
      onSubmit={handleSubmit}
      className="font-montserrat w-full h-full max-w-[340px]  flex items-center justify-center flex-col gap-5"
    >
      <label
        htmlFor="name"
        className="w-full flex flex-col items-start gap-[6px]"
      >
        <span className="text-xs font-normal ml-5">Full Name</span>
        <input
          type="text"
          id="name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          className="w-full rounded-[27px] bg-white h-[51px] outline-none border-none px-6 py-5 font-normal text-sm text-[#302F2F]"
        />
      </label>

      <label
        htmlFor="email"
        className="w-full flex flex-col items-start gap-[6px]"
      >
        <span className="text-xs font-normal ml-5">Email</span>
        <input
          type="email"
          id="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          className="w-full rounded-[27px] bg-white h-[51px] outline-none border-none px-6 py-5 font-normal text-sm text-[#302F2F]"
        />
      </label>

      <label
        htmlFor="password"
        className="w-full flex flex-col items-start gap-[6px]"
      >
        <span className="text-xs font-normal ml-5">Password</span>
        <div className="w-full flex items-center gap-2 rounded-[27px] bg-white h-[51px]  px-6 py-5   " >

        
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          className="w-full outline-none border-none  font-normal text-sm text-[#302F2F]"
        />
      <button onClick={togglePassword} > {showPassword? <EyeIcon size={16} />  : <EyeOff  size={16}/>} </button>
</div>
      </label>

      <label className="flex items-center justify-center gap-2 my-2">
        <input
          type="checkbox"
          name="agreement"
          checked={formValues.agreement}
          onChange={handleChange}
          className="outline-none border-[1px] border-[#6A6969]"
        />
        <span className="text-[#302F2F] text-xs">
          I agree to the{" "}
          <a href="#" className="underline text-[#6A6969]">
            Terms & Services
          </a>
        </span>
      </label>

      <button
        type="submit"
        className="w-full bg-[#3D46FF] rounded-[33px] h-[62px] outline-none border-none px-6 py-5 font-bold text-base text-white"
      >
        Submit
      </button>

      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          className="w-full max-w-[163px] h-[36px] p-3 border-[1px] border-[#00000033] rounded-[18px] flex items-center justify-center gap-2"
        >
          <Image src={appleLogo} alt="Apple Logo" height={15} width={15} />
          Apple
        </button>
        <button
          type="button"
          className="w-full max-w-[163px] p-3 h-[36px] border-[1px] border-[#00000033] rounded-[18px] flex items-center justify-center gap-2"
        >
          <Image src={googleLogo} alt="Google Logo" height={15} width={15} />
          Google
        </button>
      </div>

      <p className="text-xs font-normal text-[#000000] mt-3">
        Have an account?{" "}
        <Link href="#" className="text-[#302F2F] underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
    </>
  );
}
