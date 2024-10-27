import { Pagination } from "flowbite-react";

interface ComponentPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function ComponentPagination({ currentPage, totalPages, onPageChange }: ComponentPaginationProps) {

    return (
        <div className="flex overflow-x-auto sm:justify-center">
            <Pagination
                layout="pagination"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                previousLabel="Atras"
                nextLabel="Adelante"
                showIcons
            />
        </div>
    );
}
