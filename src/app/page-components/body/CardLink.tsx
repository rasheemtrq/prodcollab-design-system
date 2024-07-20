import Image from "next/image";
import Link from "next/link";

export default function CardLink() {
    return (
        <Link href="/components/accordion" className="flex flex-col gap-6 bg-primary border border-secondary rounded-3xl">
            {/* <div className="flex flex-col">
                <h2 className="text-lg font-normal">Explore our library of components.</h2>
                <h2 className="text-lg font-normal text-secondary">Buttons. Cards. Forms. Icons. More.</h2>
            </div> */}
            <Image
            src="/images/prodcollab-thumbnail.png"
            width={1000}
            height={720}
            alt="Card link"
            />
        </Link>
    );
}