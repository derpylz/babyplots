import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Meshes/thinInstanceMesh";
import { Plot, LegendData } from "./babyplots";
export declare class ShapeCloud extends Plot {
    private _shape;
    private _shading;
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], shape: string, shading: boolean, size: number, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number);
    private _createShapeCloud;
}
