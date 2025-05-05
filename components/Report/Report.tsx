"use client";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";

export function ReportComponent({ report }: { report: string }) {
    const [signin, setSignin] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Maneja el envío del formulario
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSignin(true);

        try {
            await FetchReportBook(report, startDate, endDate);
        } catch (error) {
            console.error("Error al generar el reporte", error);
        } finally {
            setSignin(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Fecha de inicio */}
                <div className="flex flex-col gap-2">
                    <div className="mb-2 block">
                        <Label htmlFor="inicio">Fecha Inicio</Label>
                    </div>
                    <TextInput
                        id="inicio"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                {/* Fecha de fin */}
                <div className="flex flex-col gap-2">
                    <div className="mb-2 block">
                        <Label htmlFor="fin">Fecha Fin</Label>
                    </div>
                    <TextInput
                        id="fin"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                {/* Fecha de fin */}
                {/* <div className="flex flex-col gap-2">
                    <div className="mb-2 block">
                        <Label htmlFor="fin">Fecha Fin</Label>
                    </div>
                    <Select
                        id="tipo"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    >
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
                </div> */}
            </div>
            {/* Botón de reporte */}
            <Button
                aria-label="Reporte"
                type="submit"
                className="bg-red-600"
                isProcessing={signin}
                processingSpinner={<AiOutlineLoading className="size-6 animate-spin" />}
            >
                Generar Reporte
            </Button>
        </form>
    );
}

const FetchReportBook = async (report: string, startDate: string, endDate: string) => {
    const api = `/api/reports?page=${report}&startDate=${startDate}&endDate=${endDate}`;
    const res = await fetch(api);

    if (!res.ok) {
        console.error('Error al descargar el reporte');
        throw new Error('Error al descargar el reporte');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    window.URL.revokeObjectURL(url);
};
