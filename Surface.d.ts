import { Scene } from "babylonjs";
import { Plot, LegendData } from "./babyplots";
export declare class Surface extends Plot {
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData);
    private _createSurface;
}
