import { Scene } from "@babylonjs/core/scene";
import { LegendData } from "../utils/LegendData";
import { CoordinatePlot } from "../utils/Plot";
import { AnnotationManager } from "../utils/Label";
export declare class Line extends CoordinatePlot {
    labels: string[];
    labelSize: number;
    labelColor: string;
    private _hasAnimation;
    private _looping;
    private _animDirection;
    private _animationFrames;
    private _animationDelay;
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, hasAnimation?: boolean, animationDelay?: number, animationDuration?: number, xScale?: number, yScale?: number, zScale?: number, name?: string, labels?: string[], labelSize?: number, labelColor?: string, annotationManager?: AnnotationManager);
    private _createLine;
    private _addLabels;
}
