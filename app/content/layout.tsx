import { ComponentNavbar } from "@/components/Home/Navbar"

export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex flex-col dark:bg-gray-600">
            <ComponentNavbar />
            <div className="mx-auto mt-20 flex w-full  max-w-7xl  flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-1">
                    {children}
                </main>
            </div>
        </section>
    )
}