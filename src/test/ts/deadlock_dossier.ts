/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

import { Dossier, MarkingOfInterest, AreaOfInterest, AreaArcs } from "dossier"
import { LayoutStructure as GridLayoutStructure,
         Horizontal, Vertical, Input, Output } from "grid"

export function createDossier_Deadlock(): Dossier {

    let dossier = new Dossier(createGrid_Deadlock())

    let marking = new Map();
    marking.set("P0", "n");
    marking.set("P3", "m");
    marking.set("P6", 1);
    marking.set("P7", 1);
    dossier.addMarking("variable", marking);

    marking = new Map();
    marking.set("P0", 1);
    marking.set("P3", 1);
    marking.set("P6", 1);
    marking.set("P7", 1);
    dossier.addMarking("minimal", marking);

    marking = new Map();
    marking.set("P1", 1);
    marking.set("P3", 1);
    marking.set("P6", 1);
    marking.set("P7", 0);
    dossier.addMarking("half dead", marking);

    marking = new Map();
    marking.set("P2", 1);
    marking.set("P3", 1);
    marking.set("P6", 0);
    marking.set("P7", 0);
    dossier.addMarking("survived", marking);

    marking = new Map();
    marking.set("P1", 1);
    marking.set("P4", 1);
    dossier.addMarking("dead", marking);


    let area = ["P0", "P1", "P2", "T0", "T1", "T2"];
    dossier.addArea("Process Left", area, AreaArcs.Connecting);

    area = ["P3", "P4", "P5", "T3", "T4", "T5"];
    dossier.addArea("Process Right", area, AreaArcs.Connecting);

    area = ["P6", "P2", "P4", "P5"];
    dossier.addArea("PI: Mutex Left", area, AreaArcs.Touching);

    area = ["P7", "P1", "P2", "P5"];
    dossier.addArea("PI: Mutex Right", area, AreaArcs.Touching);

    area = ["T0", "T1", "T2"];
    dossier.addArea("TI: Process Left", area, AreaArcs.Touching);

    area = ["T3", "T4", "T5"];
    dossier.addArea("TI: Process Right", area, AreaArcs.Touching);

    area = ["P0", "P1", "P2"];
    dossier.addArea("PI: Process Left", area, AreaArcs.Touching);

    area = ["P3", "P4", "P5"];
    dossier.addArea("PI: Process Right", area, AreaArcs.Touching);

    return dossier;
}


function createGrid_Deadlock() {
    let structure = new GridLayoutStructure()

    const p0 = structure.addPlace(0, 0);
    const p1 = structure.addPlace(2, 2);
    const p2 = structure.addPlace(2, 8);
    const p3 = structure.addPlace(12, 0);
    const p4 = structure.addPlace(10, 2);
    const p5 = structure.addPlace(10, 8);
    const p6 = structure.addPlace(4, 4);
    const p7 = structure.addPlace(8, 4);

    const t0 = structure.addTransition(2, 0, Horizontal);
    const t1 = structure.addTransition(2, 4, Horizontal);
    const t2 = structure.addTransition(0, 6, Vertical);
    const t3 = structure.addTransition(10, 0, Horizontal);
    const t4 = structure.addTransition(10, 4, Horizontal);
    const t5 = structure.addTransition(12, 6, Vertical);

    structure.addArc(t0, p0, Input);
    structure.addArc(t0, p7, Input);
    structure.addArc(t0, p1, Output);
    structure.addArc(t1, p1, Input);
    structure.addArc(t1, p6, Input);
    structure.addArc(t1, p2, Output);
    structure.addArc(t2, p2, Input, [
        { gridX: 0, gridY: 8 }
    ]);
    structure.addArc(t2, p6, Output);
    structure.addArc(t2, p7, Output, [
        { gridX: 4, gridY: 6 }
    ]);
    structure.addArc(t2, p0, Output);

    structure.addArc(t3, p3, Input);
    structure.addArc(t3, p6, Input);
    structure.addArc(t3, p4, Output);
    structure.addArc(t4, p4, Input);
    structure.addArc(t4, p7, Input);
    structure.addArc(t4, p5, Output);
    structure.addArc(t5, p5, Input, [
        { gridX: 12, gridY: 8 }
    ]);
    structure.addArc(t5, p6, Output, [
        { gridX: 8, gridY: 6 }
    ]);
    structure.addArc(t5, p7, Output);
    structure.addArc(t5, p3, Output);

    return structure;
}
