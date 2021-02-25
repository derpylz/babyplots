import { AssetContainer } from "@babylonjs/core/assetContainer";
import { Scene } from "@babylonjs/core/scene";
import { LegendData, Plot } from "./babyplots";
import "@babylonjs/loaders/glTF";
export declare class MeshStream extends Plot {
    private _rootUrl;
    private _filenames;
    private _allLoaded;
    private _frameIndex;
    private _prevTime;
    private _containers;
    frameDelay: number;
    constructor(scene: Scene, rootUrl: string, filePrefix: string, fileSuffix: string, fileIteratorStart: number, fileIteratorEnd: number, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number, frameDelay?: number, name?: string);
    _createMeshStream(): Promise<void>;
    _loadMeshAndWait(filename: string): Promise<AssetContainer>;
    update(): boolean;
}
