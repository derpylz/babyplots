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
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Vector3, Axis, Color3 } from "@babylonjs/core/Maths/math";
import { PlaneBuilder } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { PointerDragBehavior } from "@babylonjs/core/Behaviors/Meshes/pointerDragBehavior";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Rectangle, TextBlock } from "@babylonjs/gui/2D/controls";
import { LinesBuilder } from "@babylonjs/core/Meshes/Builders/linesBuilder";
import { LinesMesh } from "@babylonjs/core/Meshes/linesMesh";
import { CylinderBuilder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder";

class Arrow {
    private _lines: LinesMesh;
    private _tip: Mesh;

    size: number = 1;

    constructor(from: Vector3, to: Vector3, scene: Scene, color?: string) {
        let lines = LinesBuilder.CreateLineSystem('ls', {
            lines: [[from, to]],
            updatable: true
        }, scene);

        lines.color = new Color3(0, 0, 0);
        if (color !== undefined) {
            lines.color = Color3.FromHexString(color);
        }
        this._lines = lines;
        let tip = CylinderBuilder.CreateCylinder("tip", {
            diameterTop: 0,
            diameterBottom: this.size,
            tessellation: 36
        }, scene);
        tip.position = to;
        this._tip = tip;

    }
}

class Label {
    private _label: Mesh;
    private _background: Rectangle;
    private _text: TextBlock;

    size: number = 100;
    color: string = "black";
    fixed: boolean = false;

    constructor(text: string, position: Vector3, scene: Scene, color?: string) {
        let plane = PlaneBuilder.CreatePlane('label', {
            width: 5,
            height: 5
        }, scene);

        if (color !== undefined) {
            this.color = color;
        }

        plane.position = position;

        let advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);

        let background = new Rectangle();
        background.color = "red";
        background.alpha = 0
        advancedTexture.addControl(background);
        this._background = background;

        let textBlock = new TextBlock();
        textBlock.text = text;
        textBlock.color = this.color;
        textBlock.fontSize = this.size;
        advancedTexture.addControl(textBlock);
        this._text = textBlock;

        if (!this.fixed) {
            makeDraggable(plane);
        }

        this._label = plane;
    }

    setText(text: string) {
        this._text.text = text;
    }

    update(camera: ArcRotateCamera, scene: Scene) {
        // draw 3d labels in plot
        let axis1 = Vector3.Cross(camera.position, Axis.Y);
        let axis2 = Vector3.Cross(axis1, camera.position);
        let axis3 = Vector3.Cross(axis1, axis2);
        this._label.rotation = Vector3.RotationFromAxis(axis1, axis2, axis3);

        if (!this.fixed) {
            // highlighting label under mouse cursor
            const meshUnderPointer = scene.meshUnderPointer as Mesh;
            if (this._label === meshUnderPointer) {
                this._background.alpha = 1;
            } else {
                this._background.alpha = 0;
            }
        }
    }

    fix() {
        this._label.removeBehavior(this._label.getBehaviorByName("PointerDrag"));
        this.fixed = true;
    }

    unfix() {
        makeDraggable(this._label);
        this.fixed = false;
    }

    dispose() {
        this._text.dispose();
        this._background.dispose();
        this._label.dispose();
    }

    export(): [number, number, number, string] {
        return [
            this._label.position.x,
            this._label.position.y,
            this._label.position.z,
            this._text.text
        ]
    }
}

export class AnnotationManager {
    private _canvas: HTMLCanvasElement;
    private _scene: Scene;
    private _ymax: number;
    private _camera: ArcRotateCamera;
    private _labelControlBox: HTMLDivElement;
    private _editLabelContainer: HTMLDivElement;
    private _editLabelForms: HTMLDivElement[] = [];
    private _addLabelTextInput: HTMLInputElement;
    private _showLabels: boolean = false;
    private _arrows: Arrow[] = [];
    private _showArrows: boolean = false;

    labels: Label[] = [];
    fixedLabels: boolean = false;
    fixedArrows: boolean = false;

    constructor(canvas: HTMLCanvasElement, scene: Scene, ymax: number, camera: ArcRotateCamera) {
        this._canvas = canvas;
        this._scene = scene;
        this._ymax = ymax;
        this._camera = camera;
        this._createLabelForms();
    }

    private _createLabelForms() {
        let labelBox = document.createElement("div");
        labelBox.className = "bbp label-control";
        labelBox.style.display = "none";
        labelBox.style.top = this._canvas.clientTop + 40 + "px";
        labelBox.style.left = this._canvas.clientTop + 5 + "px";
        let addLabelForm = document.createElement("div");
        addLabelForm.className = "label-form";
        let addLabelLabel = document.createElement("label");
        addLabelLabel.innerText = "Label Text:";
        addLabelLabel.htmlFor = "addLabelInput";
        let addLabelInput = document.createElement("input");
        addLabelInput.name = "addLabelInput";
        addLabelInput.type = "text";
        this._addLabelTextInput = addLabelInput;
        let addLabelBtn = document.createElement("button");
        addLabelBtn.innerText = "Add Label";
        addLabelBtn.onclick = this._addLabelBtnClick.bind(this);
        addLabelForm.appendChild(addLabelLabel);
        addLabelForm.appendChild(addLabelInput);
        addLabelForm.appendChild(addLabelBtn);
        labelBox.appendChild(addLabelForm);
        let editLabelContainer = document.createElement("div");
        editLabelContainer.className = "edit-container";
        editLabelContainer.style.maxHeight = (this._canvas.height - 100).toString() + "px";
        labelBox.appendChild(editLabelContainer);
        this._editLabelContainer = editLabelContainer;
        this._labelControlBox = labelBox;
        this._canvas.parentNode.appendChild(labelBox);
    }

    update() {
        if (this._showArrows) {

        }
        if (this._showLabels) {
            for (let i = 0; i < this.labels.length; i++) {
                const label = this.labels[i];
                label.update(this._camera, this._scene);
            }
        }
    }

    toggleLabelControl() {
        if (this._labelControlBox.style.display == "none") {
            this._labelControlBox.style.display = "block";
            this.unfixLabels();
        } else {
            this._labelControlBox.style.display = "none";
            this.fixLabels();
        }
    }

    private _addLabelBtnClick(event: Event) {
        event.preventDefault();
        this.addLabel(this._addLabelTextInput.value);
    }

    addArrow(from: number[], to: number[]) {
        this._arrows.push(new Arrow(
            Vector3.FromArray(from),
            Vector3.FromArray(to),
            this._scene
        ));
    }

    /**
     * Add a 3d label to the plot
     * @param text Label title
     * @param [moveCallback] On dragging of label in 3d plot, the final position will be passed to this function
     */
    addLabel(text: string, position?: number[]): number {
        this._addLabelTextInput.value = "";
        let labelIdx = this.labels.length;

        let pos: Vector3;
        if (position) {
            pos = Vector3.FromArray(position)
        } else {
            pos = new Vector3(0, this._ymax + 2, 0);
        }

        let newLabel = new Label(text, pos, this._scene);

        this.labels.push(newLabel);

        let editLabelForm = document.createElement("div");
        editLabelForm.className = "label-form";
        let editLabelLabel = document.createElement("label");
        editLabelLabel.innerText = "Edit Label Text:";
        editLabelLabel.htmlFor = "editLabelInput";
        editLabelForm.appendChild(editLabelLabel);
        let editLabelInput = document.createElement("input");
        editLabelInput.name = "editLabelInput";
        editLabelInput.type = "text";
        editLabelInput.value = text;
        editLabelInput.dataset.labelnum = labelIdx.toString();
        editLabelInput.onkeyup = this._editLabelText.bind(this);
        editLabelForm.appendChild(editLabelInput);
        let rmvLabelBtn = document.createElement("button");
        rmvLabelBtn.innerText = "Remove Label"
        rmvLabelBtn.onclick = this._removeLabel.bind(this);
        rmvLabelBtn.dataset.labelnum = labelIdx.toString();
        editLabelForm.appendChild(rmvLabelBtn);
        editLabelForm.dataset.labelnum = labelIdx.toString();
        this._editLabelForms.push(editLabelForm);
        this._editLabelContainer.appendChild(editLabelForm);

        this._showLabels = true;
        return labelIdx;
    }

    /**
     * Add multiple labels from a list of labels.
     * 
     * @param labelList List of lists with the first three elements of the inner lists being the x, y and z coordinates, and the fourth the label text.
     */
    addLabels(labelList: [[number, number, number, string]]): void {
        for (let i = 0; i < labelList.length; i++) {
            const label = labelList[i];
            let text = label[3];
            let position = label.slice(0, 3) as number[];
            this.addLabel(text, position);
        }
    }

    private _editLabelText(ev: Event): void {
        let inputElem = ev.target as HTMLInputElement;
        this.labels[parseInt(inputElem.dataset.labelnum)].setText(inputElem.value);
    }

    private _removeLabel(ev: Event) {
        let btn = ev.target as HTMLButtonElement;
        let labelNum = parseInt(btn.dataset.labelnum);
        this.labels[labelNum].dispose();
        this.labels.splice(labelNum, 1);
        let thisForm: HTMLDivElement;
        this._editLabelForms.forEach(eLabelForm => {
            if (parseInt(eLabelForm.dataset.labelnum) == labelNum) {
                thisForm = eLabelForm;
            } else if (parseInt(eLabelForm.dataset.labelnum) > labelNum) {
                let oldNum = parseInt(eLabelForm.dataset.labelnum)
                let newNum = (oldNum - 1).toString()
                eLabelForm.dataset.labelnum = newNum;
                let oInput = eLabelForm.querySelector('input[data-labelnum="' + oldNum + '"]') as HTMLInputElement;
                oInput.dataset.labelnum = newNum;
                let oBtn = eLabelForm.querySelector('button[data-labelnum="' + oldNum + '"]') as HTMLButtonElement;
                oBtn.dataset.labelnum = newNum;
            }
        });
        thisForm.parentNode.removeChild(thisForm);
    }

    exportLabels(): any[] {
        let labels = [];
        for (let i = 0; i < this.labels.length; i++) {
            labels.push(this.labels[i].export());
        }
        return labels;
    }

    fixLabels() {
        for (let i = 0; i < this.labels.length; i++) {
            this.labels[i].fix();
        }
        this.fixedLabels = true;
    }

    unfixLabels() {
        for (let i = 0; i < this.labels.length; i++) {
            this.labels[i].unfix();
        }
        this.fixedLabels = false;
    }
}

function makeDraggable(label: Mesh) {
    let labelDragBehavior = new PointerDragBehavior();
    label.addBehavior(labelDragBehavior);
}