import React, { useRef, useEffect, useState } from "react";

function VerifyEmail() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(599);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '');
    event.target.value = value;
    
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !event.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData('text').replace(/\D/g, '');
    
    pasteData.split('').slice(0, 6).forEach((char, i) => {
      const ref = inputRefs.current[i];
      if (ref) {
        ref.value = char;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        i === 5 ? ref.focus() : inputRefs.current[i + 1]?.focus();
      }
    });
  };

  const handleResendOTP = () => {
    setTimeLeft(599);
  };

  return (
    <div className="text-center flex items-center justify-center flex-col">
      <div className="flex flex-col mb-5">
        <p className="text-[14px] font-normal">A 6-digit code has been sent to</p>
        <p className="text-[14px] font-semibold">ahanekuwisdom@gmail.com</p>
      </div>

      <div className="flex gap-2 mt-4 mb-4">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            ref={(el) => { inputRefs.current[index] = el; }}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-[56px] h-[68px] border border-blue-500 rounded-2xl text-center text-[26px] font-semibold outline-none focus:border-blue-700 transition-colors"
          />
        ))}
      </div>
      <div className="flex gap-1 text-[14px]">
        <p>- The OTP will be expired in</p>
        <p className="text-[14px] font-semibold">
          {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
        </p>
      </div>
      <div className="flex gap-1 text-[14px] mb-8">
        <p className="text-[14px] font-semibold">- Didn’t Receive Code?</p>
        <button
          onClick={handleResendOTP}
          className="underline text-blue-600"
        >
          Resend OTP
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-[#3D46FF] rounded-[33px] h-[62px] outline-none border-none px-6 py-5 font-bold text-base text-white"
      >
        Verify
      </button>
    </div>
  );
}

export default VerifyEmail;