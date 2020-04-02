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
var mesh_1 = require("@babylonjs/core/Meshes/mesh");
var math_1 = require("@babylonjs/core/Maths/math");
var mesh_vertexData_1 = require("@babylonjs/core/Meshes/mesh.vertexData");
var standardMaterial_1 = require("@babylonjs/core/Materials/standardMaterial");
var babyplots_1 = require("./babyplots");
var ImgStack = (function (_super) {
    __extends(ImgStack, _super);
    function ImgStack(scene, values, indices, attributes, legendData, size) {
        var _this = this;
        var point_channel = [];
        var colSize = attributes.dim[0];
        var rowSize = attributes.dim[1];
        var channels = attributes.dim[2];
        var slices = attributes.dim[3];
        var channelSize = colSize * rowSize;
        var sliceSize = channelSize * channels;
        var coords = [];
        var colorVar = [];
        for (var i = 0; i < indices.length; i++) {
            var index = indices[i];
            var slice = Math.floor(index / sliceSize);
            var sliceIndex = index - sliceSize * slice;
            var channel = Math.floor(sliceIndex / channelSize);
            var channelIndex = sliceIndex - channelSize * channel;
            var row = Math.floor(channelIndex / colSize);
            var col = channelIndex % colSize;
            coords.push([col, row, slice * size]);
            colorVar.push(values[i]);
            point_channel.push(channel);
        }
        _this = _super.call(this, scene, coords, colorVar, 1, legendData) || this;
        _this._channels = point_channel;
        _this._createImgStack();
        return _this;
    }
    ImgStack.prototype._createImgStack = function () {
        var customMesh = new mesh_1.Mesh("custom", this._scene);
        var positions = [];
        var colors = [];
        for (var p = 0; p < this._coords.length; p++) {
            positions.push(this._coords[p][2], this._coords[p][0], this._coords[p][1]);
            if (this._channels[p] == 0) {
                colors.push(1, 0, 0, this._coordColors[p]);
            }
            else if (this._channels[p] == 1) {
                colors.push(0, 1, 0, this._coordColors[p]);
            }
            else {
                colors.push(0, 0, 1, this._coordColors[p]);
            }
        }
        var vertexData = new mesh_vertexData_1.VertexData();
        vertexData.positions = positions;
        vertexData.colors = colors;
        vertexData.applyToMesh(customMesh, true);
        var mat = new standardMaterial_1.StandardMaterial("mat", this._scene);
        mat.emissiveColor = new math_1.Color3(1, 1, 1);
        mat.disableLighting = true;
        mat.pointsCloud = true;
        mat.pointSize = this._size;
        customMesh.material = mat;
        this.mesh = customMesh;
    };
    return ImgStack;
}(babyplots_1.Plot));
exports.ImgStack = ImgStack;
//# sourceMappingURL=ImgStack.js.map