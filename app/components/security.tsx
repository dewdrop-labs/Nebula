import Image from "next/image";

export default function Security() {
    return (
        <section className="py-[41px] md:px-20 px-8 justify-center grid gap-y-[25px]">
            <div className="text-center">
                <h3 className="font-bold text-3xl">Security & Privacy Commitment</h3>
                <p className="font-light">Your Security, Our Priority</p>
            </div>
            <Image className="mx-auto" src="/security.png" alt="security" width={388} height={250}/>
            <ul className="text-lg list-disc">
                <li>Uses blockchain or other advanced encryption methods.</li>
                <li>Zero-knowledge transactions—Nebula doesn’t store your data.</li>
                <li>Secure authentication (e.g., biometric login, 2FA).</li>
            </ul>
        </section>
    );
}