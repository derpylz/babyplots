import { Scene } from "@babylonjs/core/scene";
import { LegendData, CoordinatePlot } from "./babyplots";
export declare class Surface extends CoordinatePlot {
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number, name?: string);
    private _createSurface;
}
