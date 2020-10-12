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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Surface = void 0;
var mesh_1 = require("@babylonjs/core/Meshes/mesh");
var mesh_vertexData_1 = require("@babylonjs/core/Meshes/mesh.vertexData");
var standardMaterial_1 = require("@babylonjs/core/Materials/standardMaterial");
var babyplots_1 = require("./babyplots");
var chroma_js_1 = __importDefault(require("chroma-js"));
var Surface = (function (_super) {
    __extends(Surface, _super);
    function Surface(scene, coordinates, colorVar, size, scaleColumn, scaleRow, legendData) {
        var _this = _super.call(this, scene, coordinates, colorVar, size, legendData) || this;
        _this.scaleColumn = scaleColumn;
        _this.scaleRow = scaleRow;
        _this._createSurface();
        return _this;
    }
    Surface.prototype._createSurface = function () {
        var max = babyplots_1.matrixMax(this._coords);
        var surface = new mesh_1.Mesh("surface", this._scene);
        var positions = [];
        var indices = [];
        for (var row = 0; row < this._coords.length; row++) {
            var rowCoords = this._coords[row];
            for (var column = 0; column < rowCoords.length; column++) {
                var coord = rowCoords[column];
                positions.push(column * this.scaleRow, coord / max * this._size, row * this.scaleColumn);
                if (row < this._coords.length - 1 && column < rowCoords.length - 1) {
                    indices.push(column + row * rowCoords.length, rowCoords.length + row * rowCoords.length + column, column + row * rowCoords.length + 1, column + row * rowCoords.length + 1, rowCoords.length + row * rowCoords.length + column, rowCoords.length + row * rowCoords.length + column + 1);
                }
            }
        }
        var colors = [];
        for (var i = 0; i < this._coordColors.length; i++) {
            var hex = this._coordColors[i];
            var rgba = chroma_js_1.default(hex).rgba();
            colors.push(rgba[0] / 255, rgba[1] / 255, rgba[2] / 255, rgba[3]);
        }
        var normals = [];
        var vertexData = new mesh_vertexData_1.VertexData();
        mesh_vertexData_1.VertexData.ComputeNormals(positions, indices, normals);
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.colors = colors;
        vertexData.normals = normals;
        vertexData.applyToMesh(surface);
        var mat = new standardMaterial_1.StandardMaterial("surfaceMat", this._scene);
        mat.backFaceCulling = false;
        mat.alpha = 1;
        surface.material = mat;
        this.mesh = surface;
        Object.defineProperty(this, "alpha", {
            set: function (newAlpha) {
                this.mesh.material.alpha = newAlpha;
            }
        });
    };
    return Surface;
}(babyplots_1.Plot));
exports.Surface = Surface;
//# sourceMappingURL=Surface.js.map