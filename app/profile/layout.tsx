import { ComponentNavbar } from "@/components/Navbar/Navbar"
import { ComponentSidebar } from "@/components/Sidebar/Sidebar"
import AuthRols from "@/app/auth/auth"

export default async function DashboardLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode
}) {
    const session = await AuthRols();
    return (
        <section className="flex h-screen flex-col dark:bg-gray-800">
            <header>
                <ComponentNavbar rol={String(session)} />
            </header>

            <div className="flex flex-1 overflow-hidden max-sm:mt-16">
                <ComponentSidebar rol={String(session)} />
                <main className="flex-1 overflow-y-auto p-1">
                    {children}
                </main>
            </div>
        </section>
    )
}