import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math";
export declare class LabelManager {
    private _canvas;
    private _scene;
    private _ymax;
    private _camera;
    private _labelControlBox;
    private _editLabelContainer;
    private _editLabelForms;
    private _addLabelTextInput;
    private _labels;
    private _labelBackgrounds;
    private _labelTexts;
    private _showLabels;
    private _labelSize;
    fixed: boolean;
    constructor(canvas: HTMLCanvasElement, scene: Scene, ymax: number, camera: ArcRotateCamera);
    private _createLabelForms;
    update(): void;
    toggleLabelControl(): void;
    private _addLabelBtnClick;
    addLabel(text: string, position?: number[], moveCallback?: (position: Vector3) => any): number;
    private _editLabelText;
    private _removeLabel;
    exportLabels(): any[];
}
