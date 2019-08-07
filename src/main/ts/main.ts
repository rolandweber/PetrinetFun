/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

import { LayoutStructure as GridLayoutStructure } from "./grid"
import { LayoutStructure as FloatLayoutStructure } from "./float"
import { Dossier } from "./dossier"
import { SVGRenderer, marking } from "./svgdom"
export { marking, highlight } from "./svgdom"


export function renderStructureSVG(svgid: string,
                                   structure: GridLayoutStructure)
{
    const layout = new FloatLayoutStructure(structure);
    const renderer = new SVGRenderer(layout, svgid);
    renderer.renderStructure();
}


export function renderDossierSVG(svgid: string,
                                 dossier: Dossier)
{
    const renderer = new SVGRenderer(dossier.getFloatLayout(), svgid);
    renderer.renderStructure();
    marking(svgid, dossier.getDefaultMarking().marking);
}
