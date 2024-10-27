import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <h1 className="mb-4 text-4xl font-bold text-gray-800">404 - No Encontrado</h1>
            <p className="mb-8 text-xl text-gray-600">Lo sentimos, la página que buscas no existe.</p>
            <Link href="/profile" className="rounded bg-verde-500 px-4 py-2 text-white transition-colors hover:bg-verde-600">
                Volver al Inicio
            </Link>
        </div>
    )
}