import Image from "next/image";

export default function GetStarted() {
  return (
    <section className="font-montserrat relative w-full h-screen rounded-3xl overflow-hidden">
      <Image
        src="/images/background-grid.png"
        alt="Background Grid"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/40 px-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold  leading-snug md:leading-[43.91px]">
          Reinforce security and ease of use:
        </h1>
        <p className="mt-2 text-lg md:text-2xl lg:text-4xl font-light leading-snug md:leading-[43.91px]">
          Start sending secure, private payments today.
        </p>
        <button className="mt-4 px-4 py-2 md:px-6 md:py-4 bg-white text-[#3D46FF] text-base md:text-xl font-semibold leading-[24.38px] rounded-full">
          Get Started
        </button>
      </div>
    </section>
  );
}
