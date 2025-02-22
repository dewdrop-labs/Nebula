import Image from "next/image";

const featuresData = [
    {
      icon: "/privacy.svg", 
      title: "Privacy First",
      description: "No personal data tracking.",
      background: "linear-gradient(90deg, #10CA57 0%, #08642B 100%)",     
    },
    {
      icon: "/security.svg",
      title: "Bank-Grade Security",
      description: "End-to-end encryption.",
      background: "#3D46FF",
    },
    {
      icon: "/fast.svg",
      title: "Fast Transactions",
      description: "Instant transfers with no delays.",
      background: "#3D46FF",

    },
    {
      icon: "/globe.svg",
      title: "Global Accessibility",
      description: "Transfer funds anywhere, anytime.",
      background: "linear-gradient(90deg, #10CA57 0%, #08642B 100%)",
    },
  ];


const Features = () => {
    return (
<section className="font-montserrat w-full h-auto md:h-[586px] py-10  px-3 max-w-[1068px] mx-auto bg-[var(--background)] rounded-[31px] flex flex-col items-center justify-center gap-6  " >

    <div className="text-center flex items-center justify-center flex-col gap-4 " >
        <h1 className=" text-[#1E1E1E] font-bold text-4xl " >Key Features</h1>
        <p className="font-light text-[#302F2F] text-lg " >Here are the key features of Nebula</p>
    </div>

    <div className=" w-full h-full p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 place-items-center gap-6 mx-auto">
        {featuresData.map((feature, index) => (
          <div
            key={index}
            className="p-3 bg-[var(--background)] flex flex-row items-center gap-4 w-[350px] md:w-[387px] "
          >
            <div className=" w-[70px] min-w-[70px] h-[70px] min-h-[70px]  md:w-[92px] md:h-[92px] md:min-h-[92px] md:min-w-[92px] rounded-full flex items-center justify-center  " 
            style={{
                background: feature.background
            }}
            >
                <Image src={feature.icon} alt="icon" height={100} width={100} className="w-[50px] h-[50px] object-contain " />
            </div>

            <div className="flex flex-col items-start justify-center gap-2" >
            <h3
             className=" font-extrabold text-xl leading-[24.39px]  "
             style={{
                background: feature.background,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
             }}
             >{feature.title}</h3>
            <p className="text-[#302F2F] text-lg font-medium leading-[21.96px] ">{feature.description}</p>
            </div>
            
          </div>
        ))}
      </div>
    
</section>
    );
};

export default Features;
