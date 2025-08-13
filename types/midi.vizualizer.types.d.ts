
declare module 'react-midi-visualizer' {
    import { FC } from 'react';

    interface MidiVisualizerProps {
        midi: string; // URL del archivo MIDI
        width?: number; // Ancho del visualizador
        height?: number; // Alto del visualizador
        backgroundColor?: string; // Color de fondo
        noteColor?: string; // Color de las notas
        keyColor?: string; // Color de las teclas
        renderSpeed?: number; // Velocidad de renderizado
    }

    const MidiVisualizer: FC<MidiVisualizerProps>;

    export default MidiVisualizer;
}