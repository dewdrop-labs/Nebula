export default function HowItWorks() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 bg-white text-black p-4 rounded-lg font-montserrat">
      <div className="flex flex-col justify-center items-center space-y-4">
        <h2 className="text-4xl font-bold text-center">How It Works</h2>
        <p className="text-center text-[#302F2F] font-light">
          This platform works with the following steps
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-[#FF533D] text-4xl font-extrabold">1</p>
          <p className="text-center text-lg">
            Sign Up Securely → (Minimal info required, no invasive data
            collection)
          </p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-[#10CA57] text-4xl font-extrabold">2</p>
          <p className="text-center text-lg">
            Add & Transfer Funds → (End-to-end encrypted transactions)
          </p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-[#3D46FF] text-4xl font-extrabold">3</p>
          <p className="text-center text-lg">
            Enjoy Seamless, Private Payments → (No tracking, full anonymity)
          </p>
        </div>
      </div>
    </div>
  );
}
