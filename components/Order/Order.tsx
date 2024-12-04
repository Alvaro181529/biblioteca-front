// components/OrderCard.js
import React from "react";
import { Card, Badge, Button } from "flowbite-react"; // Si usas Flowbite
import { RiCalendarLine, RiBookFill } from "react-icons/ri"; // Íconos de react-icons
import { importanceColor, importanceColorMap } from "./Interface/type";
import { useRouter } from "next/navigation";
import { Orders, Respuest } from "@/interface/Interface";
import { toast } from "sonner";
import { orderBorrowed } from "@/lib/updateOrder";

interface PropsOrder {
    order: Orders,
    index: number,
    page: number,
    size: number,
    handleCancelar: (id: number) => void;
}
const OrderCard = ({ order, index, page, size, handleCancelar }: PropsOrder) => {
    const router = useRouter()
    const handleView = (id: number) => {
        router.push(`content/${id}`);
    };
    const badgeColor = importanceColorMap[String(order.order_status)] || 'default';
    const lineColor = importanceColor[String(order.order_status)] || 'default';

    return (
        <Card key={index} className="relative overflow-hidden dark:text-white" >
            <div className={`absolute left-0 top-0 h-full w-2 ${lineColor}`} />
            < div className="flex items-center justify-between" >
                <h2 className="text-lg font-semibold dark:text-white" >
                    Orden # {(page - 1) * size + index + 1}
                </h2>
                <div>
                    < Badge color={badgeColor} className="rounded-lg" >
                        {order.order_status}
                    </Badge>

                </div>
            </div>
            < div className="flex items-center justify-between text-sm text-gray-600" >
                <div className="flex items-center">
                    <RiCalendarLine className="mr-2 size-4 dark:text-gray-400" />
                    <span className="dark:text-gray-400" >
                        {new Date(order.order_at).toLocaleDateString()}
                    </span>
                </div>
                {order.order_status === 'ESPERA' && (
                    <Button color="failure" pill className="text-white" size="xs" onClick={() => handleCancelar(order.id)}>Cancelar</Button>
                )}
            </div>
            {
                order.books.map((book, bookIndex) => (
                    <Card
                        key={bookIndex}
                        className="cursor-pointer"
                        onClick={() => handleView(Number(book.id))}
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
