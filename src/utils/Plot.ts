import { PickingInfo } from "@babylonjs/core/Collisions/pickingInfo";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";
import { LegendData } from "./LegendData";

export abstract class Plot {
    protected _scene: Scene;

    allLoaded: boolean = false;
    name: string;
    shape: string;
    mesh: Mesh;
    meshes: Mesh[];
    legendData: LegendData;
    xScale: number;
    yScale: number;
    zScale: number;
    pickable: boolean = false;

    constructor(
        name: string,
        shape: string,
        scene: Scene,
        legendData: LegendData,
        xScale: number = 1,
        yScale: number = 1,
        zScale: number = 1,
    ) {
        this.name = name;
        this.shape = shape;
        this._scene = scene;
        this.legendData = legendData;
        this.xScale = xScale;
        this.yScale = yScale;
        this.zScale = zScale;
    }

    goToFrame(n: number): void { }
    update(): boolean { return false }
    resetAnimation(): void { }
    setLooping(looping: boolean): void { }
    dispose(): void {
        if (this.mesh !== undefined) {

        }
    }
}

export abstract class CoordinatePlot extends Plot {
    protected _coords: number[][];
    protected _coordColors: string[];
    protected _groups: string[];
    protected _groupNames: string[];
    protected _size: number = 1;

    pickable: boolean = true;
    selection: number[]; // contains indices of cells in selection cube
    dpInfo: string[];

    constructor(
        name: string,
        shape: string,
        scene: Scene,
        coordinates: number[][],
        colorVar: string[],
        size: number,
        legendData: LegendData,
        xScale: number = 1,
        yScale: number = 1,
        zScale: number = 1
    ) {
        super(name, shape, scene, legendData, xScale, yScale, zScale);
        this._coords = coordinates;
        this._coordColors = colorVar;
        this._size = size;
    }

    getPick(pickResult: PickingInfo): { target: TransformNode, info: string } { return null }
}