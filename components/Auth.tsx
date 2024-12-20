import Image from "next/image";
import Link from "next/link";
import { BsArrowLeftCircle } from "react-icons/bs";
export default function AuthComponent({ href, children }: { href?: string, children: React.ReactNode }) {

    return (
        <main className=" h-full bg-verde-700 dark:bg-gray-800">
            <div className="h-screen w-screen">
                <div className="flex h-full flex-1 flex-col items-center justify-center px-4 sm:px-0">
                    <div className="flex w-full rounded-lg bg-white shadow-2xl shadow-black dark:bg-gray-700 sm:mx-0 sm:w-3/4 lg:w-1/2" style={{ height: "500px" }}>
                        <div className="flex w-full flex-col p-4 md:w-1/2">
                            <Link href={href || "/"} className="mx-4 my-2 flex size-7 items-center dark:text-white">
                                <BsArrowLeftCircle className="size-8 text-gray-600 dark:text-gray-300 " />
                            </Link>
                            <div className="mb-8 flex flex-1 flex-col justify-center">
                                {children}
                            </div>
                        </div>
                        <Image
                            src={"/imagenes/concer.png"}
                            className={"hidden rounded-r-lg bg-cover bg-center bg-no-repeat md:block md:w-1/2"}
                            width={1000}
                            height={1000}
                            alt={"consevatorio"}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
