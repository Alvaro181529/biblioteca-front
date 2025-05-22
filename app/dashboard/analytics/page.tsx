// "use client";

// import { Label } from 'flowbite-react';
// import { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';

// // Cargar Chart de forma dinámica
// const Chart = dynamic(() => import("react-apexcharts"), {
//     ssr: false
// });

// interface ChartOptions {
//     chart: {
//         type: 'line';
//         height: number;
//     };
//     xaxis: {
//         categories: number[];
//     };
// }

// interface SeriesData {
//     name: string;
//     data: number[];
// }

// export default function Analytics() {
//     const [options, setOptions] = useState<ChartOptions | null>(null);
//     const [series, setSeries] = useState<SeriesData[] | null>(null);

//     useEffect(() => {
//         setOptions({
//             chart: {
//                 type: 'line',
//                 height: 350
//             },
//             xaxis: {
//                 categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
//             }
//         });

//         setSeries([{
//             name: 'sales',
//             data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
//         }]);
//     }, []);

//     if (!options || !series) {
//         return <div>Cargando...</div>;
//     }

//     return (
//         <div>
//             <div className='grid grid-cols-2 gap-4'>
//                 <div>
//                     <Label>Registro de libros</Label>
//                     <Chart options={options} series={series} type="line" height={250} />
//                 </div>
//                 <div>
//                     <Label>Libros más solicitados</Label>
//                     <Chart options={options} series={series} type="line" height={350} />
//                 </div>
//             </div>
//         </div>
//     );
// }
"use client";

import { Label } from 'flowbite-react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Analytics, Monthly, BookConditionData, BookCondition, BookTypeValue } from '@/interface/Interface';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AnalyticsComponent() {
    const { data } = useAnaliticsData();
    const { monthly } = useAnaliticsMonthly();
    const { condition } = useAnaliticsCondition();
    const { value } = useAnaliticsValue();
    console.log(value);

    const [options, setOptions] = useState<any>(null);
    const [series, setSeries] = useState<any>(null);
    const [optionsVal, setOptionsVal] = useState<any>(null);
    const [seriesVal, setSeriesVal] = useState<any>(null);
    const [date, setDate] = useState<any>(null);
    const [count, setCount] = useState<any>(null);
    const [conditionOptions, setConditionOptions] = useState<any>({});
    const [conditionSeries, setConditionSeries] = useState<any>({});

    // Procesar datos de libros populares
    useEffect(() => {
        if (data && data.length > 0) {
            const categories = data.map(item => item.book_title_original || "");
            const values = data.map(item => item.book_loan || 0);

            setOptions({
                chart: {
                    type: 'bar',
                    height: 350
                },
                xaxis: {
                    categories,
                    labels: {
                        rotate: -45,
                        style: {
                            fontSize: '12px'
                        }
                    }
                },
                tooltip: {
                    y: {
                        formatter: (val: number) => `${val} préstamos`
                    }
                },
                colors: ['#3357FF']
            });

            setSeries([{
                name: 'Préstamos',
                data: values
            }]);
        }
    }, [data]);

    // Procesar datos de condición de los libros
    useEffect(() => {
        if (condition) {
            const newConditionOptions: any = {};
            const newConditionSeries: any = {};

            // Iterar sobre cada tipo de libro en condition
            Object.keys(condition).forEach((bookType) => {
                const bookConditions = condition[bookType] || [];
                const categories = bookConditions.map((item: BookCondition) => item.book_condition);
                const values = bookConditions.map((item: BookCondition) => item.count);

                newConditionOptions[bookType] = {
                    chart: {
                        type: 'bar',
                        height: 350
                    },
                    xaxis: {
                        categories,
                        labels: {
                            style: {
                                fontSize: '12px'
                            }
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: (val: number) => `${val} libros`
                        }
                    },
                    colors: ['#FF5733', '#33FF57', '#3357FF']
                };

                newConditionSeries[bookType] = [{
                    name: bookType,
                    data: values
                }];
            });

            // Actualizar el estado con los datos procesados
            setConditionOptions(newConditionOptions);
            setConditionSeries(newConditionSeries);
        }
    }, [condition]);

    // Procesar datos de préstamos por mes
    useEffect(() => {
        if (monthly && monthly.length > 0) {
            const categories = monthly.map(item =>
                new Date(item.month).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short'
                })
            );
            const values = monthly.map(item => Number(item.count));

            setCount({
                chart: { type: 'line', height: 350 },
                xaxis: {
                    categories,
                    labels: { style: { fontSize: '12px' } }
                },
                tooltip: {
                    y: { formatter: (val: number) => `${val} préstamos` }
                },
                colors: ['#33FF57']
            });

            setDate([{
                name: 'Préstamos por mes',
                data: values
            }]);
        }
    }, [monthly]);
    useEffect(() => {
        if (value && Object.keys(value).length > 0) {
            const categories = Object.keys(value);
            const values = Object.values(value);

            setOptionsVal({
                chart: {
                    type: 'bar',
                    height: 350
                },
                xaxis: {
                    categories,
                    labels: { style: { fontSize: '12px' } }
                },
                tooltip: {
                    y: { formatter: (val: number) => `${val} unidades` }
                },
                colors: ['#FF5733', '#33FF57', '#3357FF']
            });

            setSeriesVal([{
                name: 'Valor por tipo',
                data: values
            }]);
        }
    }, [value]);
    if (!options || !series || Object.keys(conditionOptions).length === 0 || Object.keys(conditionSeries).length === 0) {
        return <div>Cargando...</div>;
    }

    return (
        <div className='z-50 px-4'>
            <h1 className='my-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 sm:text-lg md:text-2xl'>Libros</h1>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                    <Label>Libros más solicitados</Label>
                    <Chart options={options} series={series} type="bar" height={350} />
                </div>
                <div>
                    <Label>Prestamos por mes</Label>
                    <Chart options={count} series={date} type="bar" height={350} />
                </div>
                <div>
                    <Label>Precio por tipo</Label>
                    <Chart options={optionsVal} series={seriesVal} type="bar" height={350} />
                </div>
            </div>
            <h1 className='my-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 sm:text-lg md:text-2xl'>Codiciones</h1>
            <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {Object.keys(conditionOptions).map((bookType) => (
                    <div key={bookType}>
                        <Label>{bookType} - Condiciones de los Libros</Label>
                        <Chart options={conditionOptions[bookType]} series={conditionSeries[bookType]} type="bar" height={350} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Hooks para obtener datos

const useAnaliticsData = () => {
    const [data, setData] = useState<Analytics[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics/popular');
                const result = await res.json();
                setData(result || []);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchData();
    }, []);

    return { data };
};

const useAnaliticsCondition = () => {
    const [condition, setData] = useState<BookConditionData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics/condition');
                const result = await res.json();
                setData(result || {});
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchData();
    }, []);

    return { condition };
};
const useAnaliticsValue = () => {
    const [value, setData] = useState<BookTypeValue | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics/value');
                const result = await res.json();
                setData(result || {});
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchData();
    }, []);

    return { value };
};

const useAnaliticsMonthly = () => {
    const [monthly, setData] = useState<Monthly[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/analytics/monthly');
                const result = await res.json();
                setData(result || []);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchData();
    }, []);

    return { monthly };
};
