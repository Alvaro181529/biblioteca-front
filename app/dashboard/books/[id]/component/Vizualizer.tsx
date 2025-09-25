import { Spinner, Tooltip } from "flowbite-react";
import { SiMidi, SiMxlinux } from "react-icons/si";
export default function Vizualizer({ DownloadMIDI, DownloadMXL, filesData }: { DownloadMIDI: () => void, DownloadMXL: () => void, filesData: { midi_url: string | null, mxl_url: string | null } | undefined }) {
    if (!filesData || !filesData.midi_url) {
        return (
            <div className="text-center">
                <Spinner color="success" aria-label="Success spinner" size="xl" />
                <span>Se esta generando los archivos</span>
            </div >
        );
    }
    console.log(filesData);
    return (
        <section id="section2" className="py-10">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-8 px-6 max-sm:flex-col md:flex-row">
                {/* Reproductor MIDI */}
                <midi-player
                    className="mx-auto mb-6 w-full max-w-xl md:mb-0"
                    src={String(filesData?.midi_url)}
                    sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
                    visualizer="#myVisualizer"
                ></midi-player>

                {/* Botón de descarga */}
                <div className="flex items-center gap-4">
                    <Tooltip className="z-50" content="Descargar mxl">
                        <button
                            onClick={DownloadMXL}
                            className="rounded-full bg-green-500 p-2 text-white shadow-xl transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none"
                        >
                            <SiMxlinux className="size-8" />
                        </button>
                    </Tooltip>
                    <Tooltip className="z-50" content="Descargar midi">
                        <button
                            onClick={DownloadMIDI}
                            className="rounded-full bg-green-500 p-2 text-white shadow-xl transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none"
                        >
                            <SiMidi className="size-8" />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Visualizador MIDI */}
            <div className="mt-8">
                <midi-visualizer
                    src={String(filesData?.midi_url)}
                    type="staff"
                    id="myVisualizer"
                    className="mx-auto w-full max-w-7xl"
                ></midi-visualizer>
            </div>
        </section>
    )
}