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
exports.ShapeCloud = void 0;
require("@babylonjs/core/Meshes/thinInstanceMesh");
var sphereBuilder_1 = require("@babylonjs/core/Meshes/Builders/sphereBuilder");
var boxBuilder_1 = require("@babylonjs/core/Meshes/Builders/boxBuilder");
var torusBuilder_1 = require("@babylonjs/core/Meshes/Builders/torusBuilder");
var cylinderBuilder_1 = require("@babylonjs/core/Meshes/Builders/cylinderBuilder");
var math_1 = require("@babylonjs/core/Maths/math");
var standardMaterial_1 = require("@babylonjs/core/Materials/standardMaterial");
var babyplots_1 = require("../babyplots");
var uuid_1 = require("uuid");
var transformNode_1 = require("@babylonjs/core/Meshes/transformNode");
var ShapeCloud = (function (_super) {
    __extends(ShapeCloud, _super);
    function ShapeCloud(scene, coordinates, colorVar, shape, shading, size, legendData, xScale, yScale, zScale, name, dpInfo) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        if (name === void 0) { name = "shape cloud"; }
        var _this = _super.call(this, name, "shape_" + shape, scene, coordinates, colorVar, size * 0.1, legendData, xScale, yScale, zScale) || this;
        _this._tNodes = [];
        _this._shape = shape;
        _this._shading = shading;
        if (dpInfo && dpInfo.length === coordinates.length) {
            _this.dpInfo = dpInfo;
        }
        _this._createShapeCloud();
        return _this;
    }
    ShapeCloud.prototype._createShapeCloud = function () {
        var instanceCount = this._coords.length;
        var matricesData = new Float32Array(16 * instanceCount);
        var colorData = new Float32Array(4 * instanceCount);
        for (var i = 0; i < instanceCount; i++) {
            var matrix = math_1.Matrix.Translation(this._coords[i][0] * this.xScale, this._coords[i][1] * this.zScale, this._coords[i][2] * this.yScale);
            matrix.copyToArray(matricesData, i * 16);
            var col = math_1.Color4.FromHexString(this._coordColors[i]);
            colorData.set(col.asArray(), i * 4);
        }
        var origMesh;
        var mid = "root:" + uuid_1.v4();
        switch (this._shape) {
            case "box":
                origMesh = boxBuilder_1.BoxBuilder.CreateBox(mid, { size: this._size });
                break;
            case "sphere":
                origMesh = sphereBuilder_1.SphereBuilder.CreateSphere(mid, { diameter: this._size });
                break;
            case "cone":
                origMesh = cylinderBuilder_1.CylinderBuilder.CreateCylinder(mid, { height: this._size, diameterBottom: this._size, diameterTop: 0 }, this._scene);
                break;
            case "torus":
                origMesh = torusBuilder_1.TorusBuilder.CreateTorus(mid, { diameter: this._size, thickness: this._size * 0.5 }, this._scene);
                break;
            case "cylinder":
                origMesh = cylinderBuilder_1.CylinderBuilder.CreateCylinder(mid, { height: this._size, diameter: this._size }, this._scene);
                break;
            default:
                origMesh = boxBuilder_1.BoxBuilder.CreateBox(mid, { size: this._size });
                break;
        }
        origMesh.thinInstanceSetBuffer("matrix", matricesData, 16, true);
        origMesh.thinInstanceSetBuffer("color", colorData, 4, true);
        var mat = new standardMaterial_1.StandardMaterial("shapeMat", this._scene);
        if (!this._shading) {
            mat.disableLighting = true;
            mat.emissiveColor = math_1.Color3.White();
        }
        origMesh.material = mat;
        this.mesh = origMesh;
        Object.defineProperty(this, "alpha", {
            set: function (newAlpha) {
                this.mesh.material.alpha = newAlpha;
            }
        });
        if (this.dpInfo) {
            origMesh.thinInstanceEnablePicking = true;
        }
    };
    ShapeCloud.prototype.getPick = function (pickResult) {
        var pickCoords = math_1.Vector3.FromArray(this._coords[pickResult.thinInstanceIndex]);
        var target;
        for (var i = 0; i < this._tNodes.length; i++) {
            var tNode = this._tNodes[i];
            if (pickCoords.equals(tNode.position)) {
                target = tNode;
            }
        }
        if (target === undefined) {
            target = new transformNode_1.TransformNode("pickNode");
            target.position = pickCoords;
            this._tNodes.push(target);
        }
        var pick = {
            target: target,
            info: this.dpInfo[pickResult.thinInstanceIndex]
        };
        return pick;
    };
    return ShapeCloud;
}(babyplots_1.CoordinatePlot));
exports.ShapeCloud = ShapeCloud;
//# sourceMappingURL=ShapeCloud.js.map