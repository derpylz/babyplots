import { Scene } from "@babylonjs/core/scene";
import { Plot, LegendData } from "./babyplots";
export declare class Surface extends Plot {
    scaleColumn: number;
    scaleRow: number;
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, scaleColumn: number, scaleRow: number, legendData: LegendData);
    private _createSurface;
}
