import { Scene } from "@babylonjs/core/scene";
import { LegendData, CoordinatePlot } from "../babyplots";
export declare class PointCloud extends CoordinatePlot {
    private _pointPicking;
    private _selectionCallback;
    private _hasAnimation;
    private _looping;
    private _animDirection;
    private _animationTargets;
    private _animationVectors;
    private _animationCounter;
    private _animationFrames;
    private _animationVectorFract;
    private _animationDelay;
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, hasAnimation?: boolean, animationTargets?: number[][], animationDelay?: number, animationDuration?: number, xScale?: number, yScale?: number, zScale?: number, name?: string);
    private _createPointCloud;
    resetAnimation(): void;
    setLooping(looping: boolean): void;
    update(): boolean;
}
