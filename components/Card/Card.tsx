import { Card } from "flowbite-react"
interface dashProps {
    title: string;
    href: string;
    count: number
}
export const ComponentCard = ({ title, count, href }: dashProps) => {
    return (
        <Card href={href} className="relative w-full">
            <div className="absolute inset-x-0 top-0 h-1 rounded-t bg-verde-400 p-0.5 dark:bg-gray-500"></div>
            <h5 className="text-lg font-normal capitalize text-gray-600 dark:text-white">
                {title}
            </h5>
            <p className="text-4xl font-bold text-gray-700 dark:text-gray-400">
                {count}
            </p>
        </Card>
    )
}
