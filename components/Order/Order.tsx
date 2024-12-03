// components/OrderCard.js
import React from "react";
import { Card, Badge } from "flowbite-react"; // Si usas Flowbite
import { RiCalendarLine, RiBookFill } from "react-icons/ri"; // Íconos de react-icons
import { importanceColor, importanceColorMap } from "./Interface/type";
import { Orders } from "@/interface/Interface";
interface PropsOrder {
    order: Orders,
    index: number,
    page: number,
    size: number,
    handleView: (id: number) => void
}
const OrderCard = ({ order, index, page, size, handleView }: PropsOrder) => {
    // Calcular el color del badge y la línea según el estado de la orden
    const badgeColor = importanceColorMap[String(order.order_status)] || 'default';
    const lineColor = importanceColor[String(order.order_status)] || 'default';

    return (
        <Card key={index} className="relative overflow-hidden dark:text-white" >
            <div className={`absolute left-0 top-0 h-full w-2 ${lineColor}`} />
            < div className="flex items-center justify-between" >
                <h2 className="text-lg font-semibold dark:text-white" >
                    Orden # {(page - 1) * size + index + 1}
                </h2>
                < Badge color={badgeColor} className="rounded-lg" >
                    {order.order_status}
                </Badge>
            </div>
            < div className="flex items-center text-sm text-gray-600" >
                <RiCalendarLine className="mr-2 size-4 dark:text-gray-400" />
                <span className="dark:text-gray-400" >
                    {new Date(order.order_at).toLocaleDateString()}
                </span>
            </div>
            {
                order.books.map((book, bookIndex) => (
                    <Card
                        key={bookIndex}
                        className="cursor-pointer"
                        onClick={() => handleView(Number(order.id))}
                    >
                        <div className="flex items-center" >
                            <RiBookFill className="mr-2 size-5 dark:text-gray-400" />
                            <div>
                                <p className="font-medium" > {book.book_title_original} </p>
                                {
                                    book.book_title_parallel && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400" >
                                            {book.book_title_parallel}
                                        </p>
                                    )
                                }
                            </div>
                        </div>
                    </Card>
                ))}
        </Card>
    );
};

export default OrderCard;
