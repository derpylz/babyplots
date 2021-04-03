import { Scene } from "@babylonjs/core/scene";
import { CoordinatePlot, LegendData } from "../babyplots";
export declare class HeatMap extends CoordinatePlot {
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number, name?: string);
    private _createHeatMap;
}
