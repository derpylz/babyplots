import { Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";
import { LegendData } from "../utils/LegendData";
import { Plot } from "../utils/Plot";
import "@babylonjs/loaders/glTF";
export declare class MeshObject extends Plot {
    worldextends: {
        min: Vector3;
        max: Vector3;
    };
    constructor(scene: Scene, meshString: string, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number, scaling?: number[], rotation?: number[], offset?: number[], name?: string);
}
