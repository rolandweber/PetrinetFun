/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

import * as grid from "grid"


export function exampleMarkings(structure: grid.LayoutStructure) {

    structure.addPlace(1, 0);
    structure.addPlace(3, 0);
    structure.addPlace(5, 0);
    structure.addPlace(7, 0);
    structure.addPlace(9, 0);
    structure.addPlace(11, 0);

    structure.addPlace(1, 2);
    structure.addPlace(3, 2);
    structure.addPlace(5, 2);
    structure.addPlace(7, 2);
    structure.addPlace(9, 2);
    structure.addPlace(11, 2);

    structure.addPlace(1, 4);
    structure.addPlace(3, 4);
    structure.addPlace(5, 4);
    structure.addPlace(7, 4);
    structure.addPlace(9, 4);
    structure.addPlace(11, 4);

    structure.addPlace(1, 6);
    structure.addPlace(3, 6);
    structure.addPlace(5, 6);
    structure.addPlace(7, 6);
    structure.addPlace(9, 6);
    structure.addPlace(11, 6);

    structure.addPlace(1, 8);
    structure.addPlace(3, 8);
    structure.addPlace(5, 8);
    structure.addPlace(7, 8);
    structure.addPlace(9, 8);
    structure.addPlace(11, 8);

    // "P0"..."P29"

    let marking = new Map();
    marking.set("P0", 0);
    marking.set("P1", 1);
    marking.set("P2", 2);
    marking.set("P3", 3);
    marking.set("P4", 4);
    marking.set("P5", 5);

    marking.set("P6", 6);
    marking.set("P7", 7);
    marking.set("P8", 8);
    marking.set("P9", 9);
    marking.set("P10", 10);
    marking.set("P11", 11);

    marking.set("P12", "n");
    marking.set("P13", "p");
    marking.set("P14", "l");
    marking.set("P15", "m");
    marking.set("P16", "j");
    marking.set("P17", "k");

    marking.set("P18", ""); // empty string
    marking.set("P19", "nj");
    marking.set("P20", "x1");
    marking.set("P21", "mm");
    marking.set("P22", "iji");
    marking.set("P23", "M");


    // marking.set("P24", 0); // remains unset

    marking.set("P28", 75);
    marking.set("P29", 99);

    return marking;
}


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
