"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var math_1 = require("@babylonjs/core/Maths/math");
var planeBuilder_1 = require("@babylonjs/core/Meshes/Builders/planeBuilder");
var pointerDragBehavior_1 = require("@babylonjs/core/Behaviors/Meshes/pointerDragBehavior");
var advancedDynamicTexture_1 = require("@babylonjs/gui/2D/advancedDynamicTexture");
var controls_1 = require("@babylonjs/gui/2D/controls");
var LabelManager = (function () {
    function LabelManager(canvas, scene, ymax, camera) {
        this._editLabelForms = [];
        this._labels = [];
        this._labelBackgrounds = [];
        this._labelTexts = [];
        this._showLabels = false;
        this._labelSize = 100;
        this.fixed = false;
        this._canvas = canvas;
        this._scene = scene;
        this._ymax = ymax;
        this._camera = camera;
        this._createLabelForms();
    }
    LabelManager.prototype._createLabelForms = function () {
        var labelBox = document.createElement("div");
        labelBox.className = "bbp label-control";
        labelBox.style.display = "none";
        labelBox.style.top = this._canvas.clientTop + 40 + "px";
        labelBox.style.left = this._canvas.clientTop + 5 + "px";
        var addLabelForm = document.createElement("div");
        addLabelForm.className = "label-form";
        var addLabelLabel = document.createElement("label");
        addLabelLabel.innerText = "Label Text:";
        addLabelLabel.htmlFor = "addLabelInput";
        var addLabelInput = document.createElement("input");
        addLabelInput.name = "addLabelInput";
        addLabelInput.type = "text";
        this._addLabelTextInput = addLabelInput;
        var addLabelBtn = document.createElement("button");
        addLabelBtn.innerText = "Add Label";
        addLabelBtn.onclick = this._addLabelBtnClick.bind(this);
        addLabelForm.appendChild(addLabelLabel);
        addLabelForm.appendChild(addLabelInput);
        addLabelForm.appendChild(addLabelBtn);
        labelBox.appendChild(addLabelForm);
        var editLabelContainer = document.createElement("div");
        editLabelContainer.className = "edit-container";
        editLabelContainer.style.maxHeight = (this._canvas.height - 100).toString() + "px";
        labelBox.appendChild(editLabelContainer);
        this._editLabelContainer = editLabelContainer;
        this._labelControlBox = labelBox;
        this._canvas.parentNode.appendChild(labelBox);
    };
    LabelManager.prototype.update = function () {
        if (this._showLabels) {
            var axis1 = math_1.Vector3.Cross(this._camera.position, math_1.Axis.Y);
            var axis2 = math_1.Vector3.Cross(axis1, this._camera.position);
            var axis3 = math_1.Vector3.Cross(axis1, axis2);
            for (var i = 0; i < this._labels.length; i++) {
                this._labels[i].rotation = math_1.Vector3.RotationFromAxis(axis1, axis2, axis3);
            }
            if (!this.fixed) {
                var meshUnderPointer = this._scene.meshUnderPointer;
                var labelIdx = this._labels.indexOf(meshUnderPointer);
                if (labelIdx != -1) {
                    for (var i = 0; i < this._labelBackgrounds.length; i++) {
                        if (i != labelIdx) {
                            this._labelBackgrounds[i].alpha = 0;
                        }
                    }
                    this._labelBackgrounds[labelIdx].alpha = 1;
                }
                else {
                    for (var i = 0; i < this._labelBackgrounds.length; i++) {
                        this._labelBackgrounds[i].alpha = 0;
                    }
                }
            }
        }
    };
    LabelManager.prototype.toggleLabelControl = function () {
        if (this._labelControlBox.style.display == "none") {
            this._labelControlBox.style.display = "block";
        }
        else {
            this._labelControlBox.style.display = "none";
        }
    };
    LabelManager.prototype._addLabelBtnClick = function (event) {
        event.preventDefault();
        this.addLabel(this._addLabelTextInput.value);
    };
    LabelManager.prototype.addLabel = function (text, position, moveCallback) {
        this._addLabelTextInput.value = "";
        var labelIdx = this._labels.length;
        var plane = planeBuilder_1.PlaneBuilder.CreatePlane('label_' + labelIdx, {
            width: 5,
            height: 5
        }, this._scene);
        if (position) {
            var pos = math_1.Vector3.FromArray(position);
            plane.position = pos;
        }
        else {
            plane.position.y = this._ymax + 2;
        }
        var advancedTexture = advancedDynamicTexture_1.AdvancedDynamicTexture.CreateForMesh(plane);
        var background = new controls_1.Rectangle();
        background.color = "red";
        background.alpha = 0;
        advancedTexture.addControl(background);
        this._labelBackgrounds.push(background);
        var textBlock = new controls_1.TextBlock();
        textBlock.text = text;
        textBlock.color = "black";
        textBlock.fontSize = this._labelSize;
        advancedTexture.addControl(textBlock);
        this._labelTexts.push(textBlock);
        if (!this.fixed) {
            var labelDragBehavior = new pointerDragBehavior_1.PointerDragBehavior();
            labelDragBehavior.onDragEndObservable.add(function () {
                if (moveCallback) {
                    moveCallback(plane.position);
                }
                else {
                    console.log([plane.position.x, plane.position.y, plane.position.z]);
                }
            });
            plane.addBehavior(labelDragBehavior);
        }
        this._labels.push(plane);
        var labelNum = this._labels.length - 1;
        var editLabelForm = document.createElement("div");
        editLabelForm.className = "label-form";
        var editLabelLabel = document.createElement("label");
        editLabelLabel.innerText = "Edit Label Text:";
        editLabelLabel.htmlFor = "editLabelInput";
        editLabelForm.appendChild(editLabelLabel);
        var editLabelInput = document.createElement("input");
        editLabelInput.name = "editLabelInput";
        editLabelInput.type = "text";
        editLabelInput.value = text;
        editLabelInput.dataset.labelnum = labelNum.toString();
        editLabelInput.onkeyup = this._editLabelText.bind(this);
        editLabelForm.appendChild(editLabelInput);
        var rmvLabelBtn = document.createElement("button");
        rmvLabelBtn.innerText = "Remove Label";
        rmvLabelBtn.onclick = this._removeLabel.bind(this);
        rmvLabelBtn.dataset.labelnum = labelNum.toString();
        editLabelForm.appendChild(rmvLabelBtn);
        editLabelForm.dataset.labelnum = labelNum.toString();
        this._editLabelForms.push(editLabelForm);
        this._editLabelContainer.appendChild(editLabelForm);
        this._showLabels = true;
        return labelIdx;
    };
    LabelManager.prototype._editLabelText = function (ev) {
        var inputElem = ev.target;
        this._labelTexts[parseInt(inputElem.dataset.labelnum)].text = inputElem.value;
    };
    LabelManager.prototype._removeLabel = function (ev) {
        var btn = ev.target;
        var labelNum = parseInt(btn.dataset.labelnum);
        this._labelTexts[labelNum].dispose();
        this._labelTexts.splice(labelNum, 1);
        this._labelBackgrounds[labelNum].dispose();
        this._labelBackgrounds.splice(labelNum, 1);
        this._labels[labelNum].dispose();
        this._labels.splice(labelNum, 1);
        var thisForm;
        this._editLabelForms.forEach(function (eLabelForm) {
            if (parseInt(eLabelForm.dataset.labelnum) == labelNum) {
                thisForm = eLabelForm;
            }
            else if (parseInt(eLabelForm.dataset.labelnum) > labelNum) {
                var oldNum = parseInt(eLabelForm.dataset.labelnum);
                var newNum = (oldNum - 1).toString();
                eLabelForm.dataset.labelnum = newNum;
                var oInput = eLabelForm.querySelector('input[data-labelnum="' + oldNum + '"]');
                oInput.dataset.labelnum = newNum;
                var oBtn = eLabelForm.querySelector('button[data-labelnum="' + oldNum + '"]');
                oBtn.dataset.labelnum = newNum;
            }
        });
        thisForm.parentNode.removeChild(thisForm);
    };
    LabelManager.prototype.exportLabels = function () {
        var labels = [];
        for (var i = 0; i < this._labelTexts.length; i++) {
            var lText = this._labelTexts[i].text;
            var lPos = this._labels[i].position;
            labels.push({ text: lText, position: [lPos.x, lPos.y, lPos.z] });
        }
        return labels;
    };
    return LabelManager;
}());
exports.LabelManager = LabelManager;
//# sourceMappingURL=Label.js.map