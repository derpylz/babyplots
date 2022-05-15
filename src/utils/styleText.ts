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

export const styleText = [
    ".bbp.button-bar { position: absolute; z-index: 2; overflow: hidden; padding: 0 10px 4px 0; }",
    ".bbp.button-bar>.button.hidden { display: none; }",
    ".bbp.button-bar>.anim-slider { display: block; float: right; width: 150px; height: 30px }",
    ".bbp.button-bar>.anim-slider.hidden { display: none; }",
    ".bbp.button-bar>.button { float: right; width: 75px; height: 30px; cursor: pointer; border-radius: 2px; background-color: #f0f0f0; margin: 0 4px 0 0; transition: all 0.2s ease-in-out;}",
    ".bbp.button-bar>.button:hover { background-color: #ddd; }",
    ".bbp.button-bar>.button>svg { width: 75px; height: 30px; }",
    ".bbp.button-bar>.button.active { background-color: #e95420; }",
    ".bbp.button-bar>.button.active:hover { background-color: #b52f00; }",
    ".bbp.button-bar>.button.streamctrl.loading { cursor: progress; }",
    ".bbp.button-bar>.button.streamctrl.loading:hover { background-color: #f0f0f0; }",
    ".bbp.button-bar>.button.streamctrl.loading>.btn-label.play,.bbp.button-bar>.button.streamctrl.loading>.btn-label.pause {display: none; }",
    ".bbp.button-bar>.button.streamctrl.loading>.btn-label.loading {display: block; }",
    ".bbp.button-bar>.button.streamctrl.play>.btn-label.pause,.bbp.button-bar>.button.streamctrl.play>.btn-label.loading {display: none; }",
    ".bbp.button-bar>.button.streamctrl.play>.btn-label.play {display: block; }",
    ".bbp.button-bar>.button.streamctrl.pause>.btn-label.play,.bbp.button-bar>.button.streamctrl.pause>.btn-label.loading {display: none; }",
    ".bbp.button-bar>.button.streamctrl.pause>.btn-label.pause {display: block; }",
    ".bbp.label-control { position: absolute; z-index: 3; font-family: sans-serif; width: 200px; background-color: #f0f0f0; padding: 5px; border-radius: 2px; }",
    ".bbp.label-control>label { font-size: 11pt; }",
    ".bbp.label-control>.edit-container { overflow: auto; }",
    ".bbp.label-control>.edit-container>.label-form { margin-top: 5px; padding-top: 20px; border-top: solid thin #ccc; }",
    ".bbp.label-control .label-form>input { width: 100%; box-sizing: border-box; }",
    ".bbp.label-control .label-form>button { border: none; font-weight: bold; background-color: white; padding: 5px 10px; margin: 5px 0 2px 0; width: 100%; cursor: pointer; }",
    ".bbp.label-control .label-form>button:hover { background-color: #ddd; }",
    ".bbp.overlay { position: absolute; z-index: 3; overflow: hidden; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; background-color: #fff5; display: flex; justify-content: center; align-items: center;}",
    ".bbp.overlay>h5.loading-message { color: #000; font-family: Verdana, sans-serif;}",
    ".bbp.publish-form>label { display: block; text-align: left; font-family: Verdana, sans-serif; }",
    ".bbp.publish-form>input { width: 100%; margin-bottom: 15px; box-sizing: border-box; }",
    ".bbp.publish-form>.publish-btn { border: none; font-weight: bold; background-color: #e95420; color: white; padding: 5px 10px; margin: 5px 0 2px 0; width: 100%; cursor: pointer; }",
    ".bbp.publish-form>.publish-btn:hover { background-color: #ca491a }",
    ".bbp.publish-form>.close-btn, .bbp.publish-form>.cancel-btn { border: none; font-weight: bold; background-color: white; padding: 5px 10px; margin: 5px 0 2px 0; width: 100%; cursor: pointer; }",
    ".bbp.publish-form>.close-btn:hover, .bbp.publish-form>.cancel-btn:hover { background-color: #ddd }",
    ".bbp.publish-form>p.form-info { font-size: 8pt; font-family: Verdana, sans-serif; }",
    ".bbp.publish-form>p.message { font-size: 10pt; font-family: Verdana, sans-serif; }",
    ".bbp.publish-form>p.message.warning { color: red; margin-top: 0px; }",
    ".bbp.publish-form>p.message.success { color: green; }",
].join(" ");
