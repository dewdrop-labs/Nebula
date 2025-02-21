export default function Footer() {
    return (
        <footer className="bg-[#D9D9D9] pt-[57px] pb-[18px] lg:px-[61px] px-[15px]">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-[25%]">
                <div className="">
                    <h3 className="text-[23px] mb-[18px]">Nebula</h3>
                    <p className="font-light">Fast, secure, and privacy-focused transfers—sending money has never been
                        this safe and effortless.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-[16px] lg:mt-0 mt-[25px]">
                    <div className="">
                        <h4 className="text-[16px] mb-[20px]">Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Blog</a></li>
                        </ul>
                    </div>
                    <div className="">
                        <h4 className="text-[16px] mb-[20px]">Legal</h4>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of use</a></li>
                            <li><a href="#">FAQs</a></li>
                        </ul>
                    </div>
                    <div className="">
                        <h4 className="text-[16px] mb-[20px]">Contact Us</h4>
                        <ul>
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">LinkedIn</a></li>
                            <li><a href="#">Instagram</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="text-center pt-[58px]">&copy; 2025 Nebula. All Rights Reserved</div>
        </footer>
    )
}