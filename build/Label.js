"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationManager = void 0;
var math_1 = require("@babylonjs/core/Maths/math");
var planeBuilder_1 = require("@babylonjs/core/Meshes/Builders/planeBuilder");
var pointerDragBehavior_1 = require("@babylonjs/core/Behaviors/Meshes/pointerDragBehavior");
var advancedDynamicTexture_1 = require("@babylonjs/gui/2D/advancedDynamicTexture");
var controls_1 = require("@babylonjs/gui/2D/controls");
var linesBuilder_1 = require("@babylonjs/core/Meshes/Builders/linesBuilder");
var cylinderBuilder_1 = require("@babylonjs/core/Meshes/Builders/cylinderBuilder");
var Arrow = (function () {
    function Arrow(from, to, scene, color) {
        this.size = 1;
        var lines = linesBuilder_1.LinesBuilder.CreateLineSystem('ls', {
            lines: [[from, to]],
            updatable: true
        }, scene);
        lines.color = new math_1.Color3(0, 0, 0);
        if (color !== undefined) {
            lines.color = math_1.Color3.FromHexString(color);
        }
        this._lines = lines;
        var tip = cylinderBuilder_1.CylinderBuilder.CreateCylinder("tip", {
            diameterTop: 0,
            diameterBottom: this.size,
            tessellation: 36
        }, scene);
        tip.position = to;
    }
    return Arrow;
}());
var Label = (function () {
    function Label(text, position, scene, color) {
        this.size = 100;
        this.color = "black";
        this.fixed = false;
        var plane = planeBuilder_1.PlaneBuilder.CreatePlane('label', {
            width: 5,
            height: 5
        }, scene);
        if (color !== undefined) {
            this.color = color;
        }
        plane.position = position;
        var advancedTexture = advancedDynamicTexture_1.AdvancedDynamicTexture.CreateForMesh(plane);
        var background = new controls_1.Rectangle();
        background.color = "red";
        background.alpha = 0;
        advancedTexture.addControl(background);
        this._background = background;
        var textBlock = new controls_1.TextBlock();
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
    Label.prototype.setText = function (text) {
        this._text.text = text;
    };
    Label.prototype.update = function (camera, scene) {
        var axis1 = math_1.Vector3.Cross(camera.position, math_1.Axis.Y);
        var axis2 = math_1.Vector3.Cross(axis1, camera.position);
        var axis3 = math_1.Vector3.Cross(axis1, axis2);
        this._label.rotation = math_1.Vector3.RotationFromAxis(axis1, axis2, axis3);
        if (!this.fixed) {
            var meshUnderPointer = scene.meshUnderPointer;
            if (this._label === meshUnderPointer) {
                this._background.alpha = 1;
            }
            else {
                this._background.alpha = 0;
            }
        }
    };
    Label.prototype.fix = function () {
        this._label.removeBehavior(this._label.getBehaviorByName("PointerDrag"));
        this.fixed = true;
    };
    Label.prototype.unfix = function () {
        makeDraggable(this._label);
        this.fixed = false;
    };
    Label.prototype.dispose = function () {
        this._text.dispose();
        this._background.dispose();
        this._label.dispose();
    };
    Label.prototype.export = function () {
        return [
            this._label.position.x,
            this._label.position.y,
            this._label.position.z,
            this._text.text
        ];
    };
    return Label;
}());
var AnnotationManager = (function () {
    function AnnotationManager(canvas, scene, ymax, camera) {
        this._editLabelForms = [];
        this._showLabels = false;
        this._arrows = [];
        this._showArrows = false;
        this.labels = [];
        this.fixedLabels = false;
        this.fixedArrows = false;
        this._canvas = canvas;
        this._scene = scene;
        this._ymax = ymax;
        this._camera = camera;
        this._createLabelForms();
    }
    AnnotationManager.prototype._createLabelForms = function () {
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
    AnnotationManager.prototype.update = function () {
        if (this._showArrows) {
        }
        if (this._showLabels) {
            for (var i = 0; i < this.labels.length; i++) {
                var label = this.labels[i];
                label.update(this._camera, this._scene);
            }
        }
    };
    AnnotationManager.prototype.toggleLabelControl = function () {
        if (this._labelControlBox.style.display == "none") {
            this._labelControlBox.style.display = "block";
            this.unfixLabels();
        }
        else {
            this._labelControlBox.style.display = "none";
            this.fixLabels();
        }
    };
    AnnotationManager.prototype._addLabelBtnClick = function (event) {
        event.preventDefault();
        this.addLabel(this._addLabelTextInput.value);
    };
    AnnotationManager.prototype.addArrow = function (from, to) {
        this._arrows.push(new Arrow(math_1.Vector3.FromArray(from), math_1.Vector3.FromArray(to), this._scene));
    };
    AnnotationManager.prototype.addLabel = function (text, position) {
        this._addLabelTextInput.value = "";
        var labelIdx = this.labels.length;
        var pos;
        if (position) {
            pos = math_1.Vector3.FromArray(position);
        }
        else {
            pos = new math_1.Vector3(0, this._ymax + 2, 0);
        }
        var newLabel = new Label(text, pos, this._scene);
        this.labels.push(newLabel);
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
        editLabelInput.dataset.labelnum = labelIdx.toString();
        editLabelInput.onkeyup = this._editLabelText.bind(this);
        editLabelForm.appendChild(editLabelInput);
        var rmvLabelBtn = document.createElement("button");
        rmvLabelBtn.innerText = "Remove Label";
        rmvLabelBtn.onclick = this._removeLabel.bind(this);
        rmvLabelBtn.dataset.labelnum = labelIdx.toString();
        editLabelForm.appendChild(rmvLabelBtn);
        editLabelForm.dataset.labelnum = labelIdx.toString();
        this._editLabelForms.push(editLabelForm);
        this._editLabelContainer.appendChild(editLabelForm);
        this._showLabels = true;
        return labelIdx;
    };
    AnnotationManager.prototype.addLabels = function (labelList) {
        for (var i = 0; i < labelList.length; i++) {
            var label = labelList[i];
            var text = label[3];
            var position = label.slice(0, 3);
            this.addLabel(text, position);
        }
    };
    AnnotationManager.prototype._editLabelText = function (ev) {
        var inputElem = ev.target;
        this.labels[parseInt(inputElem.dataset.labelnum)].setText(inputElem.value);
    };
    AnnotationManager.prototype._removeLabel = function (ev) {
        var btn = ev.target;
        var labelNum = parseInt(btn.dataset.labelnum);
        this.labels[labelNum].dispose();
        this.labels.splice(labelNum, 1);
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
    AnnotationManager.prototype.exportLabels = function () {
        var labels = [];
        for (var i = 0; i < this.labels.length; i++) {
            labels.push(this.labels[i].export());
        }
        return labels;
    };
    AnnotationManager.prototype.fixLabels = function () {
        for (var i = 0; i < this.labels.length; i++) {
            this.labels[i].fix();
        }
        this.fixedLabels = true;
    };
    AnnotationManager.prototype.unfixLabels = function () {
        for (var i = 0; i < this.labels.length; i++) {
            this.labels[i].unfix();
        }
        this.fixedLabels = false;
    };
    return AnnotationManager;
}());
exports.AnnotationManager = AnnotationManager;
function makeDraggable(label) {
    var labelDragBehavior = new pointerDragBehavior_1.PointerDragBehavior();
    label.addBehavior(labelDragBehavior);
}
//# sourceMappingURL=Label.js.map