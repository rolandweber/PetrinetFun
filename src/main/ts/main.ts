/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

import { LayoutStructure as GridLayoutStructure } from "./grid"
import { LayoutStructure as FloatLayoutStructure } from "./float"
import { SVGRenderer } from "./svgdom"


export function renderStructureSVG(svgid: string,
                                   structure: GridLayoutStructure)
{
    const layout = new FloatLayoutStructure(structure);
    const renderer = new SVGRenderer(layout, svgid);
    renderer.renderStructure();
}

