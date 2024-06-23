import Image from "next/image";
import Link from "next/link";

export default function BrandLink() {
    return (
        <Link href="/" className="flex flex-row justify-starts items-center gap-2">
            <Image 
              src="/images/logo-256.png"
              alt="Picture of the Brand"
              width={64}
              height={64}
            />
            <div>
              <p className="tracking-tight">ProdCollab</p>
              <p className="text-xs text-gray-400">Design System</p>
            </div>
        </Link>
    );
}