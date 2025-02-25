import Link from "next/link";
import Image from "next/image";
import { StatsSection } from "./stats-section";

export function Hero() {
  return (
   <>
      <div className="relative h-[706px] max-w-[1068px] overflow-hidden rounded-t-[4rem] border-none bg-gradient-to-br from-[#242A99] to-[#3D46FF]">
        {/* Grid Background Pattern */}
        <div
          className="absolute inset-0 bg-[url('/line.png')] bg-center bg-repeat opacity-20"
          style={{
            backgroundSize: "1000px 1000px",
            transform: "rotate(-90deg) scale(1.5)",
          }}
          aria-hidden="true"
        />
 
        {/* Main Content */}
        <div className="w-full mx-auto pl-10 pt-20 pb-16 md:pt-32">
          <div className="grid gap-8 md:grid-cols-3 items-center">
            {/* First Column (Takes up more space) */}
            <div className=" w-[110%] col-span-2">
              <h1 className="text-4xl md:text-4xl lg:text-5xl font-extrabold font-montserrat text-white mb-6 leading-tight">
                Experience the Future of <br/> Private & Secure Payments
              </h1>
              <p className="text-2xl md:text-xl font-normal font-montserrat text-blue-100/90 mb-8 leading-relaxed text-left">
                Fast, secure, and privacy-focused transfers— <br/> sending money has never been this safe and effortless.
              </p>
              <Link
                href="#"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-blue-900 bg-white rounded-full hover:bg-blue-50 transition-colors duration-150"
              >
                Get Started
              </Link>
            </div>

            {/* Empty Second Column for spacing or future content */}
            <div></div>
          </div>
        </div>
         <StatsSection/>
      </div>

      {/* Floating Image Outside */}
      <div className=" transform -translate-y-1/2 z-10">
        <div className="relative left-[94%] -top-96  w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] animate-float">
          <Image
            src="/cat.svg"
            alt="Crypto token illustration"
            width={350}
            height={350}
            className="object-contain"
            priority
          />
        </div>
        
      </div>
     
      </>
  );
}
