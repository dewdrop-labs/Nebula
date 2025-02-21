import Image from "next/image";
export default function Security() {
    return (
        <section
            className="pt-[120px] pb-[78px] md:px-[112px] px-[20px] text-center relative bg-gradient-to-b from-[#3D46FF] to-[#242A99]">
            <Image
                src="/security.png" alt="Security" width={1000} height={1000}
                   className="absolute top-0 left-0 w-full h-full object-cover"/>
            <div className="mb-[43px] md:text-4xl text-3xl relative z-10 text-white">
                <h3 className="font-bold">Reinforce security and ease of use: </h3>
                <p className="font-light">Start sending secure, private payments today.</p>
            </div>
            <button className="px-12 appearance-none md:text-xl text-lg py-5 z-10 relative rounded-[31px] bg-white text-[#3D46FF]">Get Started</button>
        </section>
    );
}