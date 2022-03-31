import { PickingInfo } from "@babylonjs/core/Collisions/pickingInfo";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";
import { LegendData } from "./LegendData";
export declare abstract class Plot {
    protected _scene: Scene;
    allLoaded: boolean;
    name: string;
    shape: string;
    mesh: Mesh;
    meshes: Mesh[];
    legendData: LegendData;
    xScale: number;
    yScale: number;
    zScale: number;
    pickable: boolean;
    constructor(name: string, shape: string, scene: Scene, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number);
    goToFrame(n: number): void;
    update(): boolean;
    resetAnimation(): void;
    setLooping(looping: boolean): void;
    dispose(): void;
}
export declare abstract class CoordinatePlot extends Plot {
    protected _coords: number[][];
    protected _coordColors: string[];
    protected _groups: string[];
    protected _groupNames: string[];
    protected _size: number;
    pickable: boolean;
    selection: number[];
    dpInfo: string[];
    constructor(name: string, shape: string, scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number);
    getPick(pickResult: PickingInfo): {
        target: TransformNode;
        info: string;
    };
}
