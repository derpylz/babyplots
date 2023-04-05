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
exports.CoordinatePlot = exports.Plot = void 0;
var Plot = (function () {
    function Plot(name, shape, scene, legendData, xScale, yScale, zScale) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        this.allLoaded = false;
        this.pickable = false;
        this.name = name;
        this.shape = shape;
        this._scene = scene;
        this.legendData = legendData;
        this.xScale = xScale;
        this.yScale = yScale;
        this.zScale = zScale;
    }
    Plot.prototype.goToFrame = function (n) { };
    Plot.prototype.update = function () { return false; };
    Plot.prototype.updateProperties = function (coordinates, colors, legendData) { };
    Plot.prototype.resetAnimation = function () { };
    Plot.prototype.setLooping = function (looping) { };
    Plot.prototype.dispose = function () {
        if (this.mesh !== undefined) {
            this.mesh.dispose();
        }
        if (this.meshes !== undefined) {
            for (var i = 0; i < this.meshes.length; i++) {
                var m = this.meshes[i];
                m.dispose();
            }
        }
    };
    return Plot;
}());
exports.Plot = Plot;
var CoordinatePlot = (function (_super) {
    __extends(CoordinatePlot, _super);
    function CoordinatePlot(name, shape, scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        var _this = _super.call(this, name, shape, scene, legendData, xScale, yScale, zScale) || this;
        _this._size = 1;
        _this.pickable = true;
        _this._coords = coordinates;
        _this._coordColors = colorVar;
        _this._size = size;
        return _this;
    }
    CoordinatePlot.prototype.getPick = function (pickResult) { return null; };
    return CoordinatePlot;
}(Plot));
exports.CoordinatePlot = CoordinatePlot;
//# sourceMappingURL=Plot.js.map