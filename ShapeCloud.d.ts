import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Meshes/thinInstanceMesh";
import { Plot, LegendData } from "./babyplots";
import { PickingInfo } from "@babylonjs/core/Collisions/pickingInfo";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
export declare class ShapeCloud extends Plot {
    private _shading;
    private _shape;
    private _tNodes;
    dpInfo: string[];
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], shape: string, shading: boolean, size: number, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number, name?: string, dpInfo?: string[]);
    private _createShapeCloud;
    getPick(pickResult: PickingInfo): {
        target: TransformNode;
        info: string;
    };
}
