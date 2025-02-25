interface StatItemProps {
    value: string
    label: string
  }
  
  function StatItem({ value, label }: StatItemProps) {
    return (
      <div className="text-center">
        <div className="text-4xl md:text-5xl font-bold text-[#3D46FF] mb-2">{value}</div>
        <div className="text-sm md:text-base text-[#3D46FF]">{label}</div>
      </div>
    )
  }
  
  export function StatsSection() {
    return (
      <div className="relative border-none z-20 mt-20 py-7 bg-white md:mt-40 shadow-lg rounded-t-[3rem]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <StatItem value="150K" label="Happy Clients" />
          <StatItem value="80K" label="Successful Transfers" />
          <StatItem value="280K" label="Transactions Secured" />
          <StatItem value="1500+" label="Partners Worldwide" />
        </div>
      </div>
    );
  }
  
  
  