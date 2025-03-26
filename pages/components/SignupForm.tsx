/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { EyeIcon, EyeOff } from "lucide-react";
import { useRouter } from 'next/router';

const appleLogo = "/apple-logo.svg";
const googleLogo = "/google.svg";

export default function SignupForm() {
  interface FormValues {
    name: string;
    email: string;
    password: string;
    agreement: boolean;
  }

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    agreement: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validate form
    if (!formValues.email || !formValues.password) {
      setError('Email and password are required');
      return;
    }
    
    if (!formValues.agreement) {
      setError('You must agree to the Terms & Services');
      return;
    }
    
    // Clear previous errors
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/database/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
          name: formValues.name || undefined, // Only send if not empty
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      // Registration successful
      console.log('Registration successful:', data);
      
      // Redirect to login page or dashboard
      router.push('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setShowPassword((prevPassword) => !prevPassword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="font-montserrat w-full h-full max-w-[340px] flex items-center justify-center flex-col gap-5"
    >
      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

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
          required
        />
      </label>

      <label
        htmlFor="password"
        className="w-full flex flex-col items-start gap-[6px]"
      >
        <span className="text-xs font-normal ml-5">Password</span>
        <div className="w-full flex items-center gap-2 rounded-[27px] bg-white h-[51px] px-6 py-5">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            className="w-full outline-none border-none font-normal text-sm text-[#302F2F]"
            required
          />
          <button onClick={togglePassword} type="button">
            {showPassword ? <EyeIcon size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </label>

      <label className="flex items-center justify-center gap-2 my-2">
        <input
          type="checkbox"
          name="agreement"
          checked={formValues.agreement}
          onChange={handleChange}
          className="outline-none border-[1px] border-[#6A6969]"
          required
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
        disabled={loading}
        className="w-full bg-[#3D46FF] rounded-[33px] h-[62px] outline-none border-none px-6 py-5 font-bold text-base text-white disabled:bg-blue-300"
      >
        {loading ? 'Creating account...' : 'Submit'}
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
        <Link href="/login" className="text-[#302F2F] underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}