import { Scene } from "@babylonjs/core/scene";
import { Plot, LegendData } from "./babyplots";
export declare class HeatMap extends Plot {
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number, name?: string);
    private _createHeatMap;
}
