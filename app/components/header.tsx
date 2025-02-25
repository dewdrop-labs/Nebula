import Link from "next/link";
import Image from "next/image";
import { StatsSection } from "./stats-section";

export function Hero() {
  return (
   <>
      <div className="relative h-[706px] w-full overflow-hidden rounded-t-[4rem] border-none bg-[url('/images/background-grid.png')] bg-no-repeat bg-cover">
        {/* Main Content */}
        <div className="w-full px-[4rem] pt-[4rem]">
          <div className="grid gap-8 md:grid-cols-3 items-center">
            {/* First Column (Takes up more space) */}
            <div className=" w-full col-span-2">
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

            {/* Floating Image Outside */}
      <div className=" ">
        <div className=" animate-float">
          <Image
            src="/cat.svg"
            alt="Crypto token illustration"
            width={500}
            height={500}
            className="object-contain w-[450px] h-[350px] z-20"
            priority
          />
        </div>
        
      </div>
          </div>
        </div>
        <StatsSection/>
      </div>
     
      </>
  );
}
