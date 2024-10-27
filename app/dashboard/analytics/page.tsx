"use client";

import { Label } from 'flowbite-react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Cargar Chart de forma dinámica
const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false
});

interface ChartOptions {
    chart: {
        type: 'line';
        height: number;
    };
    xaxis: {
        categories: number[];
    };
}

interface SeriesData {
    name: string;
    data: number[];
}

export default function Analytics() {
    const [options, setOptions] = useState<ChartOptions | null>(null);
    const [series, setSeries] = useState<SeriesData[] | null>(null);

    useEffect(() => {
        setOptions({
            chart: {
                type: 'line',
                height: 350
            },
            xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
            }
        });

        setSeries([{
            name: 'sales',
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
        }]);
    }, []);

    if (!options || !series) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <Label>Registro de libros</Label>
                    <Chart options={options} series={series} type="line" height={250} />
                </div>
                <div>
                    <Label>Libros más solicitados</Label>
                    <Chart options={options} series={series} type="line" height={350} />
                </div>
            </div>
        </div>
    );
}
