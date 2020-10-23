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
exports.PointCloud = void 0;
var mesh_1 = require("@babylonjs/core/Meshes/mesh");
var sphereBuilder_1 = require("@babylonjs/core/Meshes/Builders/sphereBuilder");
var math_1 = require("@babylonjs/core/Maths/math");
var solidParticleSystem_1 = require("@babylonjs/core/Particles/solidParticleSystem");
var mesh_vertexData_1 = require("@babylonjs/core/Meshes/mesh.vertexData");
var standardMaterial_1 = require("@babylonjs/core/Materials/standardMaterial");
var babyplots_1 = require("./babyplots");
var PointCloud = (function (_super) {
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
    PointCloud.prototype._createPointCloud = function () {
        if (this._coords.length > 10000) {
            var customMesh = new mesh_1.Mesh("custom", this._scene);
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
        }
        else {
            var cell = sphereBuilder_1.SphereBuilder.CreateSphere("sphere", { segments: 2, diameter: this._size * 0.1 }, this._scene);
            var SPS = new solidParticleSystem_1.SolidParticleSystem('SPS', this._scene, {
                updatable: true,
                isPickable: true
            });
            SPS.addShape(cell, this._coords.length);
            if (this._folded) {
                for (var i = 0; i < SPS.nbParticles; i++) {
                    SPS.particles[i].position.x = this._foldedEmbedding[i][0] * this.xScale;
                    SPS.particles[i].position.z = this._foldedEmbedding[i][1] * this.zScale;
                    SPS.particles[i].position.y = this._foldedEmbedding[i][2] * this.yScale;
                    SPS.particles[i].color = math_1.Color4.FromHexString(this._coordColors[i]);
                }
            }
            else {
                for (var i = 0; i < SPS.nbParticles; i++) {
                    SPS.particles[i].position.x = this._coords[i][0] * this.xScale;
                    SPS.particles[i].position.z = this._coords[i][1] * this.zScale;
                    SPS.particles[i].position.y = this._coords[i][2] * this.yScale;
                    SPS.particles[i].color = math_1.Color4.FromHexString(this._coordColors[i]);
                }
            }
            SPS.buildMesh();
            SPS.computeBoundingBox = true;
            cell.dispose();
            SPS.setParticles();
            SPS.computeBoundingBox = true;
            this._SPS = SPS;
            this.mesh = SPS.mesh;
            var mat = new standardMaterial_1.StandardMaterial("pointMat", this._scene);
            mat.alpha = 1;
            this.mesh.material = mat;
        }
        Object.defineProperty(this, "alpha", {
            set: function (newAlpha) {
                this.mesh.material.alpha = newAlpha;
            }
        });
    };
    PointCloud.prototype.resetAnimation = function () {
        this._folded = true;
        if (this._SPS) {
            for (var i = 0; i < this._SPS.particles.length; i++) {
                this._SPS.particles[i].position = new math_1.Vector3(this._foldedEmbedding[i][0] * this.xScale, this._foldedEmbedding[i][2] * this.zScale, this._foldedEmbedding[i][1] * this.yScale);
            }
            this._SPS.setParticles();
        }
        else {
            var positionFunction = function (positions) {
                var numberOfVertices = positions.length / 3;
                for (var i = 0; i < numberOfVertices; i++) {
                    positions[i * 3] = this._foldedEmbedding[i][0] * this.xScale;
                    positions[i * 3 + 1] = this._foldedEmbedding[i][2] * this.zScale;
                    positions[i * 3 + 2] = this._foldedEmbedding[i][1] * this.yScale;
                }
            };
            this.mesh.updateMeshPositions(positionFunction.bind(this), true);
        }
        this.mesh.refreshBoundingInfo();
        this._foldCounter = 0;
    };
    PointCloud.prototype.update = function () {
        if (this._SPS && this._folded) {
            if (this._foldCounter < this._foldDelay) {
                this._foldCounter += 1;
            }
            else if (this._foldCounter < this._foldAnimFrames + this._foldDelay) {
                for (var i = 0; i < this._SPS.particles.length; i++) {
                    this._SPS.particles[i].position.addInPlace(this._foldVectorFract[i]);
                }
                this._foldCounter += 1;
                this._SPS.setParticles();
            }
            else {
                this._folded = false;
                for (var i = 0; i < this._SPS.particles.length; i++) {
                    this._SPS.particles[i].position = new math_1.Vector3(this._coords[i][0] * this.xScale, this._coords[i][2] * this.zScale, this._coords[i][1] * this.yScale);
                }
                this._SPS.setParticles();
                this.mesh.refreshBoundingInfo();
            }
        }
        else if (this.mesh && this._folded) {
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
    PointCloud.prototype._pointPicker = function (_evt, pickResult) {
        if (this._pointPicking) {
            var faceId = pickResult.faceId;
            if (faceId == -1) {
                return;
            }
            var idx = this._SPS.pickedParticles[faceId].idx;
            for (var i = 0; i < this._SPS.nbParticles; i++) {
                this._SPS.particles[i].color = new math_1.Color4(0.3, 0.3, 0.8, 1);
            }
            var p = this._SPS.particles[idx];
            p.color = new math_1.Color4(1, 0, 0, 1);
            this._SPS.setParticles();
            this.selection = [idx];
            this._selectionCallback(this.selection);
        }
    };
    PointCloud.prototype.updateSize = function () {
        for (var i = 0; i < this._SPS.nbParticles; i++) {
            this._SPS.particles[i].scale.x = this._size;
            this._SPS.particles[i].scale.y = this._size;
            this._SPS.particles[i].scale.z = this._size;
        }
        this._SPS.setParticles();
        _super.prototype.updateSize.call(this);
    };
    return PointCloud;
}(babyplots_1.Plot));
exports.PointCloud = PointCloud;
//# sourceMappingURL=PointCloud.js.map