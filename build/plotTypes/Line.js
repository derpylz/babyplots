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
exports.Line = void 0;
var math_1 = require("@babylonjs/core/Maths/math");
var babyplots_1 = require("../babyplots");
var linesBuilder_1 = require("@babylonjs/core/Meshes/Builders/linesBuilder");
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(scene, coordinates, colorVar, size, legendData, hasAnimation, animationDelay, animationDuration, xScale, yScale, zScale, name, labels, labelSize, labelColor, annotationManager) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        if (name === void 0) { name = "line"; }
        var _this = _super.call(this, name, "line", scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale) || this;
        _this._looping = false;
        _this._animDirection = 1;
        _this._animationFrames = 200;
        _this._animationDelay = 100;
        _this._hasAnimation = hasAnimation;
        if (labels && labels.length === coordinates.length && annotationManager) {
            _this.labels = labels;
            _this.labelSize = labelSize;
            _this.labelColor = labelColor;
            _this._addLabels(annotationManager);
        }
        _this._createLine();
        _this.allLoaded = true;
        return _this;
    }
    Line.prototype._createLine = function () {
        var lineCoords = [];
        for (var i = 0; i < this._coords.length; i++) {
            var point = this._coords[i];
            lineCoords.push(new math_1.Vector3(point[0], point[1], point[2]));
        }
        var lineColors = [];
        for (var i = 0; i < this._coordColors.length; i++) {
            var pointColor = this._coordColors[i];
            lineColors.push(math_1.Color4.FromHexString(pointColor));
        }
        var lines = linesBuilder_1.LinesBuilder.CreateLines("lines", { points: lineCoords, colors: lineColors });
        this.mesh = lines;
    };
    Line.prototype._addLabels = function (annotationManager) {
        for (var i = 0; i < this.labels.length; i++) {
            var col = this.labelColor;
            if (this.labelColor === "match") {
                col = this._coordColors[i];
            }
            annotationManager.addLabel(this.labels[i], this._coords[i], col, this.labelSize);
        }
        annotationManager.fixLabels();
    };
    return Line;
}(babyplots_1.CoordinatePlot));
exports.Line = Line;
//# sourceMappingURL=Line.js.map