// import { SolidParticleSystem, Vector3, Scene, Mesh, Color4, VertexData, StandardMaterial, Color3, FloatArray, PickingInfo } from "babylonjs";
import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import "@babylonjs/core/Meshes/meshBuilder";
import { Vector3, Color4, Color3 } from "@babylonjs/core/Maths/math";
import { SolidParticleSystem } from "@babylonjs/core/Particles/solidParticleSystem";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { FloatArray } from "@babylonjs/core/types";
import { PickingInfo } from "@babylonjs/core/Collisions/pickingInfo";
import { Plot, LegendData } from "./babyplots";

export class PointCloud extends Plot {
    private _SPS: SolidParticleSystem;
    private _pointPicking: boolean = false;
    private _selectionCallback = function (selection: number[]) { return false; };
    private _folded: boolean;
    private _foldedEmbedding: number[][];
    private _foldVectors: Vector3[] = [];
    private _foldCounter: number = 0;
    private _foldAnimFrames: number = 200;
    private _foldVectorFract: Vector3[] = [];
    private _foldDelay: number = 100;
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, folded?: boolean, foldedEmbedding?: number[][], foldAnimDelay?: number, foldAnimDuration?: number) {
        super(scene, coordinates, colorVar, size, legendData);
        this._folded = folded;
        if (foldAnimDelay) {
            this._foldDelay = foldAnimDelay;
        }
        if (foldAnimDuration) {
            this._foldAnimFrames = foldAnimDuration;
        }
        if (folded) {
            if (foldedEmbedding) {
                for (let i = 0; i < foldedEmbedding.length; i++) {
                    if (foldedEmbedding[i].length == 2) {
                        foldedEmbedding[i].push(0);
                    }
                    let fv = new Vector3(coordinates[i][0], coordinates[i][2], coordinates[i][1]).subtractFromFloats(foldedEmbedding[i][0], 0, foldedEmbedding[i][1]);
                    this._foldVectors.push(fv);
                    this._foldVectorFract.push(fv.divide(new Vector3(this._foldAnimFrames, this._foldAnimFrames, this._foldAnimFrames)));
                }
                this._foldedEmbedding = foldedEmbedding;
            }
            else {
                foldedEmbedding = JSON.parse(JSON.stringify(coordinates));
                for (let i = 0; i < foldedEmbedding.length; i++) {
                    foldedEmbedding[i][2] = 0;
                    let fv = new Vector3(coordinates[i][0], coordinates[i][2], coordinates[i][1]).subtractFromFloats(foldedEmbedding[i][0], 0, foldedEmbedding[i][1]);
                    this._foldVectors.push(fv);
                    this._foldVectorFract.push(fv.divide(new Vector3(this._foldAnimFrames, this._foldAnimFrames, this._foldAnimFrames)));
                }
                this._foldedEmbedding = foldedEmbedding;
            }
        }
        this._createPointCloud();
    }
    /**
     * Positions spheres according to coordinates in a SPS
     */
    private _createPointCloud(): void {
        // prototype cell
        if (this._coords.length > 10000) {
            let customMesh = new Mesh("custom", this._scene);
            // Set arrays for positions and indices
            let positions = [];
            let colors = [];
            if (this._folded) {
                for (let p = 0; p < this._coords.length; p++) {
                    positions.push(this._foldedEmbedding[p][0], this._foldedEmbedding[p][2], this._foldedEmbedding[p][1]);
                    let col = Color4.FromHexString(this._coordColors[p]);
                    colors.push(col.r, col.g, col.b, col.a);
                }
            }
            else {
                for (let p = 0; p < this._coords.length; p++) {
                    positions.push(this._coords[p][0], this._coords[p][2], this._coords[p][1]);
                    let col = Color4.FromHexString(this._coordColors[p]);
                    colors.push(col.r, col.g, col.b, col.a);
                }
            }
            var vertexData = new VertexData();
            // Assign positions
            vertexData.positions = positions;
            vertexData.colors = colors;
            // Apply vertexData to custom mesh
            vertexData.applyToMesh(customMesh, true);
            var mat = new StandardMaterial("mat", this._scene);
            mat.emissiveColor = new Color3(1, 1, 1);
            mat.disableLighting = true;
            mat.pointsCloud = true;
            mat.pointSize = this._size;
            customMesh.material = mat;
            this.mesh = customMesh;
        }
        else {
            let cell = Mesh.CreateSphere("sphere", 2, this._size * 0.1, this._scene);
            // let cell = MeshBuilder.CreateDisc("disc", {tessellation: 6, radius: this._size}, this._scene);
            // particle system
            let SPS = new SolidParticleSystem('SPS', this._scene, {
                updatable: true,
                isPickable: true
            });
            // add all cells to SPS
            SPS.addShape(cell, this._coords.length);
            // position and color cells
            if (this._folded) {
                for (let i = 0; i < SPS.nbParticles; i++) {
                    SPS.particles[i].position.x = this._foldedEmbedding[i][0];
                    SPS.particles[i].position.z = this._foldedEmbedding[i][1];
                    SPS.particles[i].position.y = this._foldedEmbedding[i][2];
                    SPS.particles[i].color = Color4.FromHexString(this._coordColors[i]);
                }
            }
            else {
                for (let i = 0; i < SPS.nbParticles; i++) {
                    SPS.particles[i].position.x = this._coords[i][0];
                    SPS.particles[i].position.z = this._coords[i][1];
                    SPS.particles[i].position.y = this._coords[i][2];
                    SPS.particles[i].color = Color4.FromHexString(this._coordColors[i]);
                }
            }
            SPS.buildMesh();
            // scale bounding box to actual size of the SPS particles
            SPS.computeBoundingBox = true;
            // remove prototype cell
            cell.dispose();
            // calculate SPS particles
            SPS.setParticles();
            // SPS.billboard = true;
            SPS.computeBoundingBox = true;
            this._SPS = SPS;
            this.mesh = SPS.mesh;
            var mat = new StandardMaterial("pointMat", this._scene);
            mat.alpha = 1;
            this.mesh.material = mat;
        }
        Object.defineProperty(this, "alpha", {
            set(newAlpha) {
                this.mesh.material.alpha = newAlpha;
            }
        });
    }
    update(): boolean {
        if (this._SPS && this._folded) {
            if (this._foldCounter < this._foldDelay) {
                this._foldCounter += 1;
            }
            else if (this._foldCounter < this._foldAnimFrames + this._foldDelay) {
                for (let i = 0; i < this._SPS.particles.length; i++) {
                    this._SPS.particles[i].position.addInPlace(this._foldVectorFract[i]);
                }
                this._foldCounter += 1;
                this._SPS.setParticles();
            }
            else {
                this._folded = false;
                for (let i = 0; i < this._SPS.particles.length; i++) {
                    this._SPS.particles[i].position = new Vector3(this._coords[i][0], this._coords[i][2], this._coords[i][1]);
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
                let positionFunction = function (positions: FloatArray) {
                    let numberOfVertices = positions.length / 3;
                    for (let i = 0; i < numberOfVertices; i++) {
                        let posVector = new Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]).addInPlace(this._foldVectorFract[i]);
                        positions[i * 3] = posVector.x;
                        positions[i * 3 + 1] = posVector.y;
                        positions[i * 3 + 2] = posVector.z;
                    }
                    ;
                };
                this.mesh.updateMeshPositions(positionFunction.bind(this), true);
                this._foldCounter += 1;
            }
            else {
                this._folded = false;
                let positionFunction = function (positions: FloatArray) {
                    let numberOfVertices = positions.length / 3;
                    for (let i = 0; i < numberOfVertices; i++) {
                        positions[i * 3] = this._coords[i][0];
                        positions[i * 3 + 1] = this._coords[i][2];
                        positions[i * 3 + 2] = this._coords[i][1];
                    }
                    ;
                };
                this.mesh.updateMeshPositions(positionFunction.bind(this), true);
                this.mesh.refreshBoundingInfo();
            }
        }
        return this._folded;
    }
    private _pointPicker(_evt: PointerEvent, pickResult: PickingInfo) {
        if (this._pointPicking) {
            const faceId = pickResult.faceId;
            if (faceId == -1) {
                return;
            }
            const idx = this._SPS.pickedParticles[faceId].idx;
            for (let i = 0; i < this._SPS.nbParticles; i++) {
                this._SPS.particles[i].color = new Color4(0.3, 0.3, 0.8, 1);
            }
            let p = this._SPS.particles[idx];
            p.color = new Color4(1, 0, 0, 1);
            this._SPS.setParticles();
            this.selection = [idx];
            this._selectionCallback(this.selection);
        }
    }
    updateSize(): void {
        for (let i = 0; i < this._SPS.nbParticles; i++) {
            this._SPS.particles[i].scale.x = this._size;
            this._SPS.particles[i].scale.y = this._size;
            this._SPS.particles[i].scale.z = this._size;
        }
        this._SPS.setParticles();
        super.updateSize();
    }
}
