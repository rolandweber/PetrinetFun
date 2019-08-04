/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

import * as grid from "grid"


export function exampleClientServer(structure: grid.LayoutStructure) {

    const p0 = structure.addPlace(2, 0);
    const p1 = structure.addPlace(2, 4);
    const p2 = structure.addPlace(2, 8);
    const p3 = structure.addPlace(10, 0);
    const p4 = structure.addPlace(10, 4);
    const p5 = structure.addPlace(10, 8);
    const p6 = structure.addPlace(6, 2);
    const p7 = structure.addPlace(6, 6);

    const t0 = structure.addTransition(2, 2, grid.TransitionStyle.Horizontal);
    const t1 = structure.addTransition(2, 6, grid.TransitionStyle.Horizontal);
    const t2 = structure.addTransition(0, 4, grid.TransitionStyle.Vertical);
    const t3 = structure.addTransition(10, 2, grid.TransitionStyle.Horizontal);
    const t4 = structure.addTransition(10, 6, grid.TransitionStyle.Horizontal);
    const t5 = structure.addTransition(12, 4, grid.TransitionStyle.Vertical);

    structure.addArc(t0, p0, grid.ArcType.Input);
    structure.addArc(t0, p1, grid.ArcType.Output);
    structure.addArc(t0, p6, grid.ArcType.Output);
    structure.addArc(t1, p1, grid.ArcType.Input);
    structure.addArc(t1, p7, grid.ArcType.Input);
    structure.addArc(t1, p2, grid.ArcType.Output);
    structure.addArc(t2, p2, grid.ArcType.Input, [
        { gridX: 0, gridY: 8 }
    ]);
    structure.addArc(t2, p0, grid.ArcType.Output, [
        { gridX: 0, gridY: 0 }
    ]);

    structure.addArc(t3, p3, grid.ArcType.Input);
    structure.addArc(t3, p6, grid.ArcType.Input);
    structure.addArc(t3, p4, grid.ArcType.Output);
    structure.addArc(t4, p4, grid.ArcType.Input);
    structure.addArc(t4, p5, grid.ArcType.Output);
    structure.addArc(t4, p7, grid.ArcType.Output);
    structure.addArc(t5, p5, grid.ArcType.Input, [
        { gridX: 12, gridY: 8 }
    ]);
    structure.addArc(t5, p3, grid.ArcType.Output, [
        { gridX: 12, gridY: 0 }
    ]);

    let marking = new Map();
    marking.set("P0", "n");
    marking.set("P3", "m");
    return marking;
}


export function exampleDeadlock(structure: grid.LayoutStructure) {

    const p0 = structure.addPlace(0, 0);
    const p1 = structure.addPlace(2, 2);
    const p2 = structure.addPlace(2, 8);
    const p3 = structure.addPlace(12, 0);
    const p4 = structure.addPlace(10, 2);
    const p5 = structure.addPlace(10, 8);
    const p6 = structure.addPlace(4, 4);
    const p7 = structure.addPlace(8, 4);

    const t0 = structure.addTransition(2, 0, grid.TransitionStyle.Horizontal);
    const t1 = structure.addTransition(2, 4, grid.TransitionStyle.Horizontal);
    const t2 = structure.addTransition(0, 6, grid.TransitionStyle.Vertical);
    const t3 = structure.addTransition(10, 0, grid.TransitionStyle.Horizontal);
    const t4 = structure.addTransition(10, 4, grid.TransitionStyle.Horizontal);
    const t5 = structure.addTransition(12, 6, grid.TransitionStyle.Vertical);

    structure.addArc(t0, p0, grid.ArcType.Input);
    structure.addArc(t0, p7, grid.ArcType.Input);
    structure.addArc(t0, p1, grid.ArcType.Output);
    structure.addArc(t1, p1, grid.ArcType.Input);
    structure.addArc(t1, p6, grid.ArcType.Input);
    structure.addArc(t1, p2, grid.ArcType.Output);
    structure.addArc(t2, p2, grid.ArcType.Input, [
        { gridX: 0, gridY: 8 }
    ]);
    structure.addArc(t2, p6, grid.ArcType.Output);
    structure.addArc(t2, p7, grid.ArcType.Output, [
        { gridX: 4, gridY: 6 }
    ]);
    structure.addArc(t2, p0, grid.ArcType.Output);

    structure.addArc(t3, p3, grid.ArcType.Input);
    structure.addArc(t3, p6, grid.ArcType.Input);
    structure.addArc(t3, p4, grid.ArcType.Output);
    structure.addArc(t4, p4, grid.ArcType.Input);
    structure.addArc(t4, p7, grid.ArcType.Input);
    structure.addArc(t4, p5, grid.ArcType.Output);
    structure.addArc(t5, p5, grid.ArcType.Input, [
        { gridX: 12, gridY: 8 }
    ]);
    structure.addArc(t5, p6, grid.ArcType.Output, [
        { gridX: 8, gridY: 6 }
    ]);
    structure.addArc(t5, p7, grid.ArcType.Output);
    structure.addArc(t5, p3, grid.ArcType.Output);

    let marking = new Map();
    marking.set("P0", "n");
    marking.set("P3", "m");
    marking.set("P6", 1);
    marking.set("P7", 1);
    return marking;
}


export function exampleIntroductory(structure: grid.LayoutStructure) {

    const p0 = structure.addPlace(5, 0);
    const p1 = structure.addPlace(0, 3);
    const p2 = structure.addPlace(2, 3);
    const p3 = structure.addPlace(8, 3);
    const p4 = structure.addPlace(10, 3);
    const p5 = structure.addPlace(7, 4);

    const t0 = structure.addTransition(2, 0, grid.TransitionStyle.Horizontal);
    const t1 = structure.addTransition(2, 6, grid.TransitionStyle.Horizontal);
    const t2 = structure.addTransition(8, 0, grid.TransitionStyle.Horizontal);
    const t3 = structure.addTransition(8, 6, grid.TransitionStyle.Horizontal);

    structure.addArc(t0, p0, grid.ArcType.Input);
    structure.addArc(t0, p1, grid.ArcType.Input, [
        { gridX: 0, gridY: 0 }
    ]);
    structure.addArc(t0, p2, grid.ArcType.Output);
    structure.addArc(t1, p2, grid.ArcType.Input);
    structure.addArc(t1, p0, grid.ArcType.Output, [
        { gridX: 4, gridY: 6 }
    ]);
    structure.addArc(t1, p1, grid.ArcType.Output, [
        { gridX: 0, gridY: 6 }
    ]);
    structure.addArc(t1, p5, grid.ArcType.Output);

    structure.addArc(t2, p0, grid.ArcType.Input);
    structure.addArc(t2, p4, grid.ArcType.Input, [
        { gridX: 10, gridY: 0 }
    ]);
    structure.addArc(t2, p5, grid.ArcType.Input);
    structure.addArc(t2, p3, grid.ArcType.Output);
    structure.addArc(t3, p3, grid.ArcType.Input);
    structure.addArc(t3, p0, grid.ArcType.Output, [
        { gridX: 6, gridY: 6 }
    ]);
    structure.addArc(t3, p4, grid.ArcType.Output, [
        { gridX: 10, gridY: 6 }
    ]);

    let marking = new Map();
    marking.set("P0", "k");
    marking.set("P1", "n");
    marking.set("P4", "m");
    return marking;
}
