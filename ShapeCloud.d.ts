import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Meshes/thinInstanceMesh";
import { Plot, PlotLegendData } from "./babyplots";
export declare class ShapeCloud extends Plot {
    private _shading;
    shape: string;
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], shape: string, shading: boolean, size: number, legendData: PlotLegendData, xScale?: number, yScale?: number, zScale?: number);
    private _createShapeCloud;
}
