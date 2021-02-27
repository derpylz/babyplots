import { Scene } from "@babylonjs/core/scene";
import { LegendData, CoordinatePlot } from "../babyplots";
export declare class PointCloud extends CoordinatePlot {
    private _pointPicking;
    private _selectionCallback;
    private _folded;
    private _looping;
    private _animDirection;
    private _foldedEmbedding;
    private _foldVectors;
    private _foldCounter;
    private _foldAnimFrames;
    private _foldVectorFract;
    private _foldDelay;
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, folded?: boolean, foldedEmbedding?: number[][], foldAnimDelay?: number, foldAnimDuration?: number, xScale?: number, yScale?: number, zScale?: number, name?: string);
    private _createPointCloud;
    resetAnimation(): void;
    setLooping(looping: boolean): void;
    update(): boolean;
}
