"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationManager = void 0;
var math_1 = require("@babylonjs/core/Maths/math");
var planeBuilder_1 = require("@babylonjs/core/Meshes/Builders/planeBuilder");
var pointerDragBehavior_1 = require("@babylonjs/core/Behaviors/Meshes/pointerDragBehavior");
var advancedDynamicTexture_1 = require("@babylonjs/gui/2D/advancedDynamicTexture");
var controls_1 = require("@babylonjs/gui/2D/controls");
var chroma_js_1 = __importDefault(require("chroma-js"));
var dpInfo = (function () {
    function dpInfo(text, target, uiLayer, backgroundColor, color) {
        this.disposed = false;
        this._bgColor = backgroundColor;
        this._txtColor = color;
        this.target = target;
        this._uiLayer = uiLayer;
        this._text = text;
        this.draw();
    }
    dpInfo.prototype.draw = function () {
        this.disposed = false;
        this._background = new controls_1.Rectangle();
        this._uiLayer.addControl(this._background);
        var rows = this._text.split("\n");
        var maxRowLen = 0;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.length > maxRowLen) {
                maxRowLen = row.length;
            }
        }
        var fontSize = 12;
        this._background.widthInPixels = maxRowLen * fontSize + 6;
        this._background.heightInPixels = rows.length * (fontSize + 4) + 6;
        this._background.linkWithMesh(this.target);
        this._background.background = this._bgColor;
        this._background.alpha = 0.8;
        this._background.linkOffsetY = -10;
        this._textBlock = new controls_1.TextBlock();
        this._textBlock.text = this._text;
        this._textBlock.fontSize = fontSize;
        this._textBlock.color = this._txtColor;
        this._background.addControl(this._textBlock);
        this._closeBtn = controls_1.Button.CreateSimpleButton("close", "x");
        this._background.addControl(this._closeBtn);
        this._closeBtn.topInPixels = -this._background.heightInPixels / 2 + 10;
        this._closeBtn.leftInPixels = this._background.widthInPixels / 2 - 10;
        this._closeBtn.widthInPixels = 20;
        this._closeBtn.heightInPixels = 20;
        this._closeBtn.fontSize = 10;
        this._closeBtn.background = this._txtColor;
        this._closeBtn.color = this._bgColor;
        this._closeBtn.onPointerClickObservable.add((function () {
            this.dispose();
        }).bind(this));
    };
    dpInfo.prototype.dispose = function () {
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
    };
    return dpInfo;
}());
var Label = (function () {
    function Label(text, position, scene, color, size, plotCreated) {
        this.size = 100;
        this.color = "black";
        this.fixed = false;
        if (size != null) {
            this.size = size;
        }
        var plane = planeBuilder_1.PlaneBuilder.CreatePlane('label', {
            width: this.size * 0.05,
            height: this.size * 0.05
        }, scene);
        if (color != null) {
            this.color = color;
        }
        this.plotCreated = plotCreated;
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
            this._text.text,
            this.color,
            this.size
        ];
    };
    return Label;
}());
var AnnotationManager = (function () {
    function AnnotationManager(canvas, scene, ymax, camera, backgroundColor, fullScreenUI, uniqID) {
        this._editLabelForms = [];
        this._showLabels = false;
        this._showArrows = false;
        this.dpInfos = [];
        this.labels = [];
        this.fixedLabels = false;
        this.fixedArrows = false;
        this._canvas = canvas;
        this._scene = scene;
        this._ymax = ymax;
        this._camera = camera;
        this._bgColor = backgroundColor;
        this._fgColor = "white";
        this._fullScreenUI = fullScreenUI;
        this._uniqID = uniqID;
        if (chroma_js_1.default(backgroundColor).luminance() > 0.5) {
            this._fgColor = "black";
        }
        this._createLabelForms();
    }
    AnnotationManager.prototype._createLabelForms = function () {
        var labelBox = document.createElement("div");
        labelBox.id = "labelControl_" + this._uniqID;
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
        if (this._showLabels) {
            for (var i = 0; i < this.labels.length; i++) {
                var label = this.labels[i];
                if (label === undefined)
                    continue;
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
    AnnotationManager.prototype.redrawInfo = function () {
        for (var i = this.dpInfos.length - 1; i >= 0; i--) {
            var dpInfo_1 = this.dpInfos[i];
            if (dpInfo_1.disposed) {
                this.dpInfos.splice(i, 1);
            }
            else {
                dpInfo_1.dispose();
                dpInfo_1.draw();
            }
        }
    };
    AnnotationManager.prototype.displayInfo = function (text, target) {
        var alreadyShown = false;
        for (var i = 0; i < this.dpInfos.length; i++) {
            var dpInfo_2 = this.dpInfos[i];
            if (dpInfo_2.target === target) {
                alreadyShown = true;
                if (dpInfo_2.disposed) {
                    dpInfo_2.draw();
                }
            }
        }
        if (!alreadyShown) {
            this.dpInfos.push(new dpInfo(text, target, this._fullScreenUI, this._bgColor, this._fgColor));
        }
    };
    AnnotationManager.prototype.clearInfo = function () {
        for (var i = 0; i < this.dpInfos.length; i++) {
            this.dpInfos[i].dispose();
        }
        this.dpInfos = [];
    };
    AnnotationManager.prototype.addLabel = function (text, position, color, size, plotCreated) {
        this._addLabelTextInput.value = "";
        var labelIdx = this.labels.length;
        var pos;
        if (position) {
            pos = math_1.Vector3.FromArray(position);
        }
        else {
            pos = new math_1.Vector3(0, this._ymax + 2, 0);
        }
        text = text.replace(/[\s\.]/g, "\n");
        text = text.replace(/_/g, " ");
        var col = this._fgColor;
        if (color != null) {
            col = color;
        }
        var newLabel = new Label(text, pos, this._scene, col, size, plotCreated);
        this.labels.push(newLabel);
        this._showLabels = true;
        if (plotCreated !== undefined) {
            return labelIdx;
        }
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
        rmvLabelBtn.onclick = this._removeLabelByUI.bind(this);
        rmvLabelBtn.dataset.labelnum = labelIdx.toString();
        editLabelForm.appendChild(rmvLabelBtn);
        editLabelForm.dataset.labelnum = labelIdx.toString();
        this._editLabelForms.push(editLabelForm);
        this._editLabelContainer.appendChild(editLabelForm);
        return labelIdx;
    };
    AnnotationManager.prototype.addLabels = function (labelList) {
        var labelIndices = [];
        for (var i = 0; i < labelList.length; i++) {
            var label = labelList[i];
            var position = label.slice(0, 3);
            var text = label[3];
            labelIndices.push(this.addLabel(text, position, label[4], label[5]));
        }
        return labelIndices;
    };
    AnnotationManager.prototype._editLabelText = function (ev) {
        var inputElem = ev.target;
        this.labels[parseInt(inputElem.dataset.labelnum)].setText(inputElem.value);
    };
    AnnotationManager.prototype._removeLabelByUI = function (ev) {
        var btn = ev.target;
        var labelNum = parseInt(btn.dataset.labelnum);
        this.removeLabel(labelNum);
    };
    AnnotationManager.prototype.removeLabelsByPlot = function (plot) {
        for (var i = 0; i < this.labels.length; i++) {
            var l = this.labels[i];
            if (l === undefined)
                continue;
            if (l.plotCreated === plot) {
                this.removeLabel(i);
            }
        }
    };
    AnnotationManager.prototype.removeLabel = function (index) {
        if (this.labels[index] === undefined)
            return;
        this.labels[index].dispose();
        this.labels[index] = undefined;
        this._editLabelForms.forEach(function (eLabelForm) {
            if (parseInt(eLabelForm.dataset.labelnum) === index) {
                eLabelForm.parentNode.removeChild(eLabelForm);
            }
        });
    };
    AnnotationManager.prototype.exportLabels = function () {
        var labels = [];
        for (var i = 0; i < this.labels.length; i++) {
            var l = this.labels[i];
            if (l === undefined)
                continue;
            if (l.plotCreated !== undefined)
                continue;
            labels.push(l.export());
        }
        return labels;
    };
    AnnotationManager.prototype.fixLabels = function () {
        for (var i = 0; i < this.labels.length; i++) {
            var l = this.labels[i];
            if (l === undefined)
                continue;
            l.fix();
        }
        this.fixedLabels = true;
    };
    AnnotationManager.prototype.unfixLabels = function () {
        for (var i = 0; i < this.labels.length; i++) {
            var l = this.labels[i];
            if (l === undefined)
                continue;
            if (l.plotCreated !== undefined)
                continue;
            l.unfix();
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