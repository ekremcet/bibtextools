import Image from "next/image";

export const LogoHeader = () => {
    return (
        <div className="flex items-center justify-center space-x-2 p-4">
            <a href="/" className="flex items-center justify-center space-x-2 hover:shadow-md p-2">
                <Image src={"/icon.png"} width={32} height={32} alt={"BibTeX Tools Icon"}/>
                <p className="font-bold">BibTeX Tools</p>
            </a>
        </div>
    )
}