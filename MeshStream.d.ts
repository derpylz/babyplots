import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { AssetContainer } from "@babylonjs/core/assetContainer";
import { Scene } from "@babylonjs/core/scene";
import { LegendData, Plot } from "./babyplots";
import { Vector3 } from "@babylonjs/core/Maths/math";
import "@babylonjs/loaders/glTF";
export declare class MeshStream extends Plot {
    private _rootUrl;
    private _filenames;
    private _allLoaded;
    private _frameIndex;
    private _prevTime;
    private _containers;
    private _camera;
    frameDelay: number;
    worldextends: {
        min: Vector3;
        max: Vector3;
    };
    constructor(scene: Scene, camera: ArcRotateCamera, rootUrl: string, filePrefix: string, fileSuffix: string, fileIteratorStart: number, fileIteratorEnd: number, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number, frameDelay?: number, name?: string);
    _createMeshStream(): Promise<void>;
    _loadMesh(filename: string): Promise<AssetContainer>;
    update(): boolean;
}
