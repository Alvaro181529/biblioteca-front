import { ComponentNavbar } from "@/components/Navbar/Navbar"
import { ComponentSidebar } from "@/components/Sidebar/Sidebar"


export default function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex h-screen flex-col dark:bg-gray-800">
            <header>
                <ComponentNavbar rol={true} />
            </header>

            <div className="flex flex-1 overflow-hidden">
                <ComponentSidebar rol={true} />
                <main className="flex-1 overflow-y-auto p-1">
                    {children}
                </main>
            </div>
        </section>
    )
}