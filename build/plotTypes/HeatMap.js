"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
var Plot_1 = require("../utils/Plot");
var HeatMap = (function (_super) {
    __extends(HeatMap, _super);
    function HeatMap(scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale, name) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        if (name === void 0) { name = "heat map"; }
        var _this = _super.call(this, name, "heatmap", scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale) || this;
        _this._createHeatMap();
        _this.allLoaded = true;
        return _this;
    }
    HeatMap.prototype._createHeatMap = function () {
        var boxes = [];
        for (var row = 0; row < this._coords.length; row++) {
            var rowCoords = this._coords[row];
            for (var column = 0; column < rowCoords.length; column++) {
                var coord = rowCoords[column];
                if (coord > 0) {
                    var height = coord * this.yScale;
                    var box = (0, boxBuilder_1.CreateBox)("box_" + row + "-" + column, {
                        height: height,
                        width: this.xScale * this._size,
                        depth: this.zScale * this._size
                    }, this._scene);
                    box.position = new math_1.Vector3(row * this.xScale + 0.5 * this.xScale, height / 2, column * this.zScale + 0.5 * this.zScale);
                    var mat = new standardMaterial_1.StandardMaterial("box_" + row + "-" + column + "_color", this._scene);
                    mat.alpha = 1;
                    mat.diffuseColor = math_1.Color3.FromHexString(this._coordColors[column + row * rowCoords.length].substring(0, 7));
                    box.material = mat;
                    boxes.push(box);
                }
                else {
                    var box = (0, planeBuilder_1.CreatePlane)("box_" + row + "-" + column, {
                        width: this.xScale * this._size,
                        height: this.zScale * this._size
                    }, this._scene);
                    box.position = new math_1.Vector3(row * this.xScale + 0.5 * this.xScale, 0, column * this.zScale + 0.5 * this.zScale);
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
}(Plot_1.CoordinatePlot));
exports.HeatMap = HeatMap;
//# sourceMappingURL=HeatMap.js.map