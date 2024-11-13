"use client"
import { Avatar, Button, Card, DarkThemeToggle, Dropdown, Navbar, Select, Tabs, TextInput } from "flowbite-react";
import { FaWhatsapp, FaYoutube, FaFacebook } from "react-icons/fa";

import Image from "next/image";
import Link from "next/link";
import { HiBookOpen } from "react-icons/hi";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { BookFormData } from "./dashboard/books/Interface/Interface";
import { ComponentPagination } from "@/components/Pagination/Pagination";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';
import { InvoicesCardPageSkeleton } from "@/components/Skeleton/skeletons";

interface propsSelect {
  size: number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
const pageSizeOptions = [3, 6, 9];
interface dashProps {
  title: string;
  href: string;
  count: number
}
export default function Home({ searchParams }: {
  searchParams: {
    query?: string;
  }
}) {
  return (
    <main className="dark:bg-gray-700">
      <ComponentNavbar />
      <ComponentHeader />
      <ComponentContent />
      <ComponentTabs searchQuery={searchParams.query} />
      <ComponentFooter />
    </main>
  );
}

function ComponentContent() {
  return (
    <section className="w-full bg-gray-100 py-9 text-center dark:bg-gray-800 md:py-6 lg:py-20">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter dark:text-white sm:text-4xl md:text-5xl">Contenido</h2>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 self-center p-5  max-sm:justify-items-center sm:grid-cols-2 lg:grid-cols-4">
        <CardDashboard title="Libros" href="" count={1000} />
        <CardDashboard title="Contenido" href="" count={1000} />
        <CardDashboard title="Contenido" href="" count={1000} />
        <CardDashboard title="Contenido" href="" count={1000} />
      </div>
    </section>
  )
}
function ComponentTabs({ searchQuery }: { searchQuery: any }) {
  const [type, setType] = useState("");
  const [size, setSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, page } = FetchDataBook(size, currentPage, searchQuery, type);
  console.log(searchQuery);
  console.log(data);
  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSize = Number(event.target.value)
    setSize(selectedSize);
    setCurrentPage(1);
  };
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value);
    setCurrentPage(1);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <section className="w-full py-12 md:py-9 lg:py-16 " id="publicacion">
      <Tabs className=" mx-auto max-w-7xl select-none items-center justify-center " aria-label="Default tabs" style="underline"  >
        <Tabs.Item active title="Libros" icon={HiBookOpen} className="dark:text-white">
          <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter dark:text-white sm:text-4xl md:text-5xl">
                Explora Nuestros Libros
              </h2>
              <div className="mx-auto text-gray-500  dark:text-gray-400 max-sm:max-w-[calc(100%-1rem)] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                <div className="grid grid-cols-7 gap-2">
                  <div className="col-span-5 ">
                    <ComponentSearch onChange={handleSizeChange} size={size} />
                  </div>
                  <Select onChange={handleTypeChange} className="col-span-2 py-2">
                    <option value="">Todo</option>
                    <option value="LIBRO" > LIBRO</option>
                    <option value="PARTITURA" > PARTITURA</option>
                    <option value="DVD" > DVD</option>
                    <option value="CD" > CD</option>
                    <option value="CASSETTE" > CASSETTE</option>
                    <option value="TESIS" > TESIS</option>
                    <option value="REVISTA" > REVISTA</option>
                    <option value="EBOOK" > EBOOK</option>
                    <option value="AUDIO LIBRO" > AUDIO LIBRO</option>
                    <option value="PROYECTOS" > PROYECTOS</option>
                    <option value="OTRO" > OTRO</option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid gap-4 text-start max-lg:grid-cols-4 max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <CardInventario data={data} />
            </div>
            <ComponentPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={page} />
          </div>
        </Tabs.Item>
      </Tabs>
    </section>
  )
}
const CardInventario = ({ data }: { data: BookFormData[] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasNoResults, setHasNoResults] = useState(false);

  useEffect(() => {
    if (!data || data.length === 0) {
      const timer = setTimeout(() => {
        setHasNoResults(true);
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setHasNoResults(false);
    }
  }, [data]);

  if (isLoading) {
    return <InvoicesCardPageSkeleton />;

  }

  if (hasNoResults) {
    return (
      <Card className="col-span-full">
        <p className="text-gray-600">No se encontro contenido.</p>
      </Card>
    );
  }

  return (
    <>
      {data?.map((book, index) => (
        <div key={index}>
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="flex">
              <Image
                src="/svg/placeholder.svg"
                alt="Program Cover"
                width={60}
                height={70}
                className="h-36 w-24 rounded-s-md object-cover max-sm:h-44 max-sm:w-32"
              />
              <div className="ml-4 py-2 pe-3">
                <h1 className="text-lg font-semibold">{book.book_title_original}</h1>
                <h5 className="text-sm text-gray-600">{book.book_title_parallel}</h5>
                <div className="mt-2 text-gray-600">
                  {book?.book_authors?.map((author, index) => (
                    <h5 key={index} className="text-sm">{author.author_name}</h5>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
const ComponentSearch = ({ onChange, size }: propsSelect) => {
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
        className="w-full flex-1 rounded-lg border focus:border-verde-500 focus:outline-none focus:ring-2"
        type="text"
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(event) => handleSerch(event.target.value)}
        placeholder="Buscar..."
      />
      <Select onChange={onChange} value={size}>
        {
          pageSizeOptions.map(pageSize => (
            <option key={pageSize}>{pageSize}</option>
          ))
        }
      </Select>
    </div>
  )
}
const FetchDataBook = (size: number, currentPage: number, query: string, type: string) => {
  const [data, setData] = useState<BookFormData[] | []>([])
  const [page, setPage] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/api/books?query=${query || ""}&page=${currentPage}&size=${size}&type=${type}`;
        const res = await fetch(url);
        const result = await res.json();
        console.log(result);
        setData(result.data);
        setPage(result.totalPages)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, size, query, type]);
  return { data, page }
}
function CardDashboard({ title, count, href }: dashProps) {
  return (
    <Card href={href} className="max-w-sm max-sm:px-32">
      <h5 className="text-base font-normal normal-case tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="text-3xl font-bold text-gray-700 dark:text-gray-400">
        {count}
      </p>
    </Card>
  )
}
function ComponentHeader() {
  return (
    <section className="w-full pt-12 max-sm:pt-24 sm:pt-24 md:pt-24 lg:pt-32 ">
      <div className="space-y-10 px-4 md:px-6 xl:space-y-16">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 md:gap-16 md:px-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter dark:text-white sm:text-4xl md:text-5xl lg:leading-tight xl:text-[3.4rem] 2xl:text-[3.75rem]">
              Biblioteca digital del Conservatorio Plurinacional de Musica
            </h1>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <h5 className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
              Explora nuestro vasto acervo de libros, que abarca todas las disciplinas y tradiciones culturales, resguardado por expertos bibliotecarios y situado en instalaciones acogedoras que invitan al aprendizaje y la investigación.
            </h5>
            <div className="space-x-4">
              <Link
                href="#publicacion"
                className="inline-flex h-9 items-center justify-center rounded-md bg-verde-700 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-verde-600/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                prefetch={false}
              >
                Explora Mas
              </Link>
              <Link
                href="#"
                className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white  px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                prefetch={false}
              >
                Admissions
              </Link>
            </div>
          </div>
        </div>
        <Image
          src={"/imagenes/piano.png"}
          width="1270"
          height="300"
          alt="Hero"
          className="mx-auto aspect-[3/1] overflow-hidden rounded-t-xl object-cover"
        />
      </div>
    </section>
  )
}
function ComponentNavbar() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      if (currentScrollTop > lastScrollTop) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      setLastScrollTop(currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);
  return (
    <Navbar className={`fixed top-0 z-50 m-1 w-[calc(100%-1rem)] rounded-xl bg-verde-700 text-white transition-transform duration-300 ease-in-out sm:w-[calc(100%-1rem)] ${isNavbarVisible ? 'translate-y-0' : '-translate-y-20'}`} rounded>
      {/* <Navbar.Toggle className="text-white hover:bg-verde-600" /> */}
      <Navbar.Brand >
        <Image alt="concer_logo" src="/imagenes/logo_cpm.png" className="mr-1" width={40} height={40} />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Biblioteca</span>
      </Navbar.Brand>
      <NavbarDropdown />
    </Navbar>
  )
}

function NavbarDropdown() {
  type Role = 'ADMIN' | 'ROOT' | 'USUARIO' | 'ESTUDIANTE';

  const { data: session, status } = useSession()
  if (status === "unauthenticated") {
    return (
      <div className="flex gap-2">
        <DarkThemeToggle className="text-white ring-verde-400 hover:bg-verde-600 hover:text-amber-100 "></DarkThemeToggle>
        <Button
          className="bg-verde-600 text-white ring-verde-400 transition-colors duration-200 hover:bg-verde-500 hover:text-amber-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-700 dark:hover:ring-gray-600"
          onClick={() => signIn()}
        >
          Iniciar sesión
        </Button>
      </div>
    )
  }

  const user = session?.user?.name
  const email = session?.user?.email
  const rol = session?.user?.rols as Role | undefined; // Asegúrate de que rol es de tipo Role o undefined

  const roleToHref = {
    ADMIN: "/dashboard",
    ROOT: "/dashboard",
    USUARIO: "/profile",
    ESTUDIANTE: "/profile",
  };
  const settingToHref = {
    ADMIN: "/dashboard/settings",
    ROOT: "/dashboard/settings",
    USUARIO: "/profile/settings",
    ESTUDIANTE: "/profile/settings",
  };
  const Dashboard = typeof rol === 'string' && rol in roleToHref ? roleToHref[rol] : "/";
  const Setting = typeof rol === 'string' && rol in settingToHref ? settingToHref[rol] : "/";

  return (
    <Dropdown
      arrowIcon={false}
      inline
      label={
        <Avatar alt="User settings" img="" rounded />
      }
    >
      <Dropdown.Header>
        <span className="block text-sm">{user}</span>
        <span className="block truncate text-sm font-medium">{email}</span>
      </Dropdown.Header>
      <Dropdown.Item
        as={Link}
        href={Dashboard}
      >
        Inicio
      </Dropdown.Item>
      < Dropdown.Item as={Link} href={Setting}>Ajustes</Dropdown.Item >
      <Dropdown.Divider />
      <Dropdown.Item onClick={() => signOut()}>Cerrar sesión</Dropdown.Item>
    </Dropdown >
  )
}
function ComponentFooter() {
  return (
    <footer className="w-full bg-gray-200 p-6 dark:bg-gray-500 dark:text-white md:py-12" id="contactos">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-8 text-sm sm:grid-cols-2 md:grid-cols-4">
        <div className="flex items-center gap-2">
          <Image alt="concer_logo" src="/imagenes/coplumu.png" width={5000} height={60} />
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Navigation</h3>
          <Link href="#" prefetch={false}>
            Home
          </Link>
          <Link href="#" prefetch={false}>
            About
          </Link>
          <Link href="#" prefetch={false}>
            Contact
          </Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Legal</h3>
          <Link href="#" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" prefetch={false}>
            Privacy Policy
          </Link>
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Social</h3>
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <FaYoutube className="size-4" />
            YouTube
          </Link>
          <Link href="https://www.facebook.com/COPLUMU/?locale=es_LA" className="flex items-center gap-2" prefetch={false}>
            <FaFacebook className="size-4" />
            Facebook
          </Link>
          <Link href="https://api.whatsapp.com/send?phone=62523239&text=Hola%20Coplumu" className="flex items-center gap-2" prefetch={false}>
            <FaWhatsapp className="size-4" />
            Whatsapp
          </Link>
        </div>
      </div>
      <div className="container mx-auto mt-8 grid max-w-7xl text-xs">
        &copy; 2024 Concervatorio plurinacional de musica
      </div>
    </footer>
  )
}