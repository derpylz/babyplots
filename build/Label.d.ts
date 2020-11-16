/**
 * Babyplots - Easy, fast, interactive 3D visualizations
 *
 * Copyright (c) 2020, Nils Jonathan Trost. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
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
    addArrow(from: number[], to: number[]): void;
    /**
     * Add a 3d label to the plot
     * @param text Label title
     * @param [moveCallback] On dragging of label in 3d plot, the final position will be passed to this function
     */
    addLabel(text: string, position?: number[]): number;
    /**
     * Add multiple labels from a list of labels.
     *
     * @param labelList List of lists with the first three elements of the inner lists being the x, y and z coordinates, and the fourth the label text.
     */
    addLabels(labelList: [[number, number, number, string]]): void;
    private _editLabelText;
    private _removeLabel;
    exportLabels(): any[];
    fixLabels(): void;
    unfixLabels(): void;
}
export {};
