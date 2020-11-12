"use strict";
/*!
 * babyplots - Easy, fast, interactive 3D visualizations
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
 * ---------------------------------------------
 *
 * babyplots includes CCapture.js, released under the following license:
 *
 * CCapture - A library to capture canvas-based animations
 *
 * The MIT License
 *
 * Copyright (c) 2012 Jaume Sanchez Elias
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * ---------------------------------------------
 *
 * babyplots includes axios, released under the following license:
 *
 * Copyright (c) 2014-present Matt Zabriskie
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * ---------------------------------------------
 *
 * babyplots includes uuid, released under the following license:
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2010-2020 Robert Kieffer and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plots = exports.isValidPlot = exports.PLOTTYPES = exports.getUniqueVals = exports.matrixMin = exports.matrixMax = exports.Plot = exports.styleText = exports.buttonSVGs = void 0;
var scene_1 = require("@babylonjs/core/scene");
var engine_1 = require("@babylonjs/core/Engines/engine");
var arcRotateCamera_1 = require("@babylonjs/core/Cameras/arcRotateCamera");
var hemisphericLight_1 = require("@babylonjs/core/Lights/hemisphericLight");
var math_1 = require("@babylonjs/core/Maths/math");
var boxBuilder_1 = require("@babylonjs/core/Meshes/Builders/boxBuilder");
var advancedDynamicTexture_1 = require("@babylonjs/gui/2D/advancedDynamicTexture");
var controls_1 = require("@babylonjs/gui/2D/controls");
var screenshotTools_1 = require("@babylonjs/core/Misc/screenshotTools");
var chroma_js_1 = __importDefault(require("chroma-js"));
var downloadjs_1 = __importDefault(require("downloadjs"));
var uuid_1 = require("uuid");
var axios = require('axios').default;
var Label_1 = require("./Label");
var Axes_1 = require("./Axes");
exports.buttonSVGs = {
    logo: '<svg id="logo_btn_svg" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><style>.cls-1{fill:#752a10;}.cls-2{fill:#a33b16;}.cls-3{fill:#e95420;}</style></defs><path d="M16,6A10,10,0,1,1,6,16,10,10,0,0,1,16,6m0-5A15,15,0,1,0,31,16,15,15,0,0,0,16,1Z"/><path d="M16.52,27a5.65,5.65,0,0,1-2.83-.68,5.06,5.06,0,0,1-1.91-1.93v2.35H8V7.11h4.31V15a5.09,5.09,0,0,1,1.87-1.9A5.33,5.33,0,0,1,17,12.36a5.42,5.42,0,0,1,2.48.58,6,6,0,0,1,1.94,1.58,7.51,7.51,0,0,1,1.27,2.36,9.11,9.11,0,0,1,.45,2.89,8.2,8.2,0,0,1-.49,2.87A7.39,7.39,0,0,1,21.24,25,6.29,6.29,0,0,1,16.52,27Zm-1.21-3.63a3.47,3.47,0,0,0,1.38-.28,3.4,3.4,0,0,0,1.06-.77,3.62,3.62,0,0,0,.7-1.15,4,4,0,0,0,.26-1.44,4.12,4.12,0,0,0-.25-1.44,3.86,3.86,0,0,0-.66-1.2,3,3,0,0,0-1-.81,2.88,2.88,0,0,0-3.14.41,4.57,4.57,0,0,0-1.3,1.75v3a3.31,3.31,0,0,0,1.25,1.44A3.15,3.15,0,0,0,15.31,23.41Z"/><path class="cls-1" d="M17.83,26A5.6,5.6,0,0,1,15,25.31a5.06,5.06,0,0,1-1.92-1.92v2.34H9.34V6.06h4.31V13.9A5.17,5.17,0,0,1,15.52,12a5.43,5.43,0,0,1,2.76-.68,5.3,5.3,0,0,1,2.48.58,5.9,5.9,0,0,1,1.94,1.57A7.62,7.62,0,0,1,24,15.83a9.16,9.16,0,0,1,.46,2.89,8.12,8.12,0,0,1-.5,2.87,7.28,7.28,0,0,1-1.39,2.32,6.28,6.28,0,0,1-2.1,1.54A6.36,6.36,0,0,1,17.83,26Zm-1.22-3.64A3.27,3.27,0,0,0,18,22.08a3.4,3.4,0,0,0,1.06-.77,3.47,3.47,0,0,0,.7-1.14A4,4,0,0,0,20,18.72a4.12,4.12,0,0,0-.25-1.44,3.93,3.93,0,0,0-.66-1.19,2.85,2.85,0,0,0-1-.81,2.72,2.72,0,0,0-1.26-.3,2.85,2.85,0,0,0-1.87.7,4.57,4.57,0,0,0-1.31,1.75v3a3.37,3.37,0,0,0,1.25,1.44A3.14,3.14,0,0,0,16.61,22.36Z"/><path class="cls-2" d="M18.83,25A5.6,5.6,0,0,1,16,24.31a5.06,5.06,0,0,1-1.92-1.92v2.34H10.34V5.06h4.31V12.9A5.17,5.17,0,0,1,16.52,11a5.43,5.43,0,0,1,2.76-.68,5.3,5.3,0,0,1,2.48.58,5.9,5.9,0,0,1,1.94,1.57A7.62,7.62,0,0,1,25,14.83a9.16,9.16,0,0,1,.46,2.89,8.12,8.12,0,0,1-.5,2.87,7.28,7.28,0,0,1-1.39,2.32,6.28,6.28,0,0,1-2.1,1.54A6.36,6.36,0,0,1,18.83,25Zm-1.22-3.64A3.27,3.27,0,0,0,19,21.08a3.4,3.4,0,0,0,1.06-.77,3.47,3.47,0,0,0,.7-1.14A4,4,0,0,0,21,17.72a4.12,4.12,0,0,0-.25-1.44,3.93,3.93,0,0,0-.66-1.19,2.85,2.85,0,0,0-1-.81,2.72,2.72,0,0,0-1.26-.3,2.85,2.85,0,0,0-1.87.7,4.57,4.57,0,0,0-1.31,1.75v3a3.37,3.37,0,0,0,1.25,1.44A3.14,3.14,0,0,0,17.61,21.36Z"/><path class="cls-3" d="M19.83,24A5.6,5.6,0,0,1,17,23.31a5.06,5.06,0,0,1-1.92-1.92v2.34H11.34V4.06h4.31V11.9A5.17,5.17,0,0,1,17.52,10a5.43,5.43,0,0,1,2.76-.68,5.3,5.3,0,0,1,2.48.58,5.9,5.9,0,0,1,1.94,1.57A7.62,7.62,0,0,1,26,13.83a9.17,9.17,0,0,1,.45,2.9,8.11,8.11,0,0,1-.49,2.86,7.28,7.28,0,0,1-1.39,2.32,6.28,6.28,0,0,1-2.1,1.54A6.36,6.36,0,0,1,19.83,24Zm-1.22-3.64A3.27,3.27,0,0,0,20,20.08a3.4,3.4,0,0,0,1.06-.77,3.47,3.47,0,0,0,.7-1.14A4,4,0,0,0,22,16.73a4.13,4.13,0,0,0-.25-1.45,3.93,3.93,0,0,0-.66-1.19,2.85,2.85,0,0,0-1-.81,2.72,2.72,0,0,0-1.26-.3,2.85,2.85,0,0,0-1.87.7,4.57,4.57,0,0,0-1.31,1.75v3a3.37,3.37,0,0,0,1.25,1.44A3.14,3.14,0,0,0,18.61,20.36Z"/></svg>',
    toJson: '<svg id="toJSON_btn_svg" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80"><defs><style>.cls-1{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:16px;}</style></defs><path d="M19.15,23.18V36.45a5.1,5.1,0,0,1-.3,1.53,3.51,3.51,0,0,1-1.15,1.63,3.42,3.42,0,0,1,1.15,1.65,5.29,5.29,0,0,1,.3,1.5V56.59h2.94v2.9h-5a1.31,1.31,0,0,1-.83-.33,1.52,1.52,0,0,1-.4-1.2V43.67a3.43,3.43,0,0,0-.53-1.85,2,2,0,0,0-1.55-.94V38.23a1.5,1.5,0,0,0,.93-.3,3,3,0,0,0,.67-.71,2.82,2.82,0,0,0,.38-.89,3.92,3.92,0,0,0,.1-.79V21.81c0-.65.16-1.06.48-1.25a1.8,1.8,0,0,1,.75-.28h5v2.9Z"/><path d="M68.32,23.18v-2.9h5a1.84,1.84,0,0,1,.75.28c.32.19.48.6.48,1.25V35.54a3.92,3.92,0,0,0,.1.79,3,3,0,0,0,.35.89,2.78,2.78,0,0,0,.62.71,1.47,1.47,0,0,0,1,.3v2.65a1.92,1.92,0,0,0-1.53.94,3.59,3.59,0,0,0-.5,1.85V58a1.52,1.52,0,0,1-.4,1.2,1.31,1.31,0,0,1-.83.33h-5v-2.9h2.94V42.76a5.81,5.81,0,0,1,.27-1.5,3.29,3.29,0,0,1,1.12-1.65A3.37,3.37,0,0,1,71.53,38a5.6,5.6,0,0,1-.27-1.53V23.18Z"/><path d="M83,57.91v-5h3.15v5Z"/><path d="M89.44,67.12a11.53,11.53,0,0,1-3.32-.46,7.35,7.35,0,0,1-2.78-1.52l1.77-2.34a4.7,4.7,0,0,0,1.87,1A8.25,8.25,0,0,0,89,64a4.83,4.83,0,0,0,1.84-.36,5.27,5.27,0,0,0,1.58-1,4.91,4.91,0,0,0,1.12-1.5A4.15,4.15,0,0,0,94,59.29V31.42h3.63V59.08a7.62,7.62,0,0,1-.69,3.26,8.24,8.24,0,0,1-1.84,2.54,8.42,8.42,0,0,1-2.62,1.65A8.12,8.12,0,0,1,89.44,67.12ZM94,25.88V20.79h3.63v5.09Z"/><path d="M114.88,58.42a20.44,20.44,0,0,1-6.36-1,15.51,15.51,0,0,1-5.35-2.95l1.66-2.34a18.34,18.34,0,0,0,4.78,2.74,14.73,14.73,0,0,0,5.22.92,9.75,9.75,0,0,0,5.37-1.3,4.14,4.14,0,0,0,2-3.69,3.11,3.11,0,0,0-.53-1.85,4.56,4.56,0,0,0-1.58-1.3,12.89,12.89,0,0,0-2.62-1c-1-.29-2.27-.58-3.66-.89-1.6-.37-3-.75-4.17-1.12a12.91,12.91,0,0,1-2.91-1.27A4.61,4.61,0,0,1,105,41.62a5.43,5.43,0,0,1-.56-2.62,7.07,7.07,0,0,1,3.07-6,10.46,10.46,0,0,1,3.31-1.5,15.53,15.53,0,0,1,4-.51,16.4,16.4,0,0,1,5.83,1,11.68,11.68,0,0,1,4.22,2.62l-1.76,2a10,10,0,0,0-3.77-2.29,14.1,14.1,0,0,0-4.63-.77,12.43,12.43,0,0,0-2.67.28,6.93,6.93,0,0,0-2.17.89,4.57,4.57,0,0,0-1.47,1.56,4.43,4.43,0,0,0-.53,2.21,3.5,3.5,0,0,0,.37,1.73,3.11,3.11,0,0,0,1.23,1.14,10.85,10.85,0,0,0,2.17.87q1.3.38,3.18.78c1.78.41,3.35.82,4.7,1.22a15.38,15.38,0,0,1,3.4,1.43,5.77,5.77,0,0,1,2.06,2,5.52,5.52,0,0,1,.69,2.85,6.81,6.81,0,0,1-2.94,5.8A13.22,13.22,0,0,1,114.88,58.42Z"/><path d="M143.53,58.42a13.58,13.58,0,0,1-9.92-4.07A13.41,13.41,0,0,1,130.75,50a13.88,13.88,0,0,1-1-5.24,13.71,13.71,0,0,1,3.93-9.66,14.19,14.19,0,0,1,4.35-3,14.16,14.16,0,0,1,11,0,14.14,14.14,0,0,1,4.39,3,13.79,13.79,0,0,1,2.88,4.37,13.53,13.53,0,0,1,1,5.29,13.7,13.7,0,0,1-1,5.24,13.41,13.41,0,0,1-2.86,4.37,13.55,13.55,0,0,1-4.38,3A14,14,0,0,1,143.53,58.42Zm-10.1-13.63a10.48,10.48,0,0,0,.8,4.15,11.15,11.15,0,0,0,2.16,3.35,9.7,9.7,0,0,0,7.14,3.08,9.37,9.37,0,0,0,3.93-.84,10.27,10.27,0,0,0,3.23-2.29,11,11,0,0,0,0-15.1,10.27,10.27,0,0,0-3.23-2.29,9.37,9.37,0,0,0-3.93-.84,9.17,9.17,0,0,0-3.9.84,10.3,10.3,0,0,0-3.21,2.32,11,11,0,0,0-3,7.62Z"/><path d="M186.88,57.91h-3.63V43.12q0-4.74-1.47-6.87a5.14,5.14,0,0,0-4.52-2.14,9.78,9.78,0,0,0-3.21.56,11.16,11.16,0,0,0-3,1.58,12.65,12.65,0,0,0-2.43,2.42,9.32,9.32,0,0,0-1.55,3V57.91h-3.63V31.42h3.31v6a12.82,12.82,0,0,1,4.89-4.68A13.92,13.92,0,0,1,178.6,31a8.58,8.58,0,0,1,3.9.81,6.59,6.59,0,0,1,2.56,2.29,10,10,0,0,1,1.39,3.61,23.81,23.81,0,0,1,.43,4.73Z"/><line class="cls-1" x1="45.23" y1="21.5" x2="45.23" y2="41.68"/><polygon points="64.67 39.07 25.8 39.07 45.23 58.5 64.67 39.07"/></svg>',
    labels: '<svg id="labels_btn_svg" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80"><path d="M48.8,20.79h3.64V51.91a3.1,3.1,0,0,0,.85,2.32,3.29,3.29,0,0,0,2.41.84,7,7,0,0,0,1.39-.16,9.26,9.26,0,0,0,1.49-.4l.64,2.79a11.19,11.19,0,0,1-2.48.66,15.26,15.26,0,0,1-2.54.26,5.58,5.58,0,0,1-4-1.35,4.94,4.94,0,0,1-1.44-3.79Z"/><path d="M70.18,58.42a10.34,10.34,0,0,1-3.66-.63A9.43,9.43,0,0,1,63.58,56a7.81,7.81,0,0,1-1.95-2.62,7.47,7.47,0,0,1-.7-3.23,6.27,6.27,0,0,1,.86-3.2,7.92,7.92,0,0,1,2.4-2.54,12,12,0,0,1,3.69-1.65,17.86,17.86,0,0,1,4.71-.59,26.72,26.72,0,0,1,4.33.36,19.09,19.09,0,0,1,3.9,1V41.18a7.49,7.49,0,0,0-2.09-5.57A7.86,7.86,0,0,0,73,33.55a12.87,12.87,0,0,0-4.38.82A21.4,21.4,0,0,0,64,36.71l-1.28-2.29A19.41,19.41,0,0,1,73.23,31q5.24,0,8.23,2.8a10,10,0,0,1,3,7.73V53.44c0,1,.45,1.42,1.34,1.42v3a8.37,8.37,0,0,1-1.39.16,3.25,3.25,0,0,1-2.17-.66,2.44,2.44,0,0,1-.82-1.83l-.11-2.09a12.6,12.6,0,0,1-4.84,3.66A15.46,15.46,0,0,1,70.18,58.42ZM71,55.78a13.12,13.12,0,0,0,5.21-1,8.58,8.58,0,0,0,3.61-2.69,3.21,3.21,0,0,0,.72-1,2.39,2.39,0,0,0,.24-1V45.76a23.52,23.52,0,0,0-3.77-1,22.83,22.83,0,0,0-4-.35,11.61,11.61,0,0,0-6.26,1.52,4.61,4.61,0,0,0-2.4,4,5.25,5.25,0,0,0,.51,2.29,5.6,5.6,0,0,0,1.39,1.85,6.32,6.32,0,0,0,2.11,1.25A7.33,7.33,0,0,0,71,55.78Z"/><path d="M105.94,58.42a12.2,12.2,0,0,1-10.37-5.64v5.13H92.31V20.79H96V37a15.6,15.6,0,0,1,4.49-4.35A11.15,11.15,0,0,1,106.53,31a11.53,11.53,0,0,1,5.26,1.17,12.25,12.25,0,0,1,4,3.13,14.4,14.4,0,0,1,2.51,4.42,14.89,14.89,0,0,1,.88,5.06,14,14,0,0,1-1,5.29,13.84,13.84,0,0,1-2.78,4.35,13.23,13.23,0,0,1-4.2,2.95A12.54,12.54,0,0,1,105.94,58.42Zm-.85-3.05a9.63,9.63,0,0,0,4.19-.89,10.12,10.12,0,0,0,3.26-2.39,11.36,11.36,0,0,0,2.14-3.41,10.29,10.29,0,0,0,.78-3.94,11.35,11.35,0,0,0-.73-4,10.9,10.9,0,0,0-2-3.44,9.82,9.82,0,0,0-3.15-2.39,9.23,9.23,0,0,0-4-.89,8.82,8.82,0,0,0-3.1.54A10.48,10.48,0,0,0,99.74,36a11.83,11.83,0,0,0-2.19,2.11A12.67,12.67,0,0,0,96,40.62v8.24a5.49,5.49,0,0,0,1.14,2.57,9.62,9.62,0,0,0,2.25,2.06,12,12,0,0,0,2.83,1.37A9.22,9.22,0,0,0,105.09,55.37Z"/><path d="M137.32,58.42a14,14,0,0,1-5.59-1.09,13.72,13.72,0,0,1-7.32-7.4,13.59,13.59,0,0,1-1-5.34,13.27,13.27,0,0,1,1-5.26A13.61,13.61,0,0,1,127.29,35a13.92,13.92,0,0,1,4.42-3,14.78,14.78,0,0,1,11.14,0,13.51,13.51,0,0,1,4.36,3A13.77,13.77,0,0,1,150,39.35a13.34,13.34,0,0,1,1,5.19v.81a1.79,1.79,0,0,1-.05.56H127.16a10.88,10.88,0,0,0,1,3.94A10.74,10.74,0,0,0,130.48,53,10.07,10.07,0,0,0,133.66,55a9.92,9.92,0,0,0,3.82.74,10.22,10.22,0,0,0,2.67-.36,11.14,11.14,0,0,0,2.46-1,9.12,9.12,0,0,0,2-1.5A6.46,6.46,0,0,0,146,51l3.15.81a8.65,8.65,0,0,1-1.81,2.67,13,13,0,0,1-2.73,2.09,13.67,13.67,0,0,1-3.42,1.37A15.66,15.66,0,0,1,137.32,58.42Zm10.26-15.15a10.27,10.27,0,0,0-1-3.89,10.69,10.69,0,0,0-2.25-3,9.89,9.89,0,0,0-3.15-2,10.13,10.13,0,0,0-3.82-.71,10.33,10.33,0,0,0-3.85.71,9.65,9.65,0,0,0-5.37,5,10.83,10.83,0,0,0-1,3.87Z"/><path d="M156.83,20.79h3.63V51.91a3.1,3.1,0,0,0,.86,2.32,3.28,3.28,0,0,0,2.4.84,6.89,6.89,0,0,0,1.39-.16,9.11,9.11,0,0,0,1.5-.4l.64,2.79a11.34,11.34,0,0,1-2.48.66,15.26,15.26,0,0,1-2.54.26,5.56,5.56,0,0,1-4-1.35,4.94,4.94,0,0,1-1.44-3.79Z"/><path d="M180.45,58.42a20.53,20.53,0,0,1-6.36-1,15.47,15.47,0,0,1-5.34-2.95l1.65-2.34a18.39,18.39,0,0,0,4.79,2.74,14.68,14.68,0,0,0,5.21.92,9.7,9.7,0,0,0,5.37-1.3,4.13,4.13,0,0,0,2-3.69,3,3,0,0,0-.54-1.85,4.52,4.52,0,0,0-1.57-1.3,13.12,13.12,0,0,0-2.62-1c-1.05-.29-2.28-.58-3.67-.89-1.6-.37-3-.75-4.17-1.12a13.32,13.32,0,0,1-2.91-1.27,4.76,4.76,0,0,1-1.71-1.75A5.55,5.55,0,0,1,170,39a7.13,7.13,0,0,1,3.07-6,10.52,10.52,0,0,1,3.32-1.5,15.45,15.45,0,0,1,4-.51,16.4,16.4,0,0,1,5.83,1,11.6,11.6,0,0,1,4.22,2.62l-1.76,2A9.81,9.81,0,0,0,185,34.32a14.08,14.08,0,0,0-4.62-.77,12.46,12.46,0,0,0-2.68.28,6.77,6.77,0,0,0-2.16.89A4.57,4.57,0,0,0,174,36.28a4.33,4.33,0,0,0-.54,2.21,3.49,3.49,0,0,0,.38,1.73,3.11,3.11,0,0,0,1.23,1.14,10.73,10.73,0,0,0,2.16.87q1.32.38,3.18.78c1.79.41,3.35.82,4.71,1.22a15.49,15.49,0,0,1,3.39,1.43,5.69,5.69,0,0,1,2.06,2,5.52,5.52,0,0,1,.69,2.85,6.82,6.82,0,0,1-2.93,5.8A13.25,13.25,0,0,1,180.45,58.42Z"/><rect x="17.72" y="19.19" width="5.75" height="33.16" transform="translate(-16.58 17.83) rotate(-34.3)"/><path d="M28.23,52.06a14,14,0,0,0,7,5.15A14.78,14.78,0,0,0,33,48.82Z"/></svg>',
    publish: '<svg id="publish_btn_svg" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80"><path d="M29.14,58.42a11.34,11.34,0,0,1-6.22-1.7,13.88,13.88,0,0,1-4.36-4.3V68.75H14.92V31.42h3.26v5.14a13.3,13.3,0,0,1,4.44-4.05A11.85,11.85,0,0,1,28.55,31a12.1,12.1,0,0,1,5.3,1.15,13.61,13.61,0,0,1,4.17,3,14.16,14.16,0,0,1,2.75,4.4,13.77,13.77,0,0,1,1,5.13A15.2,15.2,0,0,1,40.85,50a13.4,13.4,0,0,1-2.59,4.37,12.44,12.44,0,0,1-4,3A11.83,11.83,0,0,1,29.14,58.42Zm-1-3.05a9.09,9.09,0,0,0,4.09-.91A10,10,0,0,0,35.37,52a10.93,10.93,0,0,0,2-3.41,11.47,11.47,0,0,0,.69-3.94,10.62,10.62,0,0,0-.8-4.07,11.4,11.4,0,0,0-2.19-3.4,10.28,10.28,0,0,0-3.29-2.34A9.72,9.72,0,0,0,27.7,34a8.66,8.66,0,0,0-2.91.54A12.17,12.17,0,0,0,22,36a9.71,9.71,0,0,0-2.24,2.09,5.35,5.35,0,0,0-1.15,2.51v8.14a12,12,0,0,0,1.63,2.64,11.17,11.17,0,0,0,2.24,2.11,10.83,10.83,0,0,0,2.7,1.4A9,9,0,0,0,28.13,55.37Z"/><path d="M56.62,58.42c-3,0-5.29-1-6.76-2.87S47.64,50.78,47.64,47V31.42h3.63V46.37q0,9,6.47,9a10.24,10.24,0,0,0,6-2,12.47,12.47,0,0,0,2.36-2.29,11.51,11.51,0,0,0,1.68-3V31.42h3.63v22c0,1,.43,1.42,1.29,1.42v3a6.94,6.94,0,0,1-1,.11H71.1A3,3,0,0,1,69,57.15a3,3,0,0,1-.8-2.19V51.91a12.71,12.71,0,0,1-4.95,4.81A13.63,13.63,0,0,1,56.62,58.42Z"/><path d="M93.29,58.42a12,12,0,0,1-6.07-1.57,11.87,11.87,0,0,1-4.3-4.07v5.13H79.66V20.79h3.63V37a15.73,15.73,0,0,1,4.49-4.35A11.2,11.2,0,0,1,93.87,31a11.57,11.57,0,0,1,5.27,1.17,12.1,12.1,0,0,1,4,3.13,14.43,14.43,0,0,1,2.52,4.42,14.89,14.89,0,0,1,.88,5.06,13.81,13.81,0,0,1-1,5.29,13.67,13.67,0,0,1-2.78,4.35,13.07,13.07,0,0,1-4.19,2.95A12.54,12.54,0,0,1,93.29,58.42Zm-.86-3.05a9.7,9.7,0,0,0,4.2-.89,10.23,10.23,0,0,0,3.26-2.39A11.36,11.36,0,0,0,102,48.68a10.47,10.47,0,0,0,.77-3.94,11.34,11.34,0,0,0-.72-4,11.09,11.09,0,0,0-2-3.44,10,10,0,0,0-3.16-2.39,9.16,9.16,0,0,0-4-.89,8.74,8.74,0,0,0-3.1.54A10.48,10.48,0,0,0,87.09,36a12.2,12.2,0,0,0-2.2,2.11,13.14,13.14,0,0,0-1.6,2.51v8.24a5.51,5.51,0,0,0,1.15,2.57,9.38,9.38,0,0,0,2.24,2.06,12,12,0,0,0,2.84,1.37A9.11,9.11,0,0,0,92.43,55.37Z"/><path d="M112.8,20.79h3.63V51.91a3.1,3.1,0,0,0,.86,2.32,3.28,3.28,0,0,0,2.4.84,7,7,0,0,0,1.39-.16,9.11,9.11,0,0,0,1.5-.4l.64,2.79a11.44,11.44,0,0,1-2.49.66,15.16,15.16,0,0,1-2.53.26,5.56,5.56,0,0,1-4-1.35,4.94,4.94,0,0,1-1.44-3.79Z"/><path d="M127.17,25.88V20.79h3.64v5.09Zm0,32V31.42h3.64V57.91Z"/><path d="M148.08,58.42a20.55,20.55,0,0,1-6.37-1,15.56,15.56,0,0,1-5.34-2.95L138,52.12a18.18,18.18,0,0,0,4.78,2.74,14.68,14.68,0,0,0,5.21.92,9.7,9.7,0,0,0,5.37-1.3,4.13,4.13,0,0,0,2-3.69,3,3,0,0,0-.54-1.85,4.52,4.52,0,0,0-1.57-1.3,13.12,13.12,0,0,0-2.62-1c-1-.29-2.27-.58-3.66-.89-1.61-.37-3-.75-4.17-1.12a13.21,13.21,0,0,1-2.92-1.27,4.76,4.76,0,0,1-1.71-1.75,5.55,5.55,0,0,1-.56-2.62,7.13,7.13,0,0,1,3.07-6,10.52,10.52,0,0,1,3.32-1.5,15.47,15.47,0,0,1,4-.51,16.34,16.34,0,0,1,5.82,1,11.6,11.6,0,0,1,4.22,2.62l-1.76,2a9.81,9.81,0,0,0-3.77-2.29,14.08,14.08,0,0,0-4.62-.77,12.53,12.53,0,0,0-2.68.28,6.87,6.87,0,0,0-2.16.89,4.57,4.57,0,0,0-1.47,1.56,4.33,4.33,0,0,0-.53,2.21,3.5,3.5,0,0,0,.37,1.73,3.11,3.11,0,0,0,1.23,1.14,10.73,10.73,0,0,0,2.16.87c.88.25,1.94.51,3.19.78,1.78.41,3.34.82,4.7,1.22a15.49,15.49,0,0,1,3.39,1.43,5.69,5.69,0,0,1,2.06,2,5.52,5.52,0,0,1,.7,2.85,6.81,6.81,0,0,1-2.94,5.8A13.22,13.22,0,0,1,148.08,58.42Z"/><path d="M188.27,57.91h-3.63V43.12c0-3-.55-5.28-1.63-6.77a5.56,5.56,0,0,0-4.79-2.24,8.53,8.53,0,0,0-3.07.59,11.52,11.52,0,0,0-5.19,4,10.21,10.21,0,0,0-1.47,3V57.91h-3.63V20.79h3.63V37.42a12.5,12.5,0,0,1,11-6.46,8.87,8.87,0,0,1,4.06.84,7.36,7.36,0,0,1,2.73,2.34,10,10,0,0,1,1.55,3.61,21,21,0,0,1,.48,4.65Z"/></svg>',
    replay: '<svg id="replay_btn_svg" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80"><defs><style>.cls-1{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:2px;}</style></defs><path d="M59.46,34.47a11.82,11.82,0,0,0-6.41,1.93,9.78,9.78,0,0,0-3.85,5V57.91H45.56V31.42H49v6.36A12.26,12.26,0,0,1,53.15,33a10,10,0,0,1,5.62-1.73,3.36,3.36,0,0,1,.69.05Z"/><path d="M75,58.42a13.92,13.92,0,0,1-5.58-1.09,13.58,13.58,0,0,1-4.41-3,13.92,13.92,0,0,1-2.92-4.4,13.78,13.78,0,0,1-1-5.34,13.45,13.45,0,0,1,1-5.26A13.64,13.64,0,0,1,64.94,35a13.87,13.87,0,0,1,4.41-3,14.8,14.8,0,0,1,11.15,0,13.36,13.36,0,0,1,4.35,3,13.79,13.79,0,0,1,2.84,4.32,13.52,13.52,0,0,1,1,5.19v.81a2.18,2.18,0,0,1,0,.56H64.81a10.49,10.49,0,0,0,1,3.94A10.71,10.71,0,0,0,68.12,53,10.3,10.3,0,0,0,71.3,55a10,10,0,0,0,3.82.74,10.35,10.35,0,0,0,2.68-.36,10.87,10.87,0,0,0,2.45-1,9.42,9.42,0,0,0,2-1.5,6.64,6.64,0,0,0,1.39-2l3.15.81A8.86,8.86,0,0,1,85,54.48a12.67,12.67,0,0,1-2.72,2.09,14,14,0,0,1-3.42,1.37A15.69,15.69,0,0,1,75,58.42ZM85.23,43.27a10.28,10.28,0,0,0-1-3.89,10.47,10.47,0,0,0-2.24-3,9.89,9.89,0,0,0-3.15-2A10.18,10.18,0,0,0,75,33.66a10.4,10.4,0,0,0-3.85.71,9.81,9.81,0,0,0-3.18,2,9.94,9.94,0,0,0-2.19,3,11.26,11.26,0,0,0-1,3.87Z"/><path d="M108.53,58.42a11.39,11.39,0,0,1-6.23-1.7A13.85,13.85,0,0,1,98,52.42V68.75H94.31V31.42h3.26v5.14A13.2,13.2,0,0,1,102,32.51,11.82,11.82,0,0,1,107.94,31a12.1,12.1,0,0,1,5.3,1.15,13.45,13.45,0,0,1,4.16,3,14,14,0,0,1,2.76,4.4,13.77,13.77,0,0,1,1,5.13,15.43,15.43,0,0,1-.91,5.29,13.4,13.4,0,0,1-2.59,4.37,12.44,12.44,0,0,1-4,3A11.86,11.86,0,0,1,108.53,58.42Zm-1-3.05a9.09,9.09,0,0,0,4.09-.91A10.28,10.28,0,0,0,114.76,52a10.72,10.72,0,0,0,2-3.41,11.25,11.25,0,0,0,.7-3.94,10.62,10.62,0,0,0-.8-4.07,11.24,11.24,0,0,0-2.2-3.4,10.13,10.13,0,0,0-3.28-2.34,9.72,9.72,0,0,0-4.09-.87,8.76,8.76,0,0,0-2.92.54A12.1,12.1,0,0,0,101.34,36a9.71,9.71,0,0,0-2.24,2.09A5.35,5.35,0,0,0,98,40.57v8.14a12,12,0,0,0,1.63,2.64,11.17,11.17,0,0,0,2.24,2.11,10.83,10.83,0,0,0,2.7,1.4A8.92,8.92,0,0,0,107.52,55.37Z"/><path d="M127.45,20.79h3.64V51.91a3.1,3.1,0,0,0,.85,2.32,3.29,3.29,0,0,0,2.41.84,7,7,0,0,0,1.39-.16,9.26,9.26,0,0,0,1.49-.4l.65,2.79a11.44,11.44,0,0,1-2.49.66,15.26,15.26,0,0,1-2.54.26,5.55,5.55,0,0,1-3.95-1.35,4.91,4.91,0,0,1-1.45-3.79Z"/><path d="M148.83,58.42a10.38,10.38,0,0,1-3.66-.63A9.43,9.43,0,0,1,142.23,56a7.81,7.81,0,0,1-1.95-2.62,7.61,7.61,0,0,1-.69-3.23,6.26,6.26,0,0,1,.85-3.2,7.85,7.85,0,0,1,2.41-2.54,11.79,11.79,0,0,1,3.69-1.65,17.73,17.73,0,0,1,4.7-.59,26.72,26.72,0,0,1,4.33.36,19.09,19.09,0,0,1,3.9,1V41.18a7.48,7.48,0,0,0-2.08-5.57,7.89,7.89,0,0,0-5.78-2.06,12.91,12.91,0,0,0-4.38.82,21.11,21.11,0,0,0-4.54,2.34l-1.29-2.29A19.41,19.41,0,0,1,151.88,31c3.49,0,6.24.93,8.23,2.8a10,10,0,0,1,3,7.73V53.44c0,1,.44,1.42,1.33,1.42v3a8.26,8.26,0,0,1-1.39.16,3.22,3.22,0,0,1-2.16-.66,2.42,2.42,0,0,1-.83-1.83L160,53.49a12.57,12.57,0,0,1-4.83,3.66A15.54,15.54,0,0,1,148.83,58.42Zm.86-2.64a13.09,13.09,0,0,0,5.21-1,8.52,8.52,0,0,0,3.61-2.69,3.21,3.21,0,0,0,.72-1,2.39,2.39,0,0,0,.24-1V45.76a23.52,23.52,0,0,0-3.77-1,22.83,22.83,0,0,0-4-.35,11.54,11.54,0,0,0-6.25,1.52,4.6,4.6,0,0,0-2.41,4,5.25,5.25,0,0,0,.51,2.29A5.74,5.74,0,0,0,145,54.07a6.42,6.42,0,0,0,2.11,1.25A7.33,7.33,0,0,0,149.69,55.78Z"/><path d="M171.87,66.05l.83.08.78,0A3.73,3.73,0,0,0,175,65.9a2.73,2.73,0,0,0,1.1-1.12,19.72,19.72,0,0,0,1.2-2.49c.44-1.09,1.08-2.54,1.9-4.38L167.06,31.42h3.74l10.32,23.29,9.57-23.29h3.47L179.73,65.59a6.17,6.17,0,0,1-1.95,2.57,5.78,5.78,0,0,1-3.72,1.09c-.35,0-.69,0-1,0s-.71-.06-1.18-.13Z"/><polygon points="8.34 44.91 23.84 32.12 23.84 56.55 8.34 44.91"/><polygon points="22.52 44.91 38.02 32.12 38.02 56.55 22.52 44.91"/><line class="cls-1" x1="8.34" y1="56.55" x2="8.34" y2="32.12"/></svg>',
    record: '<svg id="record_btn_svg" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80"><path d="M54.46,34.47a11.82,11.82,0,0,0-6.41,1.93,9.78,9.78,0,0,0-3.85,5V57.91H40.56V31.42H44v6.36A12.26,12.26,0,0,1,48.15,33a10,10,0,0,1,5.62-1.73,3.36,3.36,0,0,1,.69.05Z"/><path d="M70,58.42a13.92,13.92,0,0,1-5.58-1.09,13.58,13.58,0,0,1-4.41-3,13.92,13.92,0,0,1-2.92-4.4,13.78,13.78,0,0,1-1-5.34,13.45,13.45,0,0,1,1-5.26A13.64,13.64,0,0,1,59.94,35a13.87,13.87,0,0,1,4.41-3,14.8,14.8,0,0,1,11.15,0,13.36,13.36,0,0,1,4.35,3,13.79,13.79,0,0,1,2.84,4.32,13.52,13.52,0,0,1,1,5.19v.81a2.18,2.18,0,0,1,0,.56H59.81a10.49,10.49,0,0,0,1,3.94A10.71,10.71,0,0,0,63.12,53,10.3,10.3,0,0,0,66.3,55a10,10,0,0,0,3.82.74,10.35,10.35,0,0,0,2.68-.36,10.87,10.87,0,0,0,2.45-1,9.42,9.42,0,0,0,2-1.5,6.64,6.64,0,0,0,1.39-2l3.15.81A8.86,8.86,0,0,1,80,54.48a12.67,12.67,0,0,1-2.72,2.09,14,14,0,0,1-3.42,1.37A15.69,15.69,0,0,1,70,58.42ZM80.23,43.27a10.28,10.28,0,0,0-1-3.89,10.47,10.47,0,0,0-2.24-3,9.89,9.89,0,0,0-3.15-2A10.18,10.18,0,0,0,70,33.66a10.4,10.4,0,0,0-3.85.71,9.81,9.81,0,0,0-3.18,2,9.94,9.94,0,0,0-2.19,3,11.26,11.26,0,0,0-1,3.87Z"/><path d="M87.39,44.59a14,14,0,0,1,1-5.29A13.22,13.22,0,0,1,91.26,35,13.48,13.48,0,0,1,95.67,32,14.65,14.65,0,0,1,101.34,31a13.48,13.48,0,0,1,6.9,1.71,11.08,11.08,0,0,1,4.43,4.6l-3.53,1.06a8.27,8.27,0,0,0-3.28-3.17,10.08,10.08,0,0,0-8.66-.33,10,10,0,0,0-5.35,5.54,11.16,11.16,0,0,0-.77,4.22,11,11,0,0,0,.8,4.22,10.5,10.5,0,0,0,2.19,3.43,10.38,10.38,0,0,0,3.23,2.29,9.37,9.37,0,0,0,3.93.84A10.26,10.26,0,0,0,106.31,54a8.48,8.48,0,0,0,1.93-1.45,4.76,4.76,0,0,0,1.12-1.72l3.58,1a8.46,8.46,0,0,1-1.71,2.62,11.77,11.77,0,0,1-2.65,2.09,13.16,13.16,0,0,1-3.37,1.37,15,15,0,0,1-3.82.48,14.14,14.14,0,0,1-5.61-1.09,13.71,13.71,0,0,1-4.44-3,14.06,14.06,0,0,1-2.91-4.4A13.78,13.78,0,0,1,87.39,44.59Z"/><path d="M130.26,58.42a13.76,13.76,0,0,1-5.56-1.09,13.57,13.57,0,0,1-4.36-3A13.41,13.41,0,0,1,117.48,50a13.88,13.88,0,0,1-1-5.24,13.53,13.53,0,0,1,1-5.29,13.82,13.82,0,0,1,2.89-4.37,14.19,14.19,0,0,1,4.35-3A13.34,13.34,0,0,1,130.26,31a13.5,13.5,0,0,1,5.53,1.12,14.09,14.09,0,0,1,4.38,3,13.71,13.71,0,0,1,3.93,9.66,13.88,13.88,0,0,1-1,5.24,13.42,13.42,0,0,1-7.25,7.35A13.92,13.92,0,0,1,130.26,58.42Zm-10.1-13.63a10.48,10.48,0,0,0,.8,4.15,11,11,0,0,0,2.16,3.35,9.7,9.7,0,0,0,7.14,3.08,9.37,9.37,0,0,0,3.93-.84,10.38,10.38,0,0,0,3.23-2.29,11,11,0,0,0,0-15.1,10.38,10.38,0,0,0-3.23-2.29,9.37,9.37,0,0,0-3.93-.84,9.17,9.17,0,0,0-3.9.84,10.18,10.18,0,0,0-3.21,2.32,11,11,0,0,0-3,7.62Z"/><path d="M164.09,34.47a11.85,11.85,0,0,0-6.41,1.93,9.78,9.78,0,0,0-3.85,5V57.91H150.2V31.42h3.42v6.36A12.1,12.1,0,0,1,157.79,33a9.91,9.91,0,0,1,5.61-1.73,3.3,3.3,0,0,1,.69.05Z"/><path d="M179,58.42a12.56,12.56,0,0,1-5.35-1.14,13.46,13.46,0,0,1-4.22-3,14,14,0,0,1-3.74-9.51,14.79,14.79,0,0,1,1-5.31,13.82,13.82,0,0,1,2.65-4.4,12.54,12.54,0,0,1,4-3A12,12,0,0,1,178.42,31a11.28,11.28,0,0,1,6.25,1.76A13.54,13.54,0,0,1,189,37V20.79h3.64V53.44c0,1,.42,1.42,1.28,1.42v3a6.67,6.67,0,0,1-1.28.16,3.47,3.47,0,0,1-2.25-.79,2.4,2.4,0,0,1-1-1.91V52.78a12,12,0,0,1-4.49,4.12A12.33,12.33,0,0,1,179,58.42Zm.8-3.05a9.06,9.06,0,0,0,2.86-.51,11.68,11.68,0,0,0,2.86-1.4,9.43,9.43,0,0,0,2.27-2.08A5.51,5.51,0,0,0,189,48.81V40.62a9,9,0,0,0-1.55-2.56,12.4,12.4,0,0,0-2.33-2.12,11,11,0,0,0-2.8-1.42,9.1,9.1,0,0,0-2.94-.51,8.88,8.88,0,0,0-4.06.92,10.05,10.05,0,0,0-3.13,2.41,10.85,10.85,0,0,0-2,3.44,11.67,11.67,0,0,0-.69,4,10.59,10.59,0,0,0,.8,4.07,10.94,10.94,0,0,0,2.19,3.38,10.71,10.71,0,0,0,3.29,2.32A9.83,9.83,0,0,0,179.81,55.37Z"/><path d="M34.26,32.12H14V30.29H8.73v1.83H8.3A3.3,3.3,0,0,0,5,35.42v19.2a3.29,3.29,0,0,0,3.3,3.29h26a3.29,3.29,0,0,0,3.29-3.29V35.42A3.29,3.29,0,0,0,34.26,32.12Zm-13,20.7a7.81,7.81,0,1,1,7.8-7.8A7.81,7.81,0,0,1,21.28,52.82Z"/><circle cx="21.28" cy="45.02" r="4.77"/></svg>'
};
exports.styleText = [
    ".bbp.button-bar { position: absolute; z-index: 2; overflow: hidden; padding: 0 10px 4px 0; }",
    ".bbp.button-bar > .button { float: right; width: 75px; height: 30px; cursor: pointer; border-radius: 2px; background-color: #f0f0f0; margin: 0 4px 0 0; }",
    ".bbp.button-bar > .button:hover { background-color: #ddd; }",
    ".bbp.button-bar > .button > svg { width: 75px; height: 30px; }",
    ".bbp.label-control { position: absolute; z-index: 3; font-family: sans-serif; width: 200px; background-color: #f0f0f0; padding: 5px; border-radius: 2px; }",
    ".bbp.label-control > label { font-size: 11pt; }",
    ".bbp.label-control > .edit-container { overflow: auto; }",
    ".bbp.label-control > .edit-container > .label-form { margin-top: 5px; padding-top: 20px; border-top: solid thin #ccc; }",
    ".bbp.label-control .label-form > input { width: 100%; box-sizing: border-box; }",
    ".bbp.label-control .label-form > button { border: none; font-weight: bold; background-color: white; padding: 5px 10px; margin: 5px 0 2px 0; width: 100%; cursor: pointer; }",
    ".bbp.label-control .label-form > button:hover { background-color: #ddd; }",
    ".bbp.overlay { position: absolute; z-index: 3; overflow: hidden; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; background-color: #fff5; display: flex; justify-content: center; align-items: center;}",
    ".bbp.overlay > h5.loading-message { color: #000; font-family: Verdana, sans-serif;}",
    ".bbp.publish-form > label { display: block; text-align: left; font-family: Verdana, sans-serif; }",
    ".bbp.publish-form > input { width: 100%; margin-bottom: 15px; box-sizing: border-box; }",
    ".bbp.publish-form > .publish-btn { border: none; font-weight: bold; background-color: #e95420; color: white; padding: 5px 10px; margin: 5px 0 2px 0; width: 100%; cursor: pointer; }",
    ".bbp.publish-form > .publish-btn:hover { background-color: #ca491a }",
    ".bbp.publish-form > .close-btn, .bbp.publish-form > .cancel-btn { border: none; font-weight: bold; background-color: white; padding: 5px 10px; margin: 5px 0 2px 0; width: 100%; cursor: pointer; }",
    ".bbp.publish-form > .close-btn:hover, .bbp.publish-form > .cancel-btn:hover { background-color: #ddd }",
    ".bbp.publish-form > p.form-info { font-size: 8pt; font-family: Verdana, sans-serif; }",
    ".bbp.publish-form > p.message { font-size: 10pt; font-family: Verdana, sans-serif; }",
    ".bbp.publish-form > p.message.warning { color: red; margin-top: 0px; }",
    ".bbp.publish-form > p.message.success { color: green; }",
].join(" ");
var Plot = (function () {
    function Plot(scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        this._size = 1;
        this._scene = scene;
        this._coords = coordinates;
        this._coordColors = colorVar;
        this._size = size;
        this.legendData = legendData;
        this.xScale = xScale;
        this.yScale = yScale;
        this.zScale = zScale;
    }
    Plot.prototype.updateSize = function () { };
    Plot.prototype.update = function () { return false; };
    Plot.prototype.resetAnimation = function () { };
    return Plot;
}());
exports.Plot = Plot;
Array.prototype.min = function () {
    if (this.length > 65536) {
        var r_1 = this[0];
        this.forEach(function (v, _i, _a) { if (v < r_1)
            r_1 = v; });
        return r_1;
    }
    else {
        return Math.min.apply(null, this);
    }
};
Array.prototype.max = function () {
    if (this.length > 65536) {
        var r_2 = this[0];
        this.forEach(function (v, _i, _a) { if (v > r_2)
            r_2 = v; });
        return r_2;
    }
    else {
        return Math.max.apply(null, this);
    }
};
function matrixMax(matrix) {
    var maxRow = matrix.map(function (row) { return row.max(); });
    var max = maxRow.max();
    return max;
}
exports.matrixMax = matrixMax;
function matrixMin(matrix) {
    var minRow = matrix.map(function (row) { return row.min(); });
    var min = minRow.min();
    return min;
}
exports.matrixMin = matrixMin;
function getUniqueVals(source) {
    var length = source.length;
    var result = [];
    var seen = new Set();
    outer: for (var index = 0; index < length; index++) {
        var value = source[index];
        if (seen.has(value))
            continue outer;
        seen.add(value);
        result.push(value);
    }
    return result;
}
exports.getUniqueVals = getUniqueVals;
var ImgStack_1 = require("./ImgStack");
var PointCloud_1 = require("./PointCloud");
var Surface_1 = require("./Surface");
var HeatMap_1 = require("./HeatMap");
exports.PLOTTYPES = {
    'pointCloud': ['coordinates', 'colorBy', 'colorVar'],
    'surface': ['coordinates', 'colorBy', 'colorVar'],
    'heatMap': ['coordinates', 'colorBy', 'colorVar'],
    'imageStack': ['values', 'indices', 'attributes']
};
function isValidPlot(plotData) {
    for (var plotIdx = 0; plotIdx < plotData["plots"].length; plotIdx++) {
        var plot = plotData["plots"][plotIdx];
        var pltType = plot["plotType"];
        if (exports.PLOTTYPES.hasOwnProperty(pltType)) {
            for (var i = 0; i < exports.PLOTTYPES[pltType].length; i++) {
                var prop = exports.PLOTTYPES[pltType][i];
                if (plot[prop] === undefined) {
                    console.log('Plot ' + plotIdx + ' is missing property:' + prop);
                    return false;
                }
            }
        }
        else {
            console.log('Unrecognized plot type');
            return false;
        }
    }
    return true;
}
exports.isValidPlot = isValidPlot;
var Plots = (function () {
    function Plots(canvasElement, options) {
        if (options === void 0) { options = {}; }
        this._showLegend = true;
        this._hasAnim = false;
        this._axes = [];
        this._downloadObj = {};
        this._recording = false;
        this._turned = 0;
        this._wasTurning = false;
        this._xScale = 1;
        this._yScale = 1;
        this._zScale = 1;
        this.plots = [];
        this.fixedSize = false;
        this.ymax = 0;
        this.R = false;
        this._uniqID = uuid_1.v4();
        var opts = {
            backgroundColor: "#ffffffff",
            xScale: 1,
            yScale: 1,
            zScale: 1,
            turntable: false,
            rotationRate: 0.01
        };
        Object.assign(opts, options);
        this.turntable = opts.turntable;
        this.rotationRate = opts.rotationRate;
        this._backgroundColor = opts.backgroundColor;
        this.canvas = document.getElementById(canvasElement);
        this._engine = new engine_1.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new scene_1.Scene(this._engine);
        this.camera = new arcRotateCamera_1.ArcRotateCamera("Camera", 0, 0, 10, math_1.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.scene.activeCamera = this.camera;
        this.camera.inputs.attached.keyboard.detachControl(this.canvas);
        this.camera.wheelPrecision = 50;
        this.scene.clearColor = math_1.Color4.FromHexString(opts.backgroundColor);
        this._xScale = opts.xScale;
        this._yScale = opts.yScale;
        this._zScale = opts.zScale;
        this._hl1 = new hemisphericLight_1.HemisphericLight("HemiLight", new math_1.Vector3(0, 1, 0), this.scene);
        this._hl1.diffuse = new math_1.Color3(1, 1, 1);
        this._hl1.specular = new math_1.Color3(0, 0, 0);
        this._hl2 = new hemisphericLight_1.HemisphericLight("HemiLight", new math_1.Vector3(0, -1, 0), this.scene);
        this._hl2.diffuse = new math_1.Color3(0.8, 0.8, 0.8);
        this._hl2.specular = new math_1.Color3(0, 0, 0);
        this._annotationManager = new Label_1.AnnotationManager(this.canvas, this.scene, this.ymax, this.camera);
        this.scene.registerBeforeRender(this._prepRender.bind(this));
        this.scene.registerAfterRender(this._afterRender.bind(this));
        var styleElem = document.createElement("style");
        styleElem.appendChild(document.createTextNode(exports.styleText));
        document.getElementsByTagName('head')[0].appendChild(styleElem);
        var buttonBar = document.createElement("div");
        buttonBar.className = "bbp button-bar";
        buttonBar.style.top = this.canvas.clientTop + 5 + "px";
        buttonBar.style.left = this.canvas.clientLeft + 5 + "px";
        this.canvas.parentNode.appendChild(buttonBar);
        this._buttonBar = buttonBar;
        this._downloadObj = {
            plots: []
        };
    }
    Plots.prototype.fromJSON = function (plotData) {
        if (plotData["turntable"] !== undefined) {
            this.turntable = plotData["turntable"];
        }
        if (plotData["rotationRate"] !== undefined) {
            this.rotationRate = plotData["rotationRate"];
        }
        if (plotData["backgroundColor"]) {
            this._backgroundColor = plotData["backgroundColor"];
            this.scene.clearColor = math_1.Color4.FromHexString(this._backgroundColor);
        }
        if (plotData["xScale"] !== undefined) {
            this._xScale = plotData["xScale"];
        }
        if (plotData["yScale"] !== undefined) {
            this._yScale = plotData["yScale"];
        }
        if (plotData["zScale"] !== undefined) {
            this._zScale = plotData["zScale"];
        }
        for (var plotIdx = 0; plotIdx < plotData["plots"].length; plotIdx++) {
            var plot = plotData["plots"][plotIdx];
            if (plot["plotType"] === "imageStack") {
                this.addImgStack(plot["values"], plot["indices"], plot["attributes"], {
                    size: plot["size"],
                    colorScale: plot["colorScale"],
                    showLegend: plot["showLegend"],
                    fontSize: plot["fontSize"],
                    fontColor: plot["fontColor"],
                    legendTitle: plot["legendTitle"],
                    legendTitleFontSize: plot["legendTitleFontSize"],
                    legendPosition: plot["legendPosition"],
                    showAxes: plot["showAxes"],
                    axisLabels: plot["axisLabels"],
                    axisColors: plot["axisColors"],
                    tickBreaks: plot["tickBreaks"],
                    showTickLines: plot["showTickLines"],
                    tickLineColors: plot["tickLineColors"],
                    intensityMode: plot["intensityMode"]
                });
            }
            else if (["pointCloud", "heatMap", "surface"].indexOf(plot["plotType"]) !== -1) {
                this.addPlot(plot["coordinates"], plot["plotType"], plot["colorBy"], plot["colorVar"], {
                    size: plot["size"],
                    colorScale: plot["colorScale"],
                    customColorScale: plot["customColorScale"],
                    colorScaleInverted: plot["colorScaleInverted"],
                    sortedCategories: plot["sortedCategories"],
                    showLegend: plot["showLegend"],
                    fontSize: plot["fontSize"],
                    fontColor: plot["fontColor"],
                    legendTitle: plot["legendTitle"],
                    legendTitleFontSize: plot["legendTitleFontSize"],
                    legendPosition: plot["legendPosition"],
                    showAxes: plot["showAxes"],
                    axisLabels: plot["axisLabels"],
                    axisColors: plot["axisColors"],
                    tickBreaks: plot["tickBreaks"],
                    showTickLines: plot["showTickLines"],
                    tickLineColors: plot["tickLineColors"],
                    folded: plot["folded"],
                    foldedEmbedding: plot["foldedEmbedding"],
                    foldAnimDelay: plot["foldAnimDelay"],
                    foldAnimDuration: plot["foldAnimDuration"],
                    colnames: plot["colnames"],
                    rownames: plot["rownames"]
                });
            }
        }
        if (plotData["labels"]) {
            this._annotationManager.fixedLabels = true;
            var labelData = plotData["labels"];
            if (labelData.length > 0) {
                if (Array.isArray(labelData[0])) {
                    this._annotationManager.addLabels(labelData);
                }
                else {
                    for (var i = 0; i < labelData.length; i++) {
                        var label = labelData[i];
                        if (label["text"] && label["position"]) {
                            this._annotationManager.addLabel(label["text"], label["position"]);
                        }
                    }
                }
            }
        }
        if (plotData["cameraAlpha"] !== undefined) {
            this.camera.alpha = plotData["cameraAlpha"];
        }
        if (plotData["cameraBeta"] !== undefined) {
            this.camera.beta = plotData["cameraBeta"];
        }
        if (plotData["cameraRadius"] !== undefined) {
            this.camera.radius = plotData["cameraRadius"];
        }
    };
    Plots.prototype.createButtons = function (whichBtns) {
        if (whichBtns === void 0) { whichBtns = ["json", "label", "publish", "record"]; }
        if (whichBtns.indexOf("json") !== -1) {
            var jsonBtn = document.createElement("div");
            jsonBtn.className = "button";
            jsonBtn.onclick = this._downloadJson.bind(this);
            jsonBtn.innerHTML = exports.buttonSVGs.toJson;
            this._buttonBar.appendChild(jsonBtn);
        }
        if (whichBtns.indexOf("label") !== -1) {
            var labelBtn = document.createElement("div");
            labelBtn.className = "button";
            labelBtn.onclick = this._annotationManager.toggleLabelControl.bind(this._annotationManager);
            labelBtn.innerHTML = exports.buttonSVGs.labels;
            this._buttonBar.appendChild(labelBtn);
        }
        if (whichBtns.indexOf("record") !== -1) {
            var recordBtn = document.createElement("div");
            recordBtn.className = "button";
            recordBtn.onclick = this._startRecording.bind(this);
            recordBtn.innerHTML = exports.buttonSVGs.record;
            this._buttonBar.appendChild(recordBtn);
        }
        if (whichBtns.indexOf("publish") !== -1) {
            var publishBtn = document.createElement("div");
            publishBtn.className = "button";
            publishBtn.onclick = this._createPublishForm.bind(this);
            publishBtn.innerHTML = exports.buttonSVGs.publish;
            this._buttonBar.appendChild(publishBtn);
        }
    };
    Plots.prototype._prepDownloadObj = function () {
        this._downloadObj["turntable"] = this.turntable;
        this._downloadObj["rotationRate"] = this.rotationRate;
        this._downloadObj["backgroundColor"] = this._backgroundColor;
        this._downloadObj["xScale"] = this._xScale;
        this._downloadObj["yScale"] = this._yScale;
        this._downloadObj["zScale"] = this._zScale;
        this._downloadObj["cameraAlpha"] = this.camera.alpha;
        this._downloadObj["cameraBeta"] = this.camera.beta;
        this._downloadObj["cameraRadius"] = this.camera.radius;
        this._downloadObj["labels"] = this._annotationManager.exportLabels();
        this._downloadObj["cameraAlpha"] = this.camera.alpha;
        this._downloadObj["cameraBeta"] = this.camera.beta;
        this._downloadObj["cameraRadius"] = this.camera.radius;
    };
    Plots.prototype._downloadJson = function () {
        var dlElement = document.createElement("a");
        this._prepDownloadObj();
        var dlContent = encodeURIComponent(JSON.stringify(this._downloadObj));
        dlElement.setAttribute("href", "data:text/plain;charset=utf-8," + dlContent);
        dlElement.setAttribute("download", "babyplots_export.json");
        dlElement.style.display = "none";
        document.body.appendChild(dlElement);
        dlElement.click();
        document.body.removeChild(dlElement);
    };
    Plots.prototype._createPublishForm = function () {
        if (this._publishFormOverlay !== undefined) {
            return;
        }
        var formOverlay = document.createElement("div");
        formOverlay.id = "publishOverlay_" + this._uniqID;
        formOverlay.style.position = "absolute";
        var r = this.canvas.getBoundingClientRect();
        formOverlay.style.top = r.y + "px";
        formOverlay.style.left = r.x + "px";
        formOverlay.style.width = r.width + "px";
        formOverlay.style.height = r.height + "px";
        formOverlay.style.backgroundColor = "#ffffff66";
        var formBox = document.createElement("div");
        formBox.style.width = "180px";
        formBox.style.margin = "20px auto";
        formBox.style.backgroundColor = "white";
        formBox.style.padding = "15px 30px";
        formBox.style.borderRadius = "10px";
        formBox.style.boxShadow = "0 0 10px #0003";
        formBox.className = "bbp publish-form";
        formOverlay.appendChild(formBox);
        var formInfo = document.createElement("p");
        formInfo.innerText = "Upload the plot to your account on https://bp.bleb.li. Only you will be able to see it. You can change the access settings in your account.";
        formInfo.className = "form-info";
        formBox.appendChild(formInfo);
        var usernameLabel = document.createElement("label");
        usernameLabel.id = "publishUsernameLabel_" + this._uniqID;
        usernameLabel.innerText = "Username:";
        var usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.id = "publishUsername_" + this._uniqID;
        var passwordLabel = document.createElement("label");
        passwordLabel.id = "publishPasswordLabel_" + this._uniqID;
        passwordLabel.innerText = "Password:";
        var passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordInput.id = "publishPassword_" + this._uniqID;
        var titleLabel = document.createElement("label");
        titleLabel.id = "publishTitleLabel_" + this._uniqID;
        titleLabel.innerText = "Plot title:";
        var titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.id = "publishTitle_" + this._uniqID;
        var msg = document.createElement("p");
        msg.id = "publishMessage_" + this._uniqID;
        var publishBtn = document.createElement("button");
        publishBtn.className = "publish-btn";
        publishBtn.id = "publishBtn_" + this._uniqID;
        publishBtn.onclick = this._tryPublish.bind(this);
        publishBtn.innerText = "Login and publish";
        var cancelBtn = document.createElement("button");
        cancelBtn.className = "cancel-btn";
        cancelBtn.id = "cancelBtn_" + this._uniqID;
        cancelBtn.onclick = this._cancelPublish.bind(this);
        cancelBtn.innerText = "Cancel";
        var closeBtn = document.createElement("button");
        closeBtn.className = "close-btn";
        closeBtn.id = "closeBtn_" + this._uniqID;
        closeBtn.onclick = this._cancelPublish.bind(this);
        closeBtn.innerText = "Close";
        closeBtn.style.display = "none";
        formBox.appendChild(usernameLabel);
        formBox.appendChild(usernameInput);
        formBox.appendChild(passwordLabel);
        formBox.appendChild(passwordInput);
        formBox.appendChild(titleLabel);
        formBox.appendChild(titleInput);
        formBox.appendChild(msg);
        formBox.appendChild(publishBtn);
        formBox.appendChild(cancelBtn);
        formBox.appendChild(closeBtn);
        this._publishFormOverlay = formOverlay;
        this.canvas.parentNode.appendChild(formOverlay);
    };
    Plots.prototype._resizePublishOverlay = function () {
        var r = this.canvas.getBoundingClientRect();
        this._publishFormOverlay.style.left = r.x + "px";
        this._publishFormOverlay.style.top = r.y + "px";
        this._publishFormOverlay.style.width = r.width + "px";
        this._publishFormOverlay.style.height = r.height + "px";
    };
    Plots.prototype._tryPublish = function () {
        this.thumbnail(80, (function (thumb_data) {
            this._prepDownloadObj();
            axios({
                method: 'post',
                url: 'http://127.0.0.1:5000/api/publish',
                headers: {
                    'Content-Type': "application/json;charset=UTF-8"
                },
                data: {
                    username: document.getElementById("publishUsername_" + this._uniqID).value,
                    password: document.getElementById("publishPassword_" + this._uniqID).value,
                    plotData: JSON.stringify(this._downloadObj),
                    plotName: document.getElementById("publishTitle_" + this._uniqID).value,
                    thumb: thumb_data
                },
            })
                .then((function (response) {
                var msg = document.getElementById("publishMessage_" + this._uniqID);
                msg.innerText = "Successfully published plot!";
                msg.className = "message success";
                document.getElementById("publishUsername_" + this._uniqID).style.display = "none";
                document.getElementById("publishUsernameLabel_" + this._uniqID).style.display = "none";
                document.getElementById("publishPassword_" + this._uniqID).style.display = "none";
                document.getElementById("publishPasswordLabel_" + this._uniqID).style.display = "none";
                document.getElementById("publishTitle_" + this._uniqID).style.display = "none";
                document.getElementById("publishTitleLabel_" + this._uniqID).style.display = "none";
                document.getElementById("publishBtn_" + this._uniqID).style.display = "none";
                document.getElementById("cancelBtn_" + this._uniqID).style.display = "none";
                document.getElementById("closeBtn_" + this._uniqID).style.display = "block";
            }).bind(this))
                .catch((function (response) {
                if (response.response.data["status"] === "not authorized") {
                    console.log("wrong credentials");
                    var msg = document.getElementById("publishMessage_" + this._uniqID);
                    msg.innerText = "Invalid username or password.";
                    msg.className = "message warning";
                }
                console.log(response);
            }).bind(this));
        }).bind(this));
    };
    Plots.prototype._cancelPublish = function () {
        this._publishFormOverlay.remove();
        this._publishFormOverlay = undefined;
    };
    Plots.prototype._resetAnimation = function () {
        this._hasAnim = true;
        this.plots[0].resetAnimation();
        var boundingBox = this.plots[0].mesh.getBoundingInfo().boundingBox;
        var rangeX = [
            boundingBox.minimumWorld.x,
            boundingBox.maximumWorld.x
        ];
        var rangeY = [
            boundingBox.minimumWorld.y,
            boundingBox.maximumWorld.y
        ];
        var rangeZ = [
            boundingBox.minimumWorld.z,
            boundingBox.maximumWorld.z
        ];
        this._axes[0].axisData.range = [rangeX, rangeY, rangeZ];
        this._axes[0].update(this.camera, true);
    };
    Plots.prototype._startRecording = function () {
        this._recording = true;
    };
    Plots.prototype._prepRender = function () {
        if (this.turntable) {
            this.camera.alpha += this.rotationRate;
        }
        if (this._hasAnim) {
            this._hasAnim = this.plots[0].update();
            if (!this._hasAnim) {
                var boundingBox = this.plots[0].mesh.getBoundingInfo().boundingBox;
                var rangeX = [
                    boundingBox.minimumWorld.x,
                    boundingBox.maximumWorld.x
                ];
                var rangeY = [
                    boundingBox.minimumWorld.y,
                    boundingBox.maximumWorld.y
                ];
                var rangeZ = [
                    boundingBox.minimumWorld.z,
                    boundingBox.maximumWorld.z
                ];
                this._axes[0].axisData.range = [rangeX, rangeY, rangeZ];
                this._axes[0].update(this.camera, true);
            }
        }
        if (this._axes) {
            for (var i = 0; i < this._axes.length; i++) {
                this._axes[i].update(this.camera);
            }
        }
        this._annotationManager.update();
    };
    Plots.prototype._afterRender = function () {
        if (this._recording) {
            if (this._turned === 0) {
                var worker = "./";
                if (this.R) {
                    worker = "lib/babyplots-1/";
                }
                this._capturer = new CCapture({
                    format: "gif",
                    framerate: 30,
                    verbose: false,
                    display: false,
                    quality: 50,
                    workersPath: worker
                });
                this._capturer.start();
                this.rotationRate = 0.02;
                if (this.turntable) {
                    this._wasTurning = true;
                }
                else {
                    this.turntable = true;
                }
                var loadingOverlay = document.createElement("div");
                loadingOverlay.className = "bbp overlay";
                loadingOverlay.id = "GIFloadingOverlay_" + this._uniqID;
                var loadingText = document.createElement("h5");
                loadingText.className = ".loading-message";
                loadingText.innerText = "Recording GIF...";
                loadingText.id = "GIFloadingText_" + this._uniqID;
                loadingOverlay.appendChild(loadingText);
                this.canvas.parentNode.appendChild(loadingOverlay);
            }
            if (this._turned < 2 * Math.PI) {
                this._turned += this.rotationRate;
                this._capturer.capture(this.canvas);
            }
            else {
                this._recording = false;
                this._capturer.stop();
                var loadingText = document.getElementById("GIFloadingText_" + this._uniqID);
                loadingText.innerText = "Saving GIF...";
                this._capturer.save(function (blob) {
                    downloadjs_1.default(blob, "babyplots.gif", 'image/gif');
                    document.getElementById("GIFloadingText_" + this._uniqID).remove();
                    document.getElementById("GIFloadingOverlay_" + this._uniqID).remove();
                });
                this._turned = 0;
                this.rotationRate = 0.01;
                this._hl2.diffuse = new math_1.Color3(0.8, 0.8, 0.8);
                if (!this._wasTurning) {
                    this.turntable = false;
                }
            }
        }
    };
    Plots.prototype._cameraFitPlot = function (xRange, yRange, zRange) {
        var xSize = xRange[1] - xRange[0];
        var ySize = yRange[1] - yRange[0];
        var zSize = zRange[1] - zRange[0];
        var box = boxBuilder_1.BoxBuilder.CreateBox('bdbx', {
            width: xSize, height: ySize, depth: zSize
        }, this.scene);
        var xCenter = xRange[1] - xSize / 2;
        var yCenter = yRange[1] - ySize / 2;
        var zCenter = zRange[1] - zSize / 2;
        box.position = new math_1.Vector3(xCenter, yCenter, zCenter);
        this.camera.position = new math_1.Vector3(xCenter, ySize, zCenter);
        this.camera.target = new math_1.Vector3(xCenter, yCenter, zCenter);
        var radius = box.getBoundingInfo().boundingSphere.radiusWorld;
        var aspectRatio = this._engine.getAspectRatio(this.camera);
        var halfMinFov = this.camera.fov / 2;
        if (aspectRatio < 1) {
            halfMinFov = Math.atan(aspectRatio * Math.tan(this.camera.fov / 2));
        }
        var viewRadius = Math.abs(radius / Math.sin(halfMinFov));
        this.camera.radius = viewRadius;
        box.dispose();
        this.camera.alpha = 0;
        this.camera.beta = 1;
        this.ymax = yRange[1];
    };
    Plots.prototype.addImgStack = function (values, indices, attributes, options) {
        var opts = {
            size: 1,
            colorScale: null,
            showLegend: false,
            fontSize: 11,
            fontColor: "black",
            legendTitle: null,
            legendTitleFontSize: 16,
            legendPosition: null,
            showAxes: [false, false, false],
            axisLabels: ["X", "Y", "Z"],
            axisColors: ["#666666", "#666666", "#666666"],
            tickBreaks: [2, 2, 2],
            showTickLines: [[false, false], [false, false], [false, false]],
            tickLineColors: [["#aaaaaa", "#aaaaaa"], ["#aaaaaa", "#aaaaaa"], ["#aaaaaa", "#aaaaaa"]],
            intensityMode: "alpha"
        };
        Object.assign(opts, options);
        this._downloadObj["plots"].push({
            plotType: "imageStack",
            values: values,
            indices: indices,
            attributes: attributes,
            size: opts.size,
            colorScale: opts.colorScale,
            showLegend: opts.showLegend,
            fontSize: opts.fontSize,
            fontColor: opts.fontColor,
            legendTitle: opts.legendTitle,
            legendTitleFontSize: opts.legendTitleFontSize,
            legendPosition: opts.legendPosition,
            showAxes: opts.showAxes,
            axisLabels: opts.axisLabels,
            axisColors: opts.axisColors,
            tickBreaks: opts.tickBreaks,
            showTickLines: opts.showTickLines,
            tickLineColors: opts.tickLineColors,
            intensityMode: opts.intensityMode
        });
        var legendData = {
            showLegend: false,
            discrete: false,
            breaks: [],
            colorScale: "",
            inverted: false,
            position: opts.legendPosition
        };
        legendData.fontSize = opts.fontSize;
        legendData.fontColor = opts.fontColor;
        legendData.legendTitle = opts.legendTitle;
        legendData.legendTitleFontSize = opts.legendTitleFontSize;
        var plot = new ImgStack_1.ImgStack(this.scene, values, indices, attributes, legendData, opts.size, this._backgroundColor, opts.intensityMode, this._xScale, this._yScale, this._zScale);
        this.plots.push(plot);
        this._updateLegend();
        this._cameraFitPlot([0, attributes.dim[2]], [0, attributes.dim[0]], [0, attributes.dim[1]]);
        this.camera.wheelPrecision = 1;
        return this;
    };
    Plots.prototype.addPlot = function (coordinates, plotType, colorBy, colorVar, options) {
        if (options === void 0) { options = {}; }
        var opts = {
            size: 1,
            xScale: 1,
            yScale: 1,
            zScale: 1,
            colorScale: "Oranges",
            customColorScale: [],
            colorScaleInverted: false,
            sortedCategories: [],
            showLegend: false,
            fontSize: 11,
            fontColor: "black",
            legendTitle: null,
            legendTitleFontSize: 16,
            legendPosition: null,
            showAxes: [false, false, false],
            axisLabels: ["X", "Y", "Z"],
            axisColors: ["#666666", "#666666", "#666666"],
            tickBreaks: [2, 2, 2],
            showTickLines: [[false, false], [false, false], [false, false]],
            tickLineColors: [["#aaaaaa", "#aaaaaa"], ["#aaaaaa", "#aaaaaa"], ["#aaaaaa", "#aaaaaa"]],
            folded: false,
            foldedEmbedding: null,
            foldAnimDelay: null,
            foldAnimDuration: null,
            colnames: null,
            rownames: null
        };
        Object.assign(opts, options);
        this._downloadObj["plots"].push({
            plotType: plotType,
            coordinates: coordinates,
            colorBy: colorBy,
            colorVar: colorVar,
            size: opts.size,
            colorScale: opts.colorScale,
            customColorScale: opts.customColorScale,
            colorScaleInverted: opts.colorScaleInverted,
            sortedCategories: opts.sortedCategories,
            showLegend: opts.showLegend,
            fontSize: opts.fontSize,
            fontColor: opts.fontColor,
            legendTitle: opts.legendTitle,
            legendTitleFontSize: opts.legendTitleFontSize,
            legendPosition: opts.legendPosition,
            showAxes: opts.showAxes,
            axisLabels: opts.axisLabels,
            axisColors: opts.axisColors,
            tickBreaks: opts.tickBreaks,
            showTickLines: opts.showTickLines,
            tickLineColors: opts.tickLineColors,
            folded: opts.folded,
            foldedEmbedding: opts.foldedEmbedding,
            foldAnimDelay: opts.foldAnimDelay,
            foldAnimDuration: opts.foldAnimDuration,
            colnames: opts.colnames,
            rownames: opts.rownames
        });
        var coordColors = [];
        var legendData;
        var rangeX;
        var rangeY;
        var rangeZ;
        this._hasAnim = opts.folded;
        if (opts.folded) {
            var replayBtn = document.createElement("div");
            replayBtn.className = "button";
            replayBtn.innerHTML = exports.buttonSVGs.replay;
            replayBtn.onclick = this._resetAnimation.bind(this);
            this._buttonBar.appendChild(replayBtn);
        }
        switch (colorBy) {
            case "categories":
                var groups = colorVar;
                var uniqueGroups = getUniqueVals(groups);
                uniqueGroups.sort();
                if (opts.sortedCategories) {
                    if (uniqueGroups.length === opts.sortedCategories.length) {
                        if (JSON.stringify(uniqueGroups) === JSON.stringify(opts.sortedCategories.slice(0).sort())) {
                            uniqueGroups = opts.sortedCategories;
                        }
                    }
                }
                var nColors = uniqueGroups.length;
                var colors = chroma_js_1.default.scale(chroma_js_1.default.brewer.Paired).mode('lch').colors(nColors);
                if (opts.colorScale === "custom") {
                    if (opts.customColorScale !== undefined && opts.customColorScale.length !== 0) {
                        if (opts.colorScaleInverted) {
                            colors = chroma_js_1.default.scale(opts.customColorScale).domain([1, 0]).mode('lch').colors(nColors);
                        }
                        else {
                            colors = chroma_js_1.default.scale(opts.customColorScale).mode('lch').colors(nColors);
                        }
                    }
                    else {
                        opts.colorScale = "Paired";
                    }
                }
                else {
                    if (opts.colorScale && chroma_js_1.default.brewer.hasOwnProperty(opts.colorScale)) {
                        if (opts.colorScaleInverted) {
                            colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[opts.colorScale]).domain([1, 0]).mode('lch').colors(nColors);
                        }
                        else {
                            colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[opts.colorScale]).mode('lch').colors(nColors);
                        }
                    }
                    else {
                        opts.colorScale = "Paired";
                    }
                }
                for (var i = 0; i < nColors; i++) {
                    colors[i] += "ff";
                }
                for (var i = 0; i < colorVar.length; i++) {
                    var colorIndex = uniqueGroups.indexOf(groups[i]);
                    coordColors.push(colors[colorIndex]);
                }
                legendData = {
                    showLegend: opts.showLegend,
                    discrete: true,
                    breaks: uniqueGroups,
                    colorScale: opts.colorScale,
                    customColorScale: opts.customColorScale,
                    inverted: false,
                    position: opts.legendPosition
                };
                break;
            case "values":
                var min_1 = colorVar.min();
                var max_1 = colorVar.max();
                var colorfunc_1 = chroma_js_1.default.scale(chroma_js_1.default.brewer.Oranges).mode('lch');
                if (opts.colorScale === "custom") {
                    if (opts.customColorScale !== undefined && opts.customColorScale.length !== 0) {
                        if (opts.colorScaleInverted) {
                            colorfunc_1 = chroma_js_1.default.scale(opts.customColorScale).domain([1, 0]).mode('lch');
                        }
                        else {
                            colorfunc_1 = chroma_js_1.default.scale(opts.customColorScale).mode('lch');
                        }
                    }
                    else {
                        opts.colorScale = "Oranges";
                    }
                }
                else {
                    if (opts.colorScale && chroma_js_1.default.brewer.hasOwnProperty(opts.colorScale)) {
                        if (opts.colorScaleInverted) {
                            colorfunc_1 = chroma_js_1.default.scale(chroma_js_1.default.brewer[opts.colorScale]).domain([1, 0]).mode('lch');
                        }
                        else {
                            colorfunc_1 = chroma_js_1.default.scale(chroma_js_1.default.brewer[opts.colorScale]).mode('lch');
                        }
                    }
                    else {
                        opts.colorScale = "Oranges";
                    }
                }
                var norm = colorVar.slice().map(function (v) { return (v - min_1) / (max_1 - min_1); });
                coordColors = norm.map(function (v) { return colorfunc_1(v).alpha(1).hex("rgba"); });
                legendData = {
                    showLegend: opts.showLegend,
                    discrete: false,
                    breaks: [min_1.toString(), max_1.toString()],
                    colorScale: opts.colorScale,
                    customColorScale: opts.customColorScale,
                    inverted: opts.colorScaleInverted,
                    position: opts.legendPosition
                };
                break;
            case "direct":
                for (var i = 0; i < colorVar.length; i++) {
                    var cl = colorVar[i];
                    cl = chroma_js_1.default(cl).hex();
                    if (cl.length == 7) {
                        cl += "ff";
                    }
                    coordColors.push(cl);
                }
                legendData = {
                    showLegend: false,
                    discrete: false,
                    breaks: [],
                    colorScale: "",
                    customColorScale: opts.customColorScale,
                    inverted: false,
                    position: opts.legendPosition
                };
                break;
        }
        legendData.fontSize = opts.fontSize;
        legendData.fontColor = opts.fontColor;
        legendData.legendTitle = opts.legendTitle;
        legendData.legendTitleFontSize = opts.legendTitleFontSize;
        var plot;
        var scale;
        switch (plotType) {
            case "pointCloud":
                plot = new PointCloud_1.PointCloud(this.scene, coordinates, coordColors, opts.size, legendData, opts.folded, opts.foldedEmbedding, opts.foldAnimDelay, opts.foldAnimDuration, this._xScale, this._yScale, this._zScale);
                var boundingBox = plot.mesh.getBoundingInfo().boundingBox;
                rangeX = [
                    boundingBox.minimumWorld.x,
                    boundingBox.maximumWorld.x
                ];
                rangeY = [
                    boundingBox.minimumWorld.y,
                    boundingBox.maximumWorld.y
                ];
                rangeZ = [
                    boundingBox.minimumWorld.z,
                    boundingBox.maximumWorld.z
                ];
                scale = [
                    this._xScale,
                    this._yScale,
                    this._zScale,
                ];
                break;
            case "surface":
                plot = new Surface_1.Surface(this.scene, coordinates, coordColors, opts.size, legendData, this._xScale, this._yScale, this._zScale);
                rangeX = [0, coordinates.length * this._xScale];
                rangeZ = [0, coordinates[0].length * this._zScale];
                rangeY = [
                    matrixMin(coordinates) * this._yScale,
                    matrixMax(coordinates) * this._yScale
                ];
                scale = [
                    this._xScale,
                    this._yScale,
                    this._zScale,
                ];
                break;
            case "heatMap":
                plot = new HeatMap_1.HeatMap(this.scene, coordinates, coordColors, opts.size, legendData, this._xScale, this._yScale, this._zScale);
                rangeX = [0, coordinates.length * this._xScale];
                rangeZ = [0, coordinates[0].length * this._zScale];
                rangeY = [
                    matrixMin(coordinates) * this._yScale,
                    matrixMax(coordinates) * this._yScale
                ];
                scale = [
                    this._xScale,
                    this._yScale,
                    this._zScale,
                ];
                break;
        }
        this.plots.push(plot);
        this._updateLegend();
        var axisData = {
            showAxes: opts.showAxes,
            static: true,
            axisLabels: opts.axisLabels,
            range: [rangeX, rangeY, rangeZ],
            color: opts.axisColors,
            scale: scale,
            tickBreaks: opts.tickBreaks,
            showTickLines: opts.showTickLines,
            tickLineColor: opts.tickLineColors,
            showPlanes: [false, false, false],
            planeColor: ["#cccccc88", "#cccccc88", "#cccccc88"],
            plotType: plotType,
            colnames: opts.colnames,
            rownames: opts.rownames
        };
        this._axes.push(new Axes_1.Axes(axisData, this.scene, plotType == "heatMap"));
        this._cameraFitPlot(rangeX, rangeY, rangeZ);
        return this;
    };
    Plots.prototype._updateLegend = function () {
        if (this._legend) {
            this._legend.dispose();
        }
        var uiLayer = advancedDynamicTexture_1.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var rightFree = true;
        var leftFree = true;
        for (var i = 0; i < this.plots.length; i++) {
            var plot = this.plots[i];
            var legendData = plot.legendData;
            if (["right", "left"].indexOf(legendData.position) === -1) {
                legendData.position = null;
            }
            if (legendData.showLegend) {
                if (legendData.position === null) {
                    if (rightFree) {
                        legendData.position = "right";
                        rightFree = false;
                    }
                    else if (leftFree) {
                        legendData.position = "left";
                        leftFree = false;
                    }
                    else {
                        legendData.showLegend = false;
                    }
                }
                else {
                    if (legendData.position === "right") {
                        rightFree = false;
                    }
                    else {
                        leftFree = false;
                    }
                }
                uiLayer = this._createPlotLegend(legendData, uiLayer);
            }
        }
        this._legend = uiLayer;
    };
    Plots.prototype._createPlotLegend = function (legendData, uiLayer) {
        if (!legendData.showLegend) {
            return uiLayer;
        }
        var n;
        var breakN = 20;
        var grid = new controls_1.Grid();
        uiLayer.addControl(grid);
        var legendWidth = 0.2;
        if (legendData.discrete) {
            n = legendData.breaks.length;
            if (n > breakN * 2) {
                legendWidth = 0.4;
            }
            else if (n > breakN) {
                legendWidth = 0.3;
            }
        }
        var legendColumn = 1;
        if (legendData.position === "right") {
            grid.addColumnDefinition(1 - legendWidth);
            grid.addColumnDefinition(legendWidth);
        }
        else {
            grid.addColumnDefinition(legendWidth);
            grid.addColumnDefinition(1 - legendWidth);
            legendColumn = 0;
        }
        if (legendData.legendTitle && legendData.legendTitle !== "") {
            grid.addRowDefinition(0.1);
            grid.addRowDefinition(0.85);
            grid.addRowDefinition(0.05);
        }
        else {
            grid.addRowDefinition(0.05);
            grid.addRowDefinition(0.9);
            grid.addRowDefinition(0.05);
        }
        if (legendData.legendTitle) {
            var legendTitle = new controls_1.TextBlock();
            legendTitle.text = legendData.legendTitle;
            legendTitle.color = legendData.fontColor;
            legendTitle.fontWeight = "bold";
            if (legendData.legendTitleFontSize) {
                legendTitle.fontSize = legendData.legendTitleFontSize + "px";
            }
            else {
                legendTitle.fontSize = "20px";
            }
            legendTitle.verticalAlignment = controls_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            legendTitle.horizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
            grid.addControl(legendTitle, 0, legendColumn);
        }
        if (!legendData.discrete) {
            var innerGrid_1 = new controls_1.Grid();
            innerGrid_1.addColumnDefinition(0.2);
            innerGrid_1.addColumnDefinition(0.8);
            grid.addControl(innerGrid_1, 1, legendColumn);
            var nBreaks = 115;
            var labelSpace = 0.15;
            if (this.canvas.height < 70) {
                nBreaks = 10;
                labelSpace = 0.45;
                innerGrid_1.addRowDefinition(1);
            }
            else if (this.canvas.height < 130) {
                nBreaks = 50;
                labelSpace = 0.3;
                innerGrid_1.addRowDefinition(1);
            }
            else {
                var padding = (this.canvas.height - 115) / 2;
                innerGrid_1.addRowDefinition(padding, true);
                innerGrid_1.addRowDefinition(115, true);
                innerGrid_1.addRowDefinition(padding, true);
            }
            var colors = void 0;
            if (legendData.colorScale === "custom") {
                colors = chroma_js_1.default.scale(legendData.customColorScale).mode('lch').colors(nBreaks);
            }
            else {
                colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[legendData.colorScale]).mode('lch').colors(nBreaks);
            }
            var scaleGrid = new controls_1.Grid();
            for (var i = 0; i < nBreaks; i++) {
                scaleGrid.addRowDefinition(1 / nBreaks);
                var legendColor_1 = new controls_1.Rectangle();
                if (legendData.inverted) {
                    legendColor_1.background = colors[i];
                }
                else {
                    legendColor_1.background = colors[colors.length - i - 1];
                }
                legendColor_1.thickness = 0;
                legendColor_1.width = 0.5;
                legendColor_1.height = 1;
                scaleGrid.addControl(legendColor_1, i, 0);
            }
            var labelGrid = new controls_1.Grid();
            labelGrid.addColumnDefinition(1);
            labelGrid.addRowDefinition(labelSpace);
            labelGrid.addRowDefinition(1 - labelSpace * 2);
            labelGrid.addRowDefinition(labelSpace);
            if (this.canvas.height < 130) {
                innerGrid_1.addControl(scaleGrid, 0, 0);
                innerGrid_1.addControl(labelGrid, 0, 1);
            }
            else {
                innerGrid_1.addControl(scaleGrid, 1, 0);
                innerGrid_1.addControl(labelGrid, 1, 1);
            }
            var minText = new controls_1.TextBlock();
            minText.text = parseFloat(legendData.breaks[0]).toFixed(2);
            minText.color = legendData.fontColor;
            minText.fontSize = legendData.fontSize + "px";
            minText.textHorizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
            labelGrid.addControl(minText, 2, 0);
            var maxText = new controls_1.TextBlock();
            maxText.text = parseFloat(legendData.breaks[1]).toFixed(2);
            maxText.color = legendData.fontColor;
            maxText.fontSize = legendData.fontSize + "px";
            maxText.textHorizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
            labelGrid.addControl(maxText, 0, 0);
        }
        else {
            var innerGrid = new controls_1.Grid();
            if (n > breakN * 2) {
                innerGrid.addColumnDefinition(0.1);
                innerGrid.addColumnDefinition(0.4);
                innerGrid.addColumnDefinition(0.1);
                innerGrid.addColumnDefinition(0.4);
                innerGrid.addColumnDefinition(0.1);
                innerGrid.addColumnDefinition(0.4);
            }
            else if (n > breakN) {
                innerGrid.addColumnDefinition(0.1);
                innerGrid.addColumnDefinition(0.4);
                innerGrid.addColumnDefinition(0.1);
                innerGrid.addColumnDefinition(0.4);
            }
            else {
                innerGrid.addColumnDefinition(0.2);
                innerGrid.addColumnDefinition(0.8);
            }
            for (var i = 0; i < n && i < breakN; i++) {
                if (n > breakN) {
                    innerGrid.addRowDefinition(1 / breakN);
                }
                else {
                    innerGrid.addRowDefinition(1 / n);
                }
            }
            grid.addControl(innerGrid, 1, legendColumn);
            var colors = void 0;
            if (legendData.colorScale === "custom") {
                colors = chroma_js_1.default.scale(legendData.customColorScale).mode('lch').colors(n);
            }
            else {
                colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[legendData.colorScale]).mode('lch').colors(n);
            }
            for (var i = 0; i < n; i++) {
                var legendColor = new controls_1.Rectangle();
                legendColor.background = colors[i];
                legendColor.thickness = 0;
                legendColor.width = legendData.fontSize + "px";
                legendColor.height = legendData.fontSize + "px";
                if (i > breakN * 2 - 1) {
                    innerGrid.addControl(legendColor, i - breakN * 2, 4);
                }
                else if (i > breakN - 1) {
                    innerGrid.addControl(legendColor, i - breakN, 2);
                }
                else {
                    innerGrid.addControl(legendColor, i, 0);
                }
                var legendText = new controls_1.TextBlock();
                legendText.text = legendData.breaks[i].toString();
                legendText.color = legendData.fontColor;
                legendText.fontSize = legendData.fontSize + "px";
                legendText.textHorizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
                if (i > breakN * 2 - 1) {
                    innerGrid.addControl(legendText, i - breakN * 2, 5);
                }
                if (i > breakN - 1) {
                    innerGrid.addControl(legendText, i - breakN, 3);
                }
                else {
                    innerGrid.addControl(legendText, i, 1);
                }
            }
        }
        return uiLayer;
    };
    Plots.prototype.doRender = function () {
        var _this = this;
        this._engine.runRenderLoop(function () {
            _this.scene.render();
        });
        return this;
    };
    Plots.prototype.resize = function (width, height) {
        if (width !== undefined && height !== undefined) {
            if (this.R) {
                var pad = parseInt(document.body.style.padding.substring(0, document.body.style.padding.length - 2));
                this.canvas.width = width - 2 * pad;
                this.canvas.height = height - 2 * pad;
            }
            else {
                this.canvas.width = width;
                this.canvas.height = height;
            }
        }
        this._updateLegend();
        this._resizePublishOverlay();
        this._engine.resize();
        return this;
    };
    Plots.prototype.thumbnail = function (size, saveCallback) {
        screenshotTools_1.ScreenshotTools.CreateScreenshot(this._engine, this.camera, size, saveCallback);
    };
    Plots.prototype.dispose = function () {
        this.scene.dispose();
        this._engine.dispose();
    };
    Plots.prototype.addLabels = function (labelList) {
        this._annotationManager.addLabels(labelList);
    };
    return Plots;
}());
exports.Plots = Plots;
//# sourceMappingURL=babyplots.js.map