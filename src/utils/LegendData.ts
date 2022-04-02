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

export interface ShapeLegendData {
    title: string;
    spacing: number;
    shapes: string[][];
}

/**
 * Per plot legend information.
 */
export interface LegendData {
    /** Show or hide plot legend. */
    showLegend: boolean;
    /** Discrete or continuous color scale. */
    discrete: boolean;
    /** Categories if discrete, min and max values if continuous color scale. */
    breaks: string[];
    /** Name of the color scale. */
    colorScale: string;
    /** Is the color scale flipped? */
    inverted: boolean;
    /** Left or right position of this legend. If undefined, right is default. */
    position: string;
    /** Display shape/plot type in legend */
    showShape?: boolean;
    /** If color scale is not a colorbrewer palette, provide colors to construct the palette here. */
    customColorScale?: string[];
    /** Font size of the legend text. */
    fontSize?: number;
    /** Color of the legend text. */
    fontColor?: string;
    /** Title for the color legend. */
    legendTitle?: string;
    /** Font size of the color legend title. */
    legendTitleFontSize?: number;
    /** Color of the color legend title. */
    legendTitleFontColor?: string;
}