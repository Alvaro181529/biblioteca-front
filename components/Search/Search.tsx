import { Select, TextInput } from "flowbite-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';

interface propsSelect {
    size: number;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
const pageSizeOptions = [5, 10, 25, 50, 100];
export function ComponentSearch({ onChange, size }: propsSelect) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const handleSerch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        replace(`${pathname}?${params}`)
    }, 320)



    return (
        <div className="flex flex-row items-center gap-2 py-2">
            <TextInput
                className="flex-1 rounded-lg border focus:border-verde-500 focus:outline-none focus:ring-2"
                type="text"
                defaultValue={searchParams.get('query')?.toString()}
                onChange={(event) => handleSerch(event.target.value)}
                placeholder="Buscar..."
            />
            <Select onChange={onChange} value={size} aria-label="Size">
                {
                    pageSizeOptions.map(pageSize => (
                        <option key={pageSize}>{pageSize}</option>
                    ))
                }
            </Select>
        </div>
    )
}