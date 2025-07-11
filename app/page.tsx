"use client"
import { Card, Select, Tabs, TextInput } from "flowbite-react";
import { FaWhatsapp, FaYoutube, FaFacebook } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { HiBookOpen } from "react-icons/hi";

import { useEffect, useState } from "react";
import { BookFormData, Publication } from "@/interface/Interface";
import { ComponentPagination } from "@/components/Pagination";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from 'use-debounce';
import { InvoicesCardPageSkeleton, InvoicesCardSkeleton } from "@/components/skeletons";
import { ComponentNavbar } from "@/components/Home/Navbar";
import { isValidUrl } from "@/lib/validateURL";
import Head from "next/head";
import ChatBot from "@/components/chat/chatbot";

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
    <div>
      <Head>
        <title>BIBLIOTECA - COPLUMU</title>
        <meta name="description" content="Accede a la biblioteca digital del Conservatorio Plurinacional de Música de Bolivia" />
        <meta name="keywords" content="biblioteca, música, Bolivia, cultura, conservatorio" />
        <meta name="author" content="Coplumu Team" />
        <meta name="robots" content="index, follow" />

        x        <link rel="icon" href="/imagenes/logo_cpm.png" />
        <link rel="apple-touch-icon" href="/imagenes/logo_cpm.png" />
        <link rel="shortcut icon" href="/imagenes/logo_cpm.png" />
      </Head>
      <main className="dark:bg-gray-700">
        <ComponentNavbar />
        <ComponentHeader />
        <ComponentContent />
        <ComponentPublications />
        <ComponentTabs searchQuery={searchParams.query} />
        <ComponentUbication />
        <ChatBot />
        <ComponentFooter />
      </main>
    </div>
  );
}

function ComponentContent() {
  const { data: contLibro } = ContentData("LIBRO")
  const { data: contRevista } = ContentData("REVISTA")
  const { data: contDVD } = ContentData("DVD")
  const { data: contCD } = ContentData("CD")
  const { data: contCasset } = ContentData("CASSETTE")
  const { pages } = FetchDataPublications()
  const multimediaTotal = Number(contCD) + Number(contDVD) + Number(contCasset)
  return (
    <section className="w-full bg-gray-100 py-9 text-center dark:bg-gray-800 md:py-6 lg:py-20">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter dark:text-white sm:text-4xl md:text-5xl">Contenido</h2>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 p-5 sm:grid-cols-2  sm:self-center lg:grid-cols-4">
        <CardDashboard title="Revistas" href="" count={Number(contRevista)} />
        <CardDashboard title="Libros" href="" count={Number(contLibro)} />
        <CardDashboard title="Publicaciones" href="" count={Number(pages)} />
        <CardDashboard title="Multimendia" href="" count={multimediaTotal} />
      </div>
    </section>
  )
}
function ComponentTabs({ searchQuery }: { searchQuery: any }) {
  const [type, setType] = useState("");
  const [size, setSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, page } = FetchDataBook(size, currentPage, searchQuery, type);
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
    <section className="w-full bg-gray-100  py-12 dark:bg-gray-800 md:py-9 lg:py-16" id="libros">
      <Tabs className=" mx-auto max-w-7xl select-none items-center justify-center " aria-label="Default tabs" style="underline"  >
        <Tabs.Item active title="Libros" icon={HiBookOpen} className="dark:text-white">
          <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter dark:text-white sm:text-4xl md:text-5xl">
                Explora Nuestro Contenido
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
            <div className="grid grid-cols-2 gap-4 text-start sm:grid-cols-2 xl:grid-cols-3 ">
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
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  useEffect(() => {
    if (!Array.isArray(data)) {
      const timer = setTimeout(() => {
        setHasNoResults(true);
        setIsLoading(false);
      }, 1500);
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
      {Array.isArray(data) && data?.map((book, index) => {
        const imageUrl = String(book?.book_imagen);
        const imageSrc = isValidUrl(imageUrl)
          ? imageUrl // Si es una URL válida, usamos la URL
          : imageUrl && imageUrl.toLowerCase() !== "null"  // Si no es "null", pero no es una URL válida, entonces usamos la ruta de la API
            ? `/api/books/image/${imageUrl}`
            : "/svg/placeholder.svg";  // Si no hay imagen, usamos el placeholder

        return (
          <Card key={index} imgSrc={imageSrc} horizontal>
            <div className="ml-4 pe-3">
              <h1 className="text-lg font-semibold dark:text-white ">{book.book_title_original}</h1>
              <h5 className="text-sm text-gray-600 dark:text-white">{book.book_title_parallel}</h5>
              <div className="mt-2 text-gray-600  dark:text-white">
                {Array.isArray(book?.book_authors) && book?.book_authors?.map((author, index) => (
                  <h5 key={index} className="text-sm">{author.author_name}</h5>
                ))}
              </div>
            </div>
          </Card>
        )
      })}
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
    replace(`${pathname}?${params}`, { scroll: false })
  }, 320)

  return (
    <div className="flex flex-row items-center gap-2 py-2">
      <TextInput
        className="w-full flex-1 rounded-lg border focus:border-verde-500 focus:outline-none focus:ring-2"
        type="search"
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


function ComponentPublications() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasNoResults, setHasNoResults] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);  // Estado para saber qué publicación está expandida
  const maxLength = 20;

  const toggleExpand = (index: any) => {
    setExpandedIndex(expandedIndex === index ? null : index);  // Si la publicación está expandida, la colapsamos, si no, la expandimos
  }
  const { data } = FetchDataPublications();
  useEffect(() => {
    if (!Array.isArray(data)) {
      const timer = setTimeout(() => {
        setHasNoResults(true);
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setHasNoResults(false);
    }
  }, [data]);
  if (isLoading) {
    return <InvoicesCardSkeleton />;

  }

  if (hasNoResults) {
    return (
      <Card className="col-span-full">
        <p className="text-gray-600">No se encontro contenido.</p>
      </Card>
    );
  }

  const truncateContent = (content: string, wordLimit: number) => {
    if (!content) {
      return "No hay Contenido";
    }

    const words = content.split(" ");
    const contentWord = words.length > wordLimit
      ? `${words.slice(0, wordLimit).join(" ")} ...`
      : content;
    return <div dangerouslySetInnerHTML={{ __html: contentWord }} />;
  };


  return (
    <div className="mx-auto w-full max-w-7xl py-12 dark:bg-gray-700 md:py-9 lg:py-16" id="publicacion">
      <div className="space-y-4">
        <h2 className="text-center text-3xl font-bold tracking-tighter dark:text-white sm:text-4xl md:text-5xl">Publicaciones</h2>
      </div>
      <section className="mx-auto mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((publication, index) => {

          const imageUrl = String(publication?.publication_imagen);
          const imageSrc = isValidUrl(imageUrl)
            ? imageUrl
            : imageUrl && imageUrl.toLowerCase() !== "null"
              ? `/api/publications/image/${imageUrl}`
              : "";

          return (
            <Card key={index} className="dark:text-white" imgSrc={imageSrc} imgAlt={publication?.publication_title}>
              <h2 className="mb-2 text-xl font-bold">{publication?.publication_title}</h2>
              <div className="prose max-w-none">
                {publication.publication_content.length > maxLength && (
                  <a
                    href={"/blog/" + String(publication?.id)}
                    onClick={() => toggleExpand(index)}  // Pasamos el índice de la publicación a la función
                    className="inline cursor-pointer font-medium text-verde-600 no-underline decoration-solid underline-offset-2 hover:underline dark:text-verde-500"
                  >
                    {truncateContent(publication.publication_content, 15)}
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
function ComponentUbication() {
  return (
    <section className="mx-auto max-w-7xl p-6 py-12  text-center md:py-9 lg:py-16">
      <h2 className="text-center text-3xl font-bold tracking-tighter dark:text-white sm:text-4xl md:text-5xl">
        Ubicación del Conservatorio Plurinacional de Música
      </h2>
      <div className="relative mt-7 grid h-96 overflow-hidden md:h-80 md:grid-cols-5">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.4703408802134!2d-68.13374582493717!3d-16.502335984241743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f206554c4763d%3A0xbd6e3dcf4801f7c7!2sConservatorio%20Plurinacional%20de%20M%C3%BAsica!5e0!3m2!1ses-419!2sbo!4v1685099090420!5m2!1ses-419!2sbo"
          allowFullScreen
          loading="lazy"
          className="size-full rounded-t-lg border-none md:col-span-2 md:rounded-l-lg"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <div className="flex flex-col items-center justify-center text-balance rounded-b bg-gray-100 p-4 text-xl text-gray-600 dark:bg-gray-800 md:col-span-3 md:rounded-r-lg">
          <p className="mb-2 dark:text-gray-400">Nuestra biblioteca se encuentra en el Conservatorio Plurinacional de Música, Sede Central</p>
          <p className="text-2xl text-gray-800 dark:text-gray-200">Reyes Ortiz 56, La Paz</p>
        </div>
      </div>
    </section>
  );
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
                href="#libros"
                className="inline-flex h-9 items-center justify-center rounded-md bg-verde-700 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-verde-600/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                prefetch={false}
              >
                Explora Mas
              </Link>
              <Link
                href="#publicacion"
                className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white  px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                prefetch={false}
              >
                Publicaciones
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

function ComponentFooter() {
  return (
    <footer className="w-full bg-gray-200 p-6 dark:bg-gray-500 dark:text-white md:py-12" id="contactos">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-8 text-sm sm:grid-cols-2 md:grid-cols-4">
        <div className="flex items-center gap-2">
          <Image alt="concer_logo" src="/imagenes/coplumu.png" width={5000} height={60} />
        </div>
        <div className="grid gap-1">
          <h3 className="font-semibold">Navigation</h3>
          <Link href="/" prefetch={false}>
            Inicio
          </Link>
          <Link href="#" prefetch={false}>
            Contenenido
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
      <div className="container mx-auto mt-8 grid max-w-7xl text-center text-xs">
        &copy; 2024 Concervatorio plurinacional de musica
      </div>
    </footer>
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
const FetchDataPublications = () => {
  const [data, setData] = useState<Publication[] | []>([])
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/api/publications?page=1&size=4`;
        const res = await fetch(url);
        const result = await res.json();
        setData(result.data || []);
        setPages(result.totalPages || 0)

      } catch (error) {
        setData([]);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return { data, pages }
}
const ContentData = (type: string) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/api/books?type=${type}`;
        const res = await fetch(url);
        const result = await res.json();
        setData(result.total)
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [type])
  return { data }
}