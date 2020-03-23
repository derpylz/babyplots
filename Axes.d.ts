import { Scene, ArcRotateCamera } from "babylonjs";
import { AxisData } from "./babyplots";
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
