import { Scene } from "@babylonjs/core/scene";
import { LegendData } from "../utils/LegendData";
import { CoordinatePlot } from "../utils/Plot";
import { AnnotationManager } from "../utils/Label";
export declare class PointCloud extends CoordinatePlot {
    labelSize: number;
    labelColor: string;
    private _hasAnimation;
    private _looping;
    private _animDirection;
    private _animationTargets;
    private _animationVectors;
    private _animationCounter;
    private _animationFrames;
    private _animationVectorFract;
    private _animationDelay;
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, hasAnimation?: boolean, animationTargets?: number[][], animationDelay?: number, animationDuration?: number, xScale?: number, yScale?: number, zScale?: number, name?: string, addLabels?: boolean, labelSize?: number, labelColor?: string, annotationManager?: AnnotationManager);
    private _createPointCloud;
    private _addLabels;
    resetAnimation(): void;
    setLooping(looping: boolean): void;
    update(): boolean;
}
