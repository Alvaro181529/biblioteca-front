"use client";
import { Label } from 'flowbite-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
// Cargar ReactApexChart solo en el lado del cliente

export default function Analytics() {
    const [options, setOptions] = useState({
        chart: {
            type: 'line' as 'line', // Asegúrate de usar el tipo literal
            height: 350
        },
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
    });

    const [series, setSeries] = useState([{
        name: 'sales',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
    }]);

    return (
        <div>
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <Label >Registro de libros</Label>
                    <Chart options={options} series={series} type="line" height={250} />
                </div>
                <div>
                    <Label >Libros mas solicitados</Label>
                    <Chart options={options} series={series} type="line" height={350} />
                </div>
            </div>
        </div>
    );
}
