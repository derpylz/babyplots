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
exports.MeshObject = void 0;
var math_1 = require("@babylonjs/core/Maths/math");
var sceneLoader_1 = require("@babylonjs/core/Loading/sceneLoader");
var Plot_1 = require("../utils/Plot");
require("@babylonjs/loaders/glTF");
var MeshObject = (function (_super) {
    __extends(MeshObject, _super);
    function MeshObject(scene, meshString, legendData, xScale, yScale, zScale, scaling, rotation, offset, name) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        if (scaling === void 0) { scaling = []; }
        if (rotation === void 0) { rotation = []; }
        if (offset === void 0) { offset = []; }
        if (name === void 0) { name = "mesh object"; }
        var _this = _super.call(this, name, "meshObject", scene, legendData, xScale, yScale, zScale) || this;
        sceneLoader_1.SceneLoader.ImportMesh("", "", "data:" + meshString, scene, function (meshes, _, __) {
            var rootMesh = meshes[0];
            if (scaling.length === 3) {
                rootMesh.scaling = new math_1.Vector3(scaling[0], scaling[1], scaling[2]);
            }
            if (rotation.length === 3) {
                rootMesh.rotationQuaternion = null;
                rootMesh.rotate(math_1.Axis.X, rotation[0], math_1.Space.LOCAL);
                rootMesh.rotate(math_1.Axis.Y, rotation[1], math_1.Space.LOCAL);
                rootMesh.rotate(math_1.Axis.Z, rotation[2], math_1.Space.LOCAL);
            }
            if (offset.length === 3) {
                meshes[0].position = new math_1.Vector3(offset[0], offset[1], offset[2]);
            }
        });
        return _this;
    }
    return MeshObject;
}(Plot_1.Plot));
exports.MeshObject = MeshObject;
//# sourceMappingURL=MeshObject.js.map