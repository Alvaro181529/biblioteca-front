
"use client";

import { Button, Label } from 'flowbite-react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Analytics, Monthly, BookConditionData, BookCondition, BookTypeValue } from '@/interface/Interface';
import { AiOutlineLoading } from 'react-icons/ai';
import { FaFileDownload } from 'react-icons/fa';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AnalyticsComponent() {
    const { data } = useAnaliticsData();
    const { monthly } = useAnaliticsMonthly();
    const { condition } = useAnaliticsCondition();
    const { value } = useAnaliticsValue();

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
        if (data && Array.isArray(data) && data.length > 0) {
            const categories = data.map(item => item.book_title_original || ""); // fallback a "" si no existe
            const values = data.map(item => item.book_loan || 0); // fallback a 0 si no existe

            setOptions({
                chart: { type: 'bar', height: 350 },
                xaxis: {
                    categories,
                    labels: { rotate: -45, style: { fontSize: '12px' } }
                },
                tooltip: { y: { formatter: (val: number) => `${val} préstamos` } },
                colors: ['#3357FF']
            });

            setSeries([{ name: 'Préstamos', data: values }]);
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

    if (!data || !monthly || !condition || !value || !options || !series || !conditionOptions || !conditionSeries || !optionsVal || !seriesVal) {
        return (
            <div className="flex items-center justify-center min-h-screen text-center">
                <Button
                    className="text-verde-700"
                    isProcessing
                    processingSpinner={<AiOutlineLoading className="size-20 animate-spin" />}
                >
                    <span></span>
                </Button>
            </div>
        );
    }
    return (
        <div className='z-50 px-4'>
            <DownloadButton />
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
                        <Label>CONDICION - {bookType}</Label>
                        <Chart options={conditionOptions[bookType]} series={conditionSeries[bookType]} type="bar" height={350} />
                    </div>
                ))}
            </div>
        </div>
    );
}

const DownloadButton = () => {
    const [signin, setSignin] = useState(false);
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSignin(true);
        try {
            await FetchReportAnalytics();
        } catch (error) {
            console.error("Error al generar el reporte", error);
        } finally {
            setSignin(false);
        }
    };
    return (<div className='flex justify-between pt-5 sm:pt-2'>
        <h1 className='my-3 text-center text-xl font-semibold text-gray-700 dark:text-gray-300 sm:text-lg md:text-2xl'>Analiticas</h1>
        <form onSubmit={onSubmit} action="">
            <Button
                type='submit'
                className='w-full gap-y-2 rounded bg-verde-600 px-4 text-sm font-semibold text-white ring-1 ring-verde-100 hover:bg-verde-700  focus:border-verde-100 focus:outline-verde-200 dark:bg-gray-700 dark:hover:bg-gray-500'
                isProcessing={signin}
                processingSpinner={<AiOutlineLoading className="size-6 animate-spin" />}
            >
                {signin ?
                    <></>
                    :
                    <FaFileDownload className='size-4 mr-4' />
                }
                Descargar reporte
            </Button>
        </form>
    </div>)
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

const FetchReportAnalytics = async () => {
    const api = `/api/reports/analytics`;
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
