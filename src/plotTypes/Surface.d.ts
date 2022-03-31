import { Scene } from "@babylonjs/core/scene";
import { LegendData } from "../utils/LegendData";
import { CoordinatePlot } from "../utils/Plot";
export declare class Surface extends CoordinatePlot {
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number, name?: string);
    private _createSurface;
}
