// midi-player.d.ts
declare namespace JSX {
    interface IntrinsicElements {
        "midi-player": React.DetailedHTMLProps<React.HTMLProps<HTMLElement> & {
            src: string;
            "sound-font": string | boolean;
            visualizer: string;
            className: string;
        }, HTMLElement>;

        "midi-visualizer": React.DetailedHTMLProps<React.HTMLProps<HTMLElement> & {
            className: string;
            src: string;
            type: string;
        }, HTMLElement>;
    }
}