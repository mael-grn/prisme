import Image from "next/image";

export default function DefaultDashboardSubpage() {
    return <div className={"flex flex-col gap-4 items-center flex-1 justify-center w-full h-full"}>
        <Image width={100} height={100} src={"/illustrations/empty.png"} alt="icon"/>
        <h1 className={"font-bold text-3xl"}>Sorry, this is not available for the moment</h1>
        <p>This project is still in development. Please come back later.</p>
    </div>
}