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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgStack = void 0;
var mesh_1 = require("@babylonjs/core/Meshes/mesh");
var math_1 = require("@babylonjs/core/Maths/math");
var mesh_vertexData_1 = require("@babylonjs/core/Meshes/mesh.vertexData");
var standardMaterial_1 = require("@babylonjs/core/Materials/standardMaterial");
var babyplots_1 = require("../babyplots");
var Plot_1 = require("../utils/Plot");
var chroma_js_1 = __importDefault(require("chroma-js"));
var ImgStack = (function (_super) {
    __extends(ImgStack, _super);
    function ImgStack(scene, values, indices, attributes, legendData, size, backgroundColor, intensityMode, xScale, yScale, zScale, channelColors, channelOpacities, name) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        if (channelColors === void 0) { channelColors = ["#ff0000", "#00ff00", "#0000ff"]; }
        if (channelOpacities === void 0) { channelOpacities = [1, 1, 1]; }
        if (name === void 0) { name = "image stack"; }
        var _this = this;
        var colSize = attributes.dim[0];
        var rowSize = attributes.dim[1];
        var channels = attributes.dim[2];
        var slices = attributes.dim[3];
        var channelSize = colSize * rowSize;
        var sliceSize = channelSize * channels;
        var coords = [];
        var Intensities = [];
        for (var i = 0; i < channels; i++) {
            coords.push([]);
            Intensities.push([]);
        }
        for (var i = 0; i < indices.length; i++) {
            var index = indices[i];
            var slice = Math.floor(index / sliceSize);
            var sliceIndex = index - sliceSize * slice;
            var channel = Math.floor(sliceIndex / channelSize);
            var channelIndex = sliceIndex - channelSize * channel;
            var row = Math.floor(channelIndex / colSize);
            var col = channelIndex % colSize;
            coords[channel].push([
                col * xScale,
                row * yScale,
                slice * zScale
            ]);
            Intensities[channel].push(values[i]);
        }
        _this = _super.call(this, name, "imgStack", scene, legendData, xScale, yScale, zScale) || this;
        _this.size = size;
        _this.legendData;
        _this._channelCoords = coords;
        _this._channelCoordIntensities = Intensities;
        _this._backgroundColor = backgroundColor;
        _this._intensityMode = intensityMode;
        _this._channelColors = channelColors;
        _this._channelOpacities = channelOpacities;
        _this.meshes = [];
        _this._createImgStack();
        _this.allLoaded = true;
        return _this;
    }
    ImgStack.prototype._createImgStack = function () {
        var positions = [];
        var colors = [];
        for (var c = 0; c < this._channelCoords.length; c++) {
            var channelIntensities = this._channelCoordIntensities[c];
            if (channelIntensities.length === 0) {
                continue;
            }
            var channelCoords = this._channelCoords[c];
            var channelColor = this._channelColors[c];
            var channelColorRGB = (0, chroma_js_1.default)(channelColor).rgb();
            channelColorRGB[0] = channelColorRGB[0] / 255;
            channelColorRGB[1] = channelColorRGB[1] / 255;
            channelColorRGB[2] = channelColorRGB[2] / 255;
            if (this._intensityMode === "alpha") {
                var alphaLevels = 10;
                var minIntensity = (0, babyplots_1.getArrayMin)(channelIntensities);
                var alphaPositions = [];
                var alphaColors = [];
                var alphaIntensities = [];
                for (var i = 0; i < alphaLevels; i++) {
                    alphaPositions.push([]);
                    alphaColors.push([]);
                    alphaIntensities.push((i + 1) * (1 / alphaLevels) * this._channelOpacities[c]);
                }
                for (var p = 0; p < channelCoords.length; p++) {
                    for (var intens = 0; intens < alphaIntensities.length; intens++) {
                        var testIntensity = alphaIntensities[intens];
                        if ((channelIntensities[p] - minIntensity) / (1 - minIntensity) <= testIntensity) {
                            alphaPositions[intens].push(channelCoords[p][2], channelCoords[p][0], channelCoords[p][1]);
                            alphaColors[intens].push(channelColorRGB[0], channelColorRGB[1], channelColorRGB[2], 1);
                            break;
                        }
                    }
                }
                for (var intensIdx = 0; intensIdx < alphaIntensities.length; intensIdx++) {
                    if (alphaColors[intensIdx].length <= 4) {
                        continue;
                    }
                    var customMesh = new mesh_1.Mesh("custom-".concat(c, "_").concat(intensIdx), this._scene);
                    var intensity = alphaIntensities[intensIdx];
                    var vertexData = new mesh_vertexData_1.VertexData();
                    vertexData.positions = alphaPositions[intensIdx];
                    vertexData.colors = alphaColors[intensIdx];
                    vertexData.applyToMesh(customMesh, true);
                    var mat = new standardMaterial_1.StandardMaterial("mat-".concat(c, "_").concat(intensIdx), this._scene);
                    mat.emissiveColor = new math_1.Color3(1, 1, 1);
                    mat.disableLighting = true;
                    mat.pointsCloud = true;
                    mat.pointSize = this.size;
                    mat.alpha = intensity;
                    customMesh.material = mat;
                    this.meshes.push(customMesh);
                }
            }
            else {
                for (var p = 0; p < channelCoords.length; p++) {
                    positions.push(channelCoords[p][2], channelCoords[p][0], channelCoords[p][1]);
                    if (this._intensityMode === "mix") {
                        var colormix = chroma_js_1.default.mix(this._backgroundColor, channelColor, channelIntensities[p]).rgb();
                        colors.push(colormix[0] / 255, colormix[1] / 255, colormix[2] / 255, 1);
                    }
                    else {
                        colors.push(channelColorRGB[0], channelColorRGB[1], channelColorRGB[2], 1);
                    }
                }
                var customMesh = new mesh_1.Mesh("custom-".concat(c), this._scene);
                var vertexData = new mesh_vertexData_1.VertexData();
                vertexData.positions = positions;
                vertexData.colors = colors;
                vertexData.applyToMesh(customMesh, true);
                var mat = new standardMaterial_1.StandardMaterial("mat-".concat(c), this._scene);
                mat.emissiveColor = new math_1.Color3(1, 1, 1);
                mat.disableLighting = true;
                mat.pointsCloud = true;
                mat.pointSize = this.size;
                customMesh.material = mat;
                this.meshes.push(customMesh);
            }
        }
    };
    return ImgStack;
}(Plot_1.Plot));
exports.ImgStack = ImgStack;
//# sourceMappingURL=ImgStack.js.map