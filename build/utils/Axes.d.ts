import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
export interface AxisData {
    showAxes: boolean[];
    static: boolean;
    axisLabels: string[];
    range: number[][];
    color: string[];
    scale: number[];
    tickBreaks: number[];
    showTickLines: boolean[][];
    tickLineColor: string[][];
    showPlanes: boolean[];
    planeColor: string[];
    plotType: string;
    colnames: string[];
    rownames: string[];
}
export declare class Axes {
    private _axes;
    private _axisLabels;
    private _ticks;
    private _tickLabels;
    private _tickLines;
    private _scene;
    axisData: AxisData;
    constructor(axisData: AxisData, scene: Scene, heatmap?: boolean);
    private _roundTicks;
    private _createAxes;
    private _makeTextPlane;
    update(camera: ArcRotateCamera, updateAxisData?: boolean): void;
}
