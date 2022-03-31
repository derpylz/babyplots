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
import { Button, Rectangle, TextBlock } from "@babylonjs/gui/2D/controls";
import { LinesBuilder } from "@babylonjs/core/Meshes/Builders/linesBuilder";
import { LinesMesh } from "@babylonjs/core/Meshes/linesMesh";
import { CylinderBuilder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import chroma from "chroma-js";
import { Plot } from "./Plot";

// class Arrow {
//     private _lines: LinesMesh;
//     private _tip: Mesh;

//     size: number = 1;

//     constructor(from: Vector3, to: Vector3, scene: Scene, color?: string) {
//         let lines = LinesBuilder.CreateLineSystem('ls', {
//             lines: [[from, to]],
//             updatable: true
//         }, scene);

//         lines.color = new Color3(0, 0, 0);
//         if (color != null) {
//             lines.color = Color3.FromHexString(color);
//         }
//         this._lines = lines;
//         let tip = CylinderBuilder.CreateCylinder("tip", {
//             diameterTop: 0,
//             diameterBottom: this.size,
//             tessellation: 36
//         }, scene);
//         tip.position = to;
//         this._tip = tip;

//     }
// }

class dpInfo {
    private _background: Rectangle;
    private _textBlock: TextBlock;
    private _text: string;
    private _bgColor: string;
    private _txtColor: string;
    private _uiLayer: AdvancedDynamicTexture;
    private _closeBtn: Button;
    
    target: TransformNode;
    disposed: boolean = false;

    constructor(text: string, target: TransformNode, uiLayer: AdvancedDynamicTexture, backgroundColor: string, color: string) {
        this._bgColor = backgroundColor;
        this._txtColor = color;
        this.target = target;
        this._uiLayer = uiLayer;
        this._text = text;
        this.draw();
    }

    draw() {
        this.disposed = false;
        this._background = new Rectangle();
        this._uiLayer.addControl(this._background);
        let rows = this._text.split("\n");
        let maxRowLen = 0;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.length > maxRowLen) {
                maxRowLen = row.length;
            }
        }
        let fontSize = 12;
        this._background.widthInPixels = maxRowLen * fontSize + 6;
        this._background.heightInPixels = rows.length * (fontSize + 4) + 6;
        this._background.linkWithMesh(this.target);
        this._background.background = this._bgColor;
        this._background.alpha = 0.8;
        this._background.linkOffsetY = -10;
        this._textBlock = new TextBlock();
        this._textBlock.text = this._text;
        this._textBlock.fontSize = fontSize;
        this._textBlock.color = this._txtColor;
        this._background.addControl(this._textBlock);
        this._closeBtn = Button.CreateSimpleButton("close", "x");
        this._background.addControl(this._closeBtn);
        this._closeBtn.topInPixels = -this._background.heightInPixels/2 + 10;
        this._closeBtn.leftInPixels = this._background.widthInPixels/2 - 10;
        this._closeBtn.widthInPixels = 20;
        this._closeBtn.heightInPixels = 20;
        this._closeBtn.fontSize = 10;
        this._closeBtn.background = this._txtColor;
        this._closeBtn.color = this._bgColor
        this._closeBtn.onPointerClickObservable.add((function () {
            this.dispose();
        }).bind(this));

    }

    dispose() {
        if (this._textBlock) {
            this._textBlock.dispose();
            this._textBlock = undefined;
        }
        if (this._background) {
            this._background.dispose();
            this._background = undefined;
        }
        if (this._closeBtn) {
            this._closeBtn.dispose();
            this._closeBtn = undefined;
        }
        this.disposed = true;
    }
}

class Label {
    private _label: Mesh;
    private _background: Rectangle;
    private _text: TextBlock;

    size: number = 100;
    color: string = "black";
    fixed: boolean = false;
    plotCreated: Plot;

    constructor(text: string, position: Vector3, scene: Scene, color?: string, size?: number, plotCreated?: Plot) {
        if (size != null) {
            this.size = size;
        }
        let plane = PlaneBuilder.CreatePlane('label', {
            width: this.size * 0.05,
            height: this.size * 0.05
        }, scene);

        if (color != null) {
            this.color = color;
        }

        this.plotCreated = plotCreated

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

    export(): [number, number, number, string, string, number] {
        return [
            this._label.position.x,
            this._label.position.y,
            this._label.position.z,
            this._text.text,
            this.color,
            this.size
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
    // private _arrows: Arrow[] = [];
    private _showArrows: boolean = false;
    private _bgColor: string;
    private _fgColor: string;
    private _fullScreenUI: AdvancedDynamicTexture;
    private _uniqID: string;
    
    dpInfos: dpInfo[] = [];
    labels: Label[] = [];
    fixedLabels: boolean = false;
    fixedArrows: boolean = false;

    constructor(canvas: HTMLCanvasElement, scene: Scene, ymax: number, camera: ArcRotateCamera, backgroundColor: string, fullScreenUI: AdvancedDynamicTexture, uniqID: string) {
        this._canvas = canvas;
        this._scene = scene;
        this._ymax = ymax;
        this._camera = camera;
        this._bgColor = backgroundColor;
        this._fgColor = "white";
        this._fullScreenUI = fullScreenUI;
        this._uniqID = uniqID;
        if (chroma(backgroundColor).luminance() > 0.5) {
            this._fgColor = "black";
        }
        this._createLabelForms();
    }

    private _createLabelForms() {
        let labelBox = document.createElement("div");
        labelBox.id = "labelControl_" + this._uniqID;
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
        // if (this._showArrows) {

        // }
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

    // addArrow(from: number[], to: number[]) {
    //     this._arrows.push(new Arrow(
    //         Vector3.FromArray(from),
    //         Vector3.FromArray(to),
    //         this._scene
    //     ));
    // }

    redrawInfo() {
        for (let i = this.dpInfos.length - 1; i >= 0; i--) {
            const dpInfo = this.dpInfos[i];
            if (dpInfo.disposed) {
                this.dpInfos.splice(i, 1);
            } else {
                dpInfo.dispose();
                dpInfo.draw();
            }
        }
    }

    displayInfo(text: string, target: TransformNode) {
        let alreadyShown = false;
        for (let i = 0; i < this.dpInfos.length; i++) {
            const dpInfo = this.dpInfos[i];
            if (dpInfo.target === target) {
                alreadyShown = true;
                if (dpInfo.disposed) {
                    dpInfo.draw();
                }
            }
        }
        if (!alreadyShown) {
            this.dpInfos.push(new dpInfo(text, target, this._fullScreenUI, this._bgColor, this._fgColor));
        }
    }

    clearInfo() {
        for (let i = 0; i < this.dpInfos.length; i++) {
            this.dpInfos[i].dispose();
        }
        this.dpInfos = [];
    }

    /**
     * Add a 3d label to the plot
     * @param text Label title
     * @param position Array with x, y and z coordinates for the label
     * @param color Color of the label
     * @param size Size of the label
     * @param plotCreated True if the label is created by a plot function, should not be manually set true.
     * 
     * @return Index of the label
     */
    addLabel(text: string, position?: number[], color?: string, size?: number, plotCreated?: Plot): number {
        this._addLabelTextInput.value = "";
        let labelIdx = this.labels.length;

        let pos: Vector3;
        if (position) {
            pos = Vector3.FromArray(position)
        } else {
            pos = new Vector3(0, this._ymax + 2, 0);
        }

        text = text.replace(/[\s\.]/g, "\n");
        text = text.replace(/_/g, " ");
        let col = this._fgColor;
        if (color != null) {
            col = color;
        }
        let newLabel = new Label(text, pos, this._scene, col, size, plotCreated);

        this.labels.push(newLabel);
        this._showLabels = true;
        
        if (plotCreated !== undefined) {
            return labelIdx;
        }
        
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
        rmvLabelBtn.onclick = this._removeLabelByUI.bind(this);
        rmvLabelBtn.dataset.labelnum = labelIdx.toString();
        editLabelForm.appendChild(rmvLabelBtn);
        editLabelForm.dataset.labelnum = labelIdx.toString();
        this._editLabelForms.push(editLabelForm);
        this._editLabelContainer.appendChild(editLabelForm);

        return labelIdx;
    }

    /**
     * Add multiple labels from a list of labels.
     * 
     * @param labelList List of lists with the first three elements of the inner lists being the x, y and z coordinates, and the fourth the label text.
     */
    addLabels(labelList: [number, number, number, string, string?, number?][]): number[] {
        let labelIndices: number[] = [];
        for (let i = 0; i < labelList.length; i++) {
            const label = labelList[i];
            let position = label.slice(0, 3) as number[];
            let text = label[3];
            labelIndices.push(this.addLabel(text, position, label[4], label[5]));
        }
        return labelIndices;
    }

    private _editLabelText(ev: Event): void {
        let inputElem = ev.target as HTMLInputElement;
        this.labels[parseInt(inputElem.dataset.labelnum)].setText(inputElem.value);
    }

    private _removeLabelByUI(ev: Event) {
        let btn = ev.target as HTMLButtonElement;
        let labelNum = parseInt(btn.dataset.labelnum);
        this.removeLabel(labelNum);
    }

    removeLabel(index: number): void {
        // remove label
        if(this.labels[index] === undefined) return;
        this.labels[index].dispose();
        this.labels[index] = undefined;
        // remove UI of removed label
        this._editLabelForms.forEach(eLabelForm => {
            if (parseInt(eLabelForm.dataset.labelnum) === index) {
                eLabelForm.parentNode.removeChild(eLabelForm);
            }
        });
    }

    exportLabels(): [number, number, number, string, string, number][] {
        let labels: [number, number, number, string, string, number][] = [];
        for (let i = 0; i < this.labels.length; i++) {
            const l = this.labels[i];
            if (l === undefined) continue;
            if (l.plotCreated !== undefined) continue;
            labels.push(l.export());
        }
        return labels;
    }

    fixLabels(): void {
        for (let i = 0; i < this.labels.length; i++) {
            const l = this.labels[i];
            if (l === undefined) continue;
            l.fix();
        }
        this.fixedLabels = true;
    }

    unfixLabels(): void {
        for (let i = 0; i < this.labels.length; i++) {
            const l = this.labels[i];
            if (l === undefined) continue;
            if (l.plotCreated !== undefined) continue;
            l.unfix();
        }
        this.fixedLabels = false;
    }
}

function makeDraggable(label: Mesh) {
    let labelDragBehavior = new PointerDragBehavior();
    label.addBehavior(labelDragBehavior);
}