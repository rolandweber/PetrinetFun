/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

import { LayoutStructure as GridLayoutStructure } from "grid"
import { ArcType, TransitionStyle } from "grid"


const center =  [3,3]
const border = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
                [0,1],                              [6,1],
                [0,2],                              [6,2],
                [0,3],                              [6,3],
                [0,4],                              [6,4],
                [0,5],                              [6,5],
                [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6]]

// The structure will have input arcs and output arcs alternating by index.
// From the top and bottom, arcs will alternate.
// From the sides, one has only input arcs, the other only output arcs.



export function generator_place() {
    return generatePlaceArcs;
}

export function generator_transition(ts: TransitionStyle) {
    return function(structure: GridLayoutStructure) {
        return generateTransitionArcs(structure, ts);
    }
}


function generatePlaceArcs(structure: GridLayoutStructure) {

    const p = structure.addPlace(center[0], center[1]);

    let i = 0;
    for (let [x, y] of border) {
        let ts: TransitionStyle;
        if (x == y || x == 6-y) {
            ts = TransitionStyle.Square;
        } else if (x == 0 || x == 6) {
            ts = TransitionStyle.Vertical;
        } else {
            ts = TransitionStyle.Horizontal;
        }

        const at = (i % 2) ? ArcType.Input : ArcType.Output;
        const t = structure.addTransition(x, y, ts);
        structure.addArc(t, p, at);

        i++;
    }

    let marking = new Map();
    // irrelevant
    return marking;
}


function generateTransitionArcs(structure: GridLayoutStructure,
                                tstyle: TransitionStyle | undefined) {

    const t = structure.addTransition(center[0], center[1], tstyle);

    let i = 0;
    for (let [x, y] of border) {
        const at = (i % 2) ? ArcType.Input : ArcType.Output;
        const p = structure.addPlace(x, y);
        structure.addArc(t, p, at);

        i++;
    }

    let marking = new Map();
    // irrelevant
    return marking;
}
