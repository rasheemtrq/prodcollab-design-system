import Image from "next/image";
import Link from "next/link";

export default function CardLink() {
    return (
        <Link href="/ui-library" className="flex flex-col gap-6 bg-secondary pl-8 py-8 rounded-3xl">
            <div className="flex flex-col">
                <h2 className="text-lg font-normal">Explore our library of components.</h2>
                <h2 className="text-lg font-normal text-secondary">Buttons. Cards. Forms. Icons. More.</h2>
            </div>
            <Image
            src="/images/thumbnail-img.svg"
            width={900}
            height={600}
            alt="Card link"
            />
        </Link>
    );
}