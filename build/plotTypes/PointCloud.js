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
exports.PointCloud = void 0;
var mesh_1 = require("@babylonjs/core/Meshes/mesh");
var math_1 = require("@babylonjs/core/Maths/math");
var mesh_vertexData_1 = require("@babylonjs/core/Meshes/mesh.vertexData");
var standardMaterial_1 = require("@babylonjs/core/Materials/standardMaterial");
var babyplots_1 = require("../babyplots");
var PointCloud = (function (_super) {
    __extends(PointCloud, _super);
    function PointCloud(scene, coordinates, colorVar, size, legendData, hasAnimation, animationTargets, animationDelay, animationDuration, xScale, yScale, zScale, name) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        if (name === void 0) { name = "point cloud"; }
        var _this = _super.call(this, name, "point", scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale) || this;
        _this._pointPicking = false;
        _this._selectionCallback = function (selection) { return false; };
        _this._looping = false;
        _this._animDirection = 1;
        _this._animationVectors = [];
        _this._animationCounter = 0;
        _this._animationFrames = 200;
        _this._animationVectorFract = [];
        _this._animationDelay = 100;
        _this._hasAnimation = hasAnimation;
        if (animationDelay) {
            _this._animationDelay = animationDelay;
        }
        if (animationDuration) {
            _this._animationFrames = animationDuration;
        }
        if (hasAnimation) {
            if (animationTargets) {
                for (var i = 0; i < animationTargets.length; i++) {
                    if (animationTargets[i].length == 2) {
                        animationTargets[i].push(0);
                    }
                    var fv = new math_1.Vector3(coordinates[i][0] * _this.xScale, coordinates[i][2] * _this.zScale, coordinates[i][1] * _this.yScale).subtractFromFloats(animationTargets[i][0] * _this.xScale, 0, animationTargets[i][1] * _this.yScale);
                    _this._animationVectors.push(fv);
                    _this._animationVectorFract.push(fv.divide(new math_1.Vector3(_this._animationFrames, _this._animationFrames, _this._animationFrames)));
                }
                _this._animationTargets = animationTargets;
            }
            else {
                animationTargets = JSON.parse(JSON.stringify(coordinates));
                for (var i = 0; i < animationTargets.length; i++) {
                    animationTargets[i][2] = 0;
                    var fv = new math_1.Vector3(coordinates[i][0] * _this.xScale, coordinates[i][2] * _this.zScale, coordinates[i][1] * _this.yScale).subtractFromFloats(animationTargets[i][0] * _this.xScale, 0, animationTargets[i][1] * _this.yScale);
                    _this._animationVectors.push(fv);
                    _this._animationVectorFract.push(fv.divide(new math_1.Vector3(_this._animationFrames, _this._animationFrames, _this._animationFrames)));
                }
                _this._animationTargets = animationTargets;
            }
        }
        _this._createPointCloud();
        return _this;
    }
    PointCloud.prototype._createPointCloud = function () {
        var customMesh = new mesh_1.Mesh("custom", this._scene);
        var positions = [];
        var colors = [];
        if (this._hasAnimation) {
            for (var p = 0; p < this._coords.length; p++) {
                positions.push(this._animationTargets[p][0] * this.xScale, this._animationTargets[p][2] * this.zScale, this._animationTargets[p][1] * this.yScale);
                var col = math_1.Color4.FromHexString(this._coordColors[p]);
                colors.push(col.r, col.g, col.b, col.a);
            }
        }
        else {
            for (var p = 0; p < this._coords.length; p++) {
                positions.push(this._coords[p][0] * this.xScale, this._coords[p][2] * this.zScale, this._coords[p][1] * this.yScale);
                var col = math_1.Color4.FromHexString(this._coordColors[p]);
                colors.push(col.r, col.g, col.b, col.a);
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
        Object.defineProperty(this, "alpha", {
            set: function (newAlpha) {
                this.mesh.material.alpha = newAlpha;
            }
        });
    };
    PointCloud.prototype.resetAnimation = function () {
        this._hasAnimation = true;
        var positionFunction = function (positions) {
            var numberOfVertices = positions.length / 3;
            for (var i = 0; i < numberOfVertices; i++) {
                positions[i * 3] = this._animationTargets[i][0] * this.xScale;
                positions[i * 3 + 1] = this._animationTargets[i][2] * this.zScale;
                positions[i * 3 + 2] = this._animationTargets[i][1] * this.yScale;
            }
        };
        this.mesh.updateMeshPositions(positionFunction.bind(this), true);
        this.mesh.refreshBoundingInfo();
        this._animationCounter = 0;
        this._animDirection = 1;
    };
    PointCloud.prototype.setLooping = function (looping) {
        this._looping = looping;
        this.resetAnimation();
    };
    PointCloud.prototype.update = function () {
        if (this.mesh && this._hasAnimation) {
            if (this._animationCounter < this._animationDelay) {
                this._animationCounter += 1;
            }
            else if (this._animationCounter < this._animationFrames + this._animationDelay) {
                var positionFunction = function (positions) {
                    var numberOfVertices = positions.length / 3;
                    for (var i = 0; i < numberOfVertices; i++) {
                        var posVector = new math_1.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                        var vectorFractDir = this._animationVectorFract[i].multiplyByFloats(this._animDirection, this._animDirection, this._animDirection);
                        posVector = posVector.addInPlace(vectorFractDir);
                        positions[i * 3] = posVector.x;
                        positions[i * 3 + 1] = posVector.y;
                        positions[i * 3 + 2] = posVector.z;
                    }
                };
                this.mesh.updateMeshPositions(positionFunction.bind(this), true);
                this._animationCounter += 1;
            }
            else {
                if (this._looping) {
                    this._animationCounter = 0;
                    this._animDirection *= -1;
                }
                else {
                    this._hasAnimation = false;
                    var positionFunction = function (positions) {
                        var numberOfVertices = positions.length / 3;
                        for (var i = 0; i < numberOfVertices; i++) {
                            positions[i * 3] = this._coords[i][0] * this.xScale;
                            positions[i * 3 + 1] = this._coords[i][2] * this.zScale;
                            positions[i * 3 + 2] = this._coords[i][1] * this.yScale;
                        }
                    };
                    this.mesh.updateMeshPositions(positionFunction.bind(this), true);
                }
                this.mesh.refreshBoundingInfo();
            }
        }
        return this._hasAnimation;
    };
    return PointCloud;
}(babyplots_1.CoordinatePlot));
exports.PointCloud = PointCloud;
//# sourceMappingURL=PointCloud.js.map