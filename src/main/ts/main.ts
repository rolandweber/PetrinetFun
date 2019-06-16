/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

/// <reference path="grid.ts" />
/// <reference path="float.ts" />
/// <reference path="svgdom.ts" />

function renderStructureSVG(svgid: string,
                            structure: GridLayoutStructure)
{
    const layout = new FloatLayoutStructure(structure);
    const renderer = new SVGRenderer(layout, svgid);
    renderer.renderStructure();
}

