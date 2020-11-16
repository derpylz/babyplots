"use strict";
/**
 * Babyplots - Easy, fast, interactive 3D visualizations
 *
 * Copyright (c) 2020, Nils Jonathan Trost. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
var babyplots_1 = require("./babyplots");
var PointCloud = /** @class */ (function (_super) {
    __extends(PointCloud, _super);
    function PointCloud(scene, coordinates, colorVar, size, legendData, folded, foldedEmbedding, foldAnimDelay, foldAnimDuration, xScale, yScale, zScale) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        var _this = _super.call(this, scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale) || this;
        _this._pointPicking = false;
        _this._selectionCallback = function (selection) { return false; };
        _this._foldVectors = [];
        _this._foldCounter = 0;
        _this._foldAnimFrames = 200;
        _this._foldVectorFract = [];
        _this._foldDelay = 100;
        _this._folded = folded;
        if (foldAnimDelay) {
            _this._foldDelay = foldAnimDelay;
        }
        if (foldAnimDuration) {
            _this._foldAnimFrames = foldAnimDuration;
        }
        if (folded) {
            if (foldedEmbedding) {
                for (var i = 0; i < foldedEmbedding.length; i++) {
                    if (foldedEmbedding[i].length == 2) {
                        foldedEmbedding[i].push(0);
                    }
                    var fv = new math_1.Vector3(coordinates[i][0] * _this.xScale, coordinates[i][2] * _this.zScale, coordinates[i][1] * _this.yScale).subtractFromFloats(foldedEmbedding[i][0] * _this.xScale, 0, foldedEmbedding[i][1] * _this.yScale);
                    _this._foldVectors.push(fv);
                    _this._foldVectorFract.push(fv.divide(new math_1.Vector3(_this._foldAnimFrames, _this._foldAnimFrames, _this._foldAnimFrames)));
                }
                _this._foldedEmbedding = foldedEmbedding;
            }
            else {
                foldedEmbedding = JSON.parse(JSON.stringify(coordinates));
                for (var i = 0; i < foldedEmbedding.length; i++) {
                    foldedEmbedding[i][2] = 0;
                    var fv = new math_1.Vector3(coordinates[i][0] * _this.xScale, coordinates[i][2] * _this.zScale, coordinates[i][1] * _this.yScale).subtractFromFloats(foldedEmbedding[i][0] * _this.xScale, 0, foldedEmbedding[i][1] * _this.yScale);
                    _this._foldVectors.push(fv);
                    _this._foldVectorFract.push(fv.divide(new math_1.Vector3(_this._foldAnimFrames, _this._foldAnimFrames, _this._foldAnimFrames)));
                }
                _this._foldedEmbedding = foldedEmbedding;
            }
        }
        _this._createPointCloud();
        return _this;
    }
    /**
     * Positions spheres according to coordinates in a SPS
     */
    PointCloud.prototype._createPointCloud = function () {
        // prototype cell
        var customMesh = new mesh_1.Mesh("custom", this._scene);
        // Set arrays for positions and indices
        var positions = [];
        var colors = [];
        if (this._folded) {
            for (var p = 0; p < this._coords.length; p++) {
                positions.push(this._foldedEmbedding[p][0] * this.xScale, this._foldedEmbedding[p][2] * this.zScale, this._foldedEmbedding[p][1] * this.yScale);
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
        // Assign positions
        vertexData.positions = positions;
        vertexData.colors = colors;
        // Apply vertexData to custom mesh
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
        this._folded = true;
        var positionFunction = function (positions) {
            var numberOfVertices = positions.length / 3;
            for (var i = 0; i < numberOfVertices; i++) {
                positions[i * 3] = this._foldedEmbedding[i][0] * this.xScale;
                positions[i * 3 + 1] = this._foldedEmbedding[i][2] * this.zScale;
                positions[i * 3 + 2] = this._foldedEmbedding[i][1] * this.yScale;
            }
        };
        this.mesh.updateMeshPositions(positionFunction.bind(this), true);
        this.mesh.refreshBoundingInfo();
        this._foldCounter = 0;
    };
    PointCloud.prototype.update = function () {
        if (this.mesh && this._folded) {
            if (this._foldCounter < this._foldDelay) {
                this._foldCounter += 1;
            }
            else if (this._foldCounter < this._foldAnimFrames + this._foldDelay) {
                var positionFunction = function (positions) {
                    var numberOfVertices = positions.length / 3;
                    for (var i = 0; i < numberOfVertices; i++) {
                        var posVector = new math_1.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]).addInPlace(this._foldVectorFract[i]);
                        positions[i * 3] = posVector.x;
                        positions[i * 3 + 1] = posVector.y;
                        positions[i * 3 + 2] = posVector.z;
                    }
                };
                this.mesh.updateMeshPositions(positionFunction.bind(this), true);
                this._foldCounter += 1;
            }
            else {
                this._folded = false;
                var positionFunction = function (positions) {
                    var numberOfVertices = positions.length / 3;
                    for (var i = 0; i < numberOfVertices; i++) {
                        positions[i * 3] = this._coords[i][0] * this.xScale;
                        positions[i * 3 + 1] = this._coords[i][2] * this.zScale;
                        positions[i * 3 + 2] = this._coords[i][1] * this.yScale;
                    }
                };
                this.mesh.updateMeshPositions(positionFunction.bind(this), true);
                this.mesh.refreshBoundingInfo();
            }
        }
        return this._folded;
    };
    return PointCloud;
}(babyplots_1.Plot));
exports.PointCloud = PointCloud;
//# sourceMappingURL=PointCloud.js.map