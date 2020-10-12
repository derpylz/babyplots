"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatMap = void 0;
var math_1 = require("@babylonjs/core/Maths/math");
var boxBuilder_1 = require("@babylonjs/core/Meshes/Builders/boxBuilder");
var planeBuilder_1 = require("@babylonjs/core/Meshes/Builders/planeBuilder");
var standardMaterial_1 = require("@babylonjs/core/Materials/standardMaterial");
var babyplots_1 = require("./babyplots");
var HeatMap = (function (_super) {
    __extends(HeatMap, _super);
    function HeatMap(scene, coordinates, colorVar, size, scaleColumn, scaleRow, legendData) {
        var _this = _super.call(this, scene, coordinates, colorVar, size, legendData) || this;
        _this.scaleColumn = scaleColumn;
        _this.scaleRow = scaleRow;
        _this._createHeatMap();
        return _this;
    }
    HeatMap.prototype._createHeatMap = function () {
        var max = babyplots_1.matrixMax(this._coords);
        var boxes = [];
        for (var row = 0; row < this._coords.length; row++) {
            var rowCoords = this._coords[row];
            for (var column = 0; column < rowCoords.length; column++) {
                var coord = rowCoords[column];
                if (coord > 0) {
                    var height = coord / max * this._size;
                    var box = boxBuilder_1.BoxBuilder.CreateBox("box_" + row + "-" + column, {
                        height: height,
                        width: this.scaleColumn,
                        depth: this.scaleRow
                    }, this._scene);
                    box.position = new math_1.Vector3(row * this.scaleColumn + 0.5 * this.scaleColumn, height / 2, column * this.scaleRow + 0.5 * this.scaleRow);
                    var mat = new standardMaterial_1.StandardMaterial("box_" + row + "-" + column + "_color", this._scene);
                    mat.alpha = 1;
                    mat.diffuseColor = math_1.Color3.FromHexString(this._coordColors[column + row * rowCoords.length].substring(0, 7));
                    box.material = mat;
                    boxes.push(box);
                }
                else {
                    var box = planeBuilder_1.PlaneBuilder.CreatePlane("box_" + row + "-" + column, { width: this.scaleColumn, height: this.scaleRow }, this._scene);
                    box.position = new math_1.Vector3(row * this.scaleColumn + 0.5 * this.scaleColumn, 0, column * this.scaleRow + 0.5 * this.scaleRow);
                    box.rotation.x = Math.PI / 2;
                    var mat = new standardMaterial_1.StandardMaterial("box_" + row + "-" + column + "_color", this._scene);
                    mat.alpha = 1;
                    mat.diffuseColor = math_1.Color3.FromHexString(this._coordColors[column + row * rowCoords.length].substring(0, 7));
                    mat.backFaceCulling = false;
                    box.material = mat;
                    boxes.push(box);
                }
            }
        }
        this.meshes = boxes;
        Object.defineProperty(this, "alpha", {
            set: function (newAlpha) {
                for (var i = 0; i < this.meshes.length; i++) {
                    var box = this.meshes[i];
                    box.material.alpha = newAlpha;
                }
            }
        });
    };
    return HeatMap;
}(babyplots_1.Plot));
exports.HeatMap = HeatMap;
//# sourceMappingURL=HeatMap.js.map