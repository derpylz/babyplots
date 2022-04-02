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
var Plot_1 = require("../utils/Plot");
var linesBuilder_1 = require("@babylonjs/core/Meshes/Builders/linesBuilder");
var Line = (function (_super) {
    __extends(Line, _super);
    function Line(scene, coordinates, colorVar, size, legendData, hasAnimation, animationDelay, animationDuration, xScale, yScale, zScale, name, labels, labelSize, labelColor, annotationManager) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        if (name === void 0) { name = "line"; }
        var _a, _b;
        var _this = _super.call(this, name, "line", scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale) || this;
        _this._looping = false;
        _this._animDirection = 1;
        _this._animationCounter = 0;
        _this._animationFrames = 200;
        _this._animationDelay = 100;
        _this._segmentVectors = [];
        _this._hasAnimation = hasAnimation;
        _this._animationDelay = (_a = _this._animationDelay) !== null && _a !== void 0 ? _a : animationDelay;
        _this._animationFrames = (_b = _this._animationFrames) !== null && _b !== void 0 ? _b : animationDuration;
        if (labels && labels.length === coordinates.length && annotationManager) {
            _this.labels = labels;
            _this.labelSize = labelSize;
            _this.labelColor = labelColor;
            _this._addLabels(annotationManager);
        }
        if (_this._hasAnimation) {
            _this._framesPerSegment = Math.ceil(_this._animationFrames / (_this._coords.length - 1));
            _this._animationFrames = _this._framesPerSegment * (_this._coords.length - 1);
            for (var iSegment = 0; iSegment < _this._coords.length - 1; iSegment++) {
                var segmentStart = _this._coords[iSegment];
                var segmentEnd = _this._coords[iSegment + 1];
                var fv = new math_1.Vector3(segmentEnd[0] * _this.xScale, segmentEnd[1] * _this.yScale, segmentEnd[2] * _this.zScale).subtractFromFloats(segmentStart[0] * _this.xScale, segmentStart[1] * _this.yScale, segmentStart[2] * _this.zScale);
                _this._segmentVectors.push(fv.divide(new math_1.Vector3(_this._framesPerSegment, _this._framesPerSegment, _this._framesPerSegment)));
            }
        }
        _this._createLine();
        _this.allLoaded = true;
        return _this;
    }
    Line.prototype._createLine = function () {
        var lineCoords = [];
        var lineColors = [];
        if (this._hasAnimation) {
            lineCoords[0] = new math_1.Vector3(this._coords[0][0] * this.xScale, this._coords[0][1] * this.yScale, this._coords[0][2] * this.zScale);
            lineCoords[1] = lineCoords[0].add(this._segmentVectors[0]);
            lineColors.push(math_1.Color4.FromHexString(this._coordColors[0]), math_1.Color4.FromHexString(this._coordColors[1]));
        }
        else {
            for (var i = 0; i < this._coords.length; i++) {
                var point = this._coords[i];
                lineCoords.push(new math_1.Vector3(point[0] * this.xScale, point[1] * this.yScale, point[2] * this.zScale));
                var pointColor = this._coordColors[i];
                lineColors.push(math_1.Color4.FromHexString(pointColor));
            }
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
            annotationManager.addLabel(this.labels[i], this._coords[i], col, this.labelSize, this);
        }
        annotationManager.fixLabels();
    };
    Line.prototype.resetAnimation = function () {
        this._hasAnimation = true;
        this.mesh.dispose();
        var lineCoords = [];
        var lineColors = [];
        lineCoords[0] = new math_1.Vector3(this._coords[0][0] * this.xScale, this._coords[0][1] * this.yScale, this._coords[0][2] * this.zScale);
        lineCoords[1] = lineCoords[0].add(this._segmentVectors[0]);
        lineColors.push(math_1.Color4.FromHexString(this._coordColors[0]), math_1.Color4.FromHexString(this._coordColors[1]));
        var lines = linesBuilder_1.LinesBuilder.CreateLines("lines", { points: lineCoords, colors: lineColors });
        this.mesh = lines;
        this._animationCounter = 0;
    };
    Line.prototype.setLooping = function (looping) {
        this._looping = looping;
        this.resetAnimation();
    };
    Line.prototype.update = function () {
        if (this.mesh && this._hasAnimation) {
            if (this._animationCounter < this._animationDelay) {
                this._animationCounter += 1;
                return this._hasAnimation;
            }
            if (this._animationCounter < this._animationFrames + this._animationDelay) {
                var animFrame = this._animationCounter - this._animationDelay;
                var currSegment = Math.floor(animFrame / this._framesPerSegment);
                var lineCoords = [];
                var lineColors = [];
                lineCoords[0] = new math_1.Vector3(this._coords[0][0] * this.xScale, this._coords[0][1] * this.yScale, this._coords[0][2] * this.zScale);
                lineColors[0] = math_1.Color4.FromHexString(this._coordColors[0]);
                for (var i = 0; i < currSegment; i++) {
                    lineCoords.push(new math_1.Vector3(this._coords[i + 1][0] * this.xScale, this._coords[i + 1][1] * this.yScale, this._coords[i + 1][2] * this.zScale));
                    lineColors.push(math_1.Color4.FromHexString(this._coordColors[i + 1]));
                }
                var progressOnSegment = animFrame % this._framesPerSegment;
                lineCoords.push(lineCoords[currSegment].add(this._segmentVectors[currSegment].multiplyByFloats(progressOnSegment, progressOnSegment, progressOnSegment)));
                lineColors.push(math_1.Color4.FromHexString(this._coordColors[currSegment + 1]));
                this.mesh.dispose();
                var lines = linesBuilder_1.LinesBuilder.CreateLines("lines", { points: lineCoords, colors: lineColors });
                this.mesh = lines;
                this._animationCounter += 1;
            }
            else {
                if (this._looping) {
                    this._animationCounter = 0;
                }
                else {
                    this._hasAnimation = false;
                    var lineCoords = [];
                    var lineColors = [];
                    for (var i = 0; i < this._coords.length; i++) {
                        var point = this._coords[i];
                        lineCoords.push(new math_1.Vector3(point[0] * this.xScale, point[1] * this.yScale, point[2] * this.zScale));
                        var pointColor = this._coordColors[i];
                        lineColors.push(math_1.Color4.FromHexString(pointColor));
                    }
                    var lines = linesBuilder_1.LinesBuilder.CreateLines("lines", { points: lineCoords, colors: lineColors });
                    this.mesh.dispose();
                    this.mesh = lines;
                }
            }
        }
        return this._hasAnimation;
    };
    return Line;
}(Plot_1.CoordinatePlot));
exports.Line = Line;
//# sourceMappingURL=Line.js.map