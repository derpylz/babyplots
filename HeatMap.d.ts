import { Scene } from "@babylonjs/core/scene";
import { Plot, PlotLegendData } from "./babyplots";
export declare class HeatMap extends Plot {
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: PlotLegendData, xScale?: number, yScale?: number, zScale?: number);
    private _createHeatMap;
}
