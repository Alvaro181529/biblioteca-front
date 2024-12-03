"use client"
import { ComponentCard } from "@/components/Card"
import { useEffect, useState } from "react"

export default function ContentsPage() {
    return (
        <Contents />
    )
}

const Contents = () => {
    const { data: contLibro } = ContentData("LIBRO")
    const { data: contDVD } = ContentData("DVD")
    const { data: contCD } = ContentData("CD")
    const { data: contCasset } = ContentData("CASSETTE")
    const { data: contRevista } = ContentData("REVISTA")
    const { data: contEbook } = ContentData("EBOOK")
    const { data: contAudio } = ContentData("AUDIO LIBRO")
    const { data: contTesis } = ContentData("TESIS")
    const { data: contProyectos } = ContentData("PROYECTOS")
    const { data: contPartitura } = ContentData("PARTITURA")
    const { data: contOtro } = ContentData("OTRO")
    return (
        <div className="mb-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <ComponentCard count={Number(contLibro)} title="LIBRO" href="" />
            <ComponentCard count={Number(contDVD)} title="DVD" href="" />
            <ComponentCard count={Number(contCD)} title="CD" href="" />
            <ComponentCard count={Number(contCasset)} title="CASSETTE" href="" />
            <ComponentCard count={Number(contRevista)} title="REVISTA" href="" />
            <ComponentCard count={Number(contEbook)} title="EBOOK" href="" />
            <ComponentCard count={Number(contAudio)} title="AUDIO LIBRO" href="" />
            <ComponentCard count={Number(contTesis)} title="TESIS" href="" />
            <ComponentCard count={Number(contProyectos)} title="PROYECTOS" href="" />
            <ComponentCard count={Number(contPartitura)} title="PARTITURA" href="" />
            <ComponentCard count={Number(contOtro)} title="OTROS" href="" />
        </div>
    )
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