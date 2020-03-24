import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import "@babylonjs/core/Meshes/meshBuilder";
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
