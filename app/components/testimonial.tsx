"use client";

import Image from "next/image";
import { useState } from "react";
import girl from "../../public/Image/Ellipse.png";
import bg from "../../public/Image/Rectangle 16.png";

import { StaticImageData } from "next/image";

type Testimonial = {
  image: StaticImageData | string;
  text: string;
  name: string;
  role: string;
};

const testimonials: Testimonial[] = [
  {
    image: girl,
    text: "Nebula has completely changed how I send money. I love knowing that my transactions are private and secure, without worrying about my data being tracked. Fast, seamless, and truly privacy-first!",
    name: "Alex R.",
    role: "Early Adopter",
  },
  {
    image: girl,
    text: "Using Nebula gives me peace of mind. The platform is user-friendly and ensures that my transactions remain confidential.",
    name: "Jamie L.",
    role: "Finance Expert",
  },
  {
    image: girl,
    text: "Finally, a payment system that prioritizes security! I highly recommend Nebula for anyone looking for a private and reliable solution.",
    name: "Taylor M.",
    role: "Tech Enthusiast",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);


  return (
    <div className="flex flex-col items-center text-center bg-gray-100 py-12 px-6 font-sans w-full mt-6">
      <h2 className="text-2xl font-bold text-black">Testimonials</h2>
      <p className="text-gray-500">Your Security, Our Priority</p>
      <div className="bg-white p-6   shadow-lg mt-6 max-w-[717px] h-[300px] rounded-[31px] text-center">
        <Image
          src={testimonials[currentIndex].image}
          alt={testimonials[currentIndex].name}
          width={80}
          height={80}
          className="rounded-full mx-auto mb-4 pt-4"
        />
        <p className="text-black font-[700px] text-[18px]">
          {testimonials[currentIndex].text}
        </p>
        <p className="text-gray-500 mt-4">
          — {testimonials[currentIndex].name}, {testimonials[currentIndex].role}
        </p>
      </div>
      <div className="flex gap-2 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-5 h-3 rounded-full ${
              index === currentIndex ? "bg-[#3D46FF]" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      <div className="relative w-full max-w-[1068px] mx-auto mt-10">
        {/* Background Image */}
        <Image src={bg} alt="bg" className="w-full h-auto rounded-lg" />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-8 rounded-lg">
          <h3 className="text-[30px] font-bold">
            Reinforce security and ease of use:
          </h3>
          <p className=" text-[34px] font-[300]">Start sending secure, private payments today.</p>
          <button className="mt-10 px-6 py-2 bg-white text-[#3D46FF] rounded-full">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
