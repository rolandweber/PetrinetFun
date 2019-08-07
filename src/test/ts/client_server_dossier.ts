/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

import { Dossier, MarkingOfInterest, AreaOfInterest } from "dossier"
import { LayoutStructure as GridLayoutStructure,
         Horizontal, Vertical, Input, Output } from "grid"

export function createDossier_ClientServer(): Dossier {

    let dossier = new Dossier(createGrid_ClientServer())

    let marking = new Map();
    marking.set("P0", 8);
    marking.set("P3", 3);
    dossier.addMarking("numeric", marking);

    marking = new Map();
    marking.set("P0", "n");
    marking.set("P3", "m");
    dossier.addMarking("variable", marking)

    return dossier;
}



function createGrid_ClientServer() {
    let structure = new GridLayoutStructure()

    const p0 = structure.addPlace(2, 0);
    const p1 = structure.addPlace(2, 4);
    const p2 = structure.addPlace(2, 8);
    const p3 = structure.addPlace(10, 0);
    const p4 = structure.addPlace(10, 4);
    const p5 = structure.addPlace(10, 8);
    const p6 = structure.addPlace(6, 2);
    const p7 = structure.addPlace(6, 6);

    const t0 = structure.addTransition(2, 2, Horizontal);
    const t1 = structure.addTransition(2, 6, Horizontal);
    const t2 = structure.addTransition(0, 4, Vertical);
    const t3 = structure.addTransition(10, 2, Horizontal);
    const t4 = structure.addTransition(10, 6, Horizontal);
    const t5 = structure.addTransition(12, 4, Vertical);

    structure.addArc(t0, p0, Input);
    structure.addArc(t0, p1, Output);
    structure.addArc(t0, p6, Output);
    structure.addArc(t1, p1, Input);
    structure.addArc(t1, p7, Input);
    structure.addArc(t1, p2, Output);
    structure.addArc(t2, p2, Input, [
        { gridX: 0, gridY: 8 }
    ]);
    structure.addArc(t2, p0, Output, [
        { gridX: 0, gridY: 0 }
    ]);

    structure.addArc(t3, p3, Input);
    structure.addArc(t3, p6, Input);
    structure.addArc(t3, p4, Output);
    structure.addArc(t4, p4, Input);
    structure.addArc(t4, p5, Output);
    structure.addArc(t4, p7, Output);
    structure.addArc(t5, p5, Input, [
        { gridX: 12, gridY: 8 }
    ]);
    structure.addArc(t5, p3, Output, [
        { gridX: 12, gridY: 0 }
    ]);

    return structure;
}
