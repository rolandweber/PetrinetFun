/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

import { LayoutStructure as GridLayoutStructure,
         Horizontal, Vertical, Input, Output } from "grid"


export function exampleIntroductory(structure: GridLayoutStructure) {

    const p0 = structure.addPlace(5, 0);
    const p1 = structure.addPlace(0, 3);
    const p2 = structure.addPlace(2, 3);
    const p3 = structure.addPlace(8, 3);
    const p4 = structure.addPlace(10, 3);
    const p5 = structure.addPlace(7, 4);

    const t0 = structure.addTransition(2, 0, Horizontal);
    const t1 = structure.addTransition(2, 6, Horizontal);
    const t2 = structure.addTransition(8, 0, Horizontal);
    const t3 = structure.addTransition(8, 6, Horizontal);

    structure.addArc(t0, p0, Input);
    structure.addArc(t0, p1, Input, [
        { gridX: 0, gridY: 0 }
    ]);
    structure.addArc(t0, p2, Output);
    structure.addArc(t1, p2, Input);
    structure.addArc(t1, p0, Output, [
        { gridX: 4, gridY: 6 }
    ]);
    structure.addArc(t1, p1, Output, [
        { gridX: 0, gridY: 6 }
    ]);
    structure.addArc(t1, p5, Output);

    structure.addArc(t2, p0, Input);
    structure.addArc(t2, p4, Input, [
        { gridX: 10, gridY: 0 }
    ]);
    structure.addArc(t2, p5, Input);
    structure.addArc(t2, p3, Output);
    structure.addArc(t3, p3, Input);
    structure.addArc(t3, p0, Output, [
        { gridX: 6, gridY: 6 }
    ]);
    structure.addArc(t3, p4, Output, [
        { gridX: 10, gridY: 6 }
    ]);

    let marking = new Map();
    marking.set("P0", "k");
    marking.set("P1", "n");
    marking.set("P4", "m");
    return marking;
}
