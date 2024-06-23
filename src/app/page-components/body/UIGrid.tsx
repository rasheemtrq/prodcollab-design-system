import Image from "next/image";
import Link from "next/link";

export default function UIGrid() {
    return (
        <div className="grid grid-cols-4 grid-rows-2 gap-4">
            <Link
                href="/ui-library/elements"
                className="flex flex-col justify-between background-low w-full h-[12rem] p-4 rounded-2xl border border-secondary overflow-hidden relative">
                <Image
                    src="/images/button-image.png"
                    alt="Thumbnail for button component"
                    layout="fill"
                    objectFit="cover"
                    className="absolute z-0"
                />
                <p className="text-white z-10">Elements</p>
            </Link>
            <Link
                href="/ui-library/web-blocks"
                className="flex flex-col justify-between background-low w-full h-[12rem] p-4 rounded-2xl border border-secondary overflow-hidden relative">
                <Image
                    src="/images/web-block-thumbnail.png"
                    alt="Thumbnail for button component"
                    layout="fill"
                    objectFit="cover"
                    className="absolute z-0"
                />
                <p className="text-white z-10">Web Blocks</p>
            </Link>
        </div>
    );
}
