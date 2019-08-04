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

