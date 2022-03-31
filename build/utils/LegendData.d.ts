export interface ShapeLegendData {
    title: string;
    spacing: number;
    shapes: string[][];
}
export interface LegendData {
    showLegend: boolean;
    discrete: boolean;
    breaks: string[];
    colorScale: string;
    inverted: boolean;
    position: string;
    showShape?: boolean;
    customColorScale?: string[];
    fontSize?: number;
    fontColor?: string;
    legendTitle?: string;
    legendTitleFontSize?: number;
    legendTitleFontColor?: string;
}
