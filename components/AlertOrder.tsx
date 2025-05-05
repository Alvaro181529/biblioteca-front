import { toast } from "sonner";

export function AlertOrder(n: number) {
    if (n > 0) {
        toast.info('Prestamos', {
            description: n + ' Prestamos encontrados',
            position: "top-center",
        });
    }
}