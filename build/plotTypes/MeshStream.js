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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeshStream = void 0;
var sceneLoader_1 = require("@babylonjs/core/Loading/sceneLoader");
var Plot_1 = require("../utils/Plot");
var math_1 = require("@babylonjs/core/Maths/math");
require("@babylonjs/loaders/glTF");
var MeshStream = (function (_super) {
    __extends(MeshStream, _super);
    function MeshStream(scene, rootUrl, filePrefix, fileSuffix, fileIteratorStart, fileIteratorEnd, legendData, xScale, yScale, zScale, frameDelay, rotation, offset, clearCoat, clearCoatIntensity, name) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        if (frameDelay === void 0) { frameDelay = 200; }
        if (rotation === void 0) { rotation = []; }
        if (offset === void 0) { offset = []; }
        if (clearCoat === void 0) { clearCoat = false; }
        if (clearCoatIntensity === void 0) { clearCoatIntensity = 1; }
        if (name === void 0) { name = "mesh stream"; }
        var _this = _super.call(this, name, "meshStream", scene, legendData, xScale, yScale, zScale) || this;
        _this._filenames = [];
        _this._prevTime = performance.now();
        _this._containers = [];
        _this.frameIndex = 0;
        _this._rootUrl = rootUrl;
        _this.frameDelay = frameDelay;
        _this._rotation = rotation;
        _this._offset = offset;
        _this._clearCoat = clearCoat;
        _this._clearCoatIntensity = clearCoatIntensity;
        for (var iter = fileIteratorStart; iter <= fileIteratorEnd; iter++) {
            _this._filenames.push(filePrefix + iter.toString() + fileSuffix);
        }
        _this.frameTotal = _this._filenames.length;
        _this._createMeshStream();
        return _this;
    }
    MeshStream.prototype._createMeshStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingContainers, idx, filename, firstScene, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        loadingContainers = [];
                        for (idx = 0; idx < this._filenames.length; idx++) {
                            filename = this._filenames[idx];
                            loadingContainers.push(this._loadMesh(filename));
                        }
                        return [4, loadingContainers[0]];
                    case 1:
                        firstScene = _d.sent();
                        firstScene.addAllToScene();
                        this._containers.push(firstScene);
                        _a = this;
                        _c = (_b = this._containers).concat;
                        return [4, Promise.all(loadingContainers)];
                    case 2:
                        _a._containers = _c.apply(_b, [_d.sent()]);
                        this.allLoaded = true;
                        this.frameIndex = 0;
                        firstScene.removeAllFromScene();
                        return [2];
                }
            });
        });
    };
    MeshStream.prototype._loadMesh = function (filename) {
        return __awaiter(this, void 0, void 0, function () {
            var container;
            var _this = this;
            return __generator(this, function (_a) {
                container = sceneLoader_1.SceneLoader.LoadAssetContainerAsync(this._rootUrl, filename, this._scene).then(function (container) {
                    if (_this._rotation.length === 3) {
                        var rootMesh = container.meshes[0];
                        rootMesh.rotationQuaternion = null;
                        rootMesh.rotate(math_1.Axis.X, _this._rotation[0], math_1.Space.LOCAL);
                        rootMesh.rotate(math_1.Axis.Y, _this._rotation[1], math_1.Space.LOCAL);
                        rootMesh.rotate(math_1.Axis.Z, _this._rotation[2], math_1.Space.LOCAL);
                    }
                    if (_this._offset.length === 3) {
                        var rootMesh = container.meshes[0];
                        rootMesh.position = new math_1.Vector3(_this._offset[0], _this._offset[1], _this._offset[2]);
                    }
                    if (_this._clearCoat) {
                        var materials = container.materials;
                        materials.forEach(function (mat, _) {
                            mat.clearCoat.isEnabled = true;
                            mat.clearCoat.intensity = _this._clearCoatIntensity;
                        });
                    }
                    _this.frameIndex++;
                    return container;
                });
                return [2, container];
            });
        });
    };
    MeshStream.prototype.goToFrame = function (n) {
        if (this.allLoaded && n >= 0 && n < this.frameTotal) {
            for (var fi = 0; fi < this._containers.length; fi++) {
                this._containers[fi].removeAllFromScene();
            }
            this._containers[n].addAllToScene();
            this.frameIndex = n + 1;
            if (this.frameIndex === this._containers.length) {
                this.frameIndex = 0;
            }
        }
    };
    MeshStream.prototype.update = function () {
        if (this.allLoaded) {
            var timeNow = performance.now();
            if (timeNow - this._prevTime > this.frameDelay) {
                this._prevTime = timeNow;
                if (this.frameIndex === 0) {
                    this._containers[this._containers.length - 1].removeAllFromScene();
                }
                else {
                    this._containers[this.frameIndex - 1].removeAllFromScene();
                }
                this._containers[this.frameIndex].addAllToScene();
                if (this.frameIndex === this._containers.length - 1) {
                    this.frameIndex = 0;
                }
                else {
                    this.frameIndex++;
                }
            }
        }
        return true;
    };
    return MeshStream;
}(Plot_1.Plot));
exports.MeshStream = MeshStream;
//# sourceMappingURL=MeshStream.js.map