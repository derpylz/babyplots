import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math";
declare class Label {
    private _label;
    private _background;
    private _text;
    size: number;
    color: string;
    fixed: boolean;
    constructor(text: string, position: Vector3, scene: Scene, color?: string);
    setText(text: string): void;
    update(camera: ArcRotateCamera, scene: Scene): void;
    fix(): void;
    unfix(): void;
    dispose(): void;
    export(): [number, number, number, string];
}
export declare class AnnotationManager {
    private _canvas;
    private _scene;
    private _ymax;
    private _camera;
    private _labelControlBox;
    private _editLabelContainer;
    private _editLabelForms;
    private _addLabelTextInput;
    private _showLabels;
    private _arrows;
    private _showArrows;
    labels: Label[];
    fixedLabels: boolean;
    fixedArrows: boolean;
    constructor(canvas: HTMLCanvasElement, scene: Scene, ymax: number, camera: ArcRotateCamera);
    private _createLabelForms;
    update(): void;
    toggleLabelControl(): void;
    private _addLabelBtnClick;
    addLabel(text: string, position?: number[]): number;
    addLabels(labelList: [[number, number, number, string]]): void;
    private _editLabelText;
    private _removeLabel;
    exportLabels(): any[];
    fixLabels(): void;
    unfixLabels(): void;
}
export {};
