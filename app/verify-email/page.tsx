"use client";
import Image from "next/image";
import VerifyEmail from "../components/Verify-email";

const coin = "/cat.svg";

export default function Page() {
  return (
    <div className="font-montserrat w-full min-h-screen flex items-center justify-center p-[3%] md:p-[5%] bg-[#3D46FF] bg-[url('/signup-bg.png')] bg-cover bg-no-repeat">
      <div className="w-full max-w-[1091px] flex items-stretch rounded-[31px] overflow-hidden md:h-[643px]">
        <div className="w-full hidden max-w-[519px] md:flex items-center justify-center bg-[linear-gradient(180deg,_rgba(36,42,153,0.9)_0%,_rgba(12,14,51,0.9)_100%)] relative">
          <h1 className="absolute top-10 left-10 text-[26px] font-bold text-[#FFFFFF]">
            Nebula
          </h1>
          <Image src={coin} alt="Coin" height={300.49} width={259.62} />
        </div>

        <div className="bg-[#F2F2F2] w-full max-w-[572px] flex flex-col gap-4 items-center justify-center py-[80px] p-3">
          <h1 className="text-[#000000] text-[26px] font-normal mb-2 ">
            Verify Your Email
          </h1>
          <VerifyEmail/>
        </div>
      </div>
    </div>
  );
}
