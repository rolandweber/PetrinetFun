/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

import { LayoutStructure as GridLayoutStructure } from "./grid"
import { LayoutStructure as FloatLayoutStructure } from "./float"


export interface MarkingOfInterest {
    name: string;
    //@@@ displayName, description?
    marking: Map<string,string|number> // place ID -> number of tokens
}


export interface AreaOfInterest {
    name: string;
    //@@@ displayName, description?
    ids: Array<string> // IDs of places, transitions, arcs
}



export class Dossier {
    grid_layout: GridLayoutStructure;
    float_layout: FloatLayoutStructure | null = null;
    marking_list: Array<MarkingOfInterest> = new Array();
    area_list: Array<AreaOfInterest> = new Array();


    constructor(gls: GridLayoutStructure) {
        this.grid_layout = gls;
    }


    getFloatLayout(): FloatLayoutStructure {
        if (!this.float_layout) {
            this.float_layout = new FloatLayoutStructure(this.grid_layout);
        }
        return this.float_layout;
    }

    getDefaultMarking(): MarkingOfInterest {
        if (this.marking_list.length) {
            return this.marking_list[0];
        }
        // generate an empty marking as default
        return { name: "empty", marking: new Map() }
    }


    addMarking(name: string, marking: Map<string,string|number>) {
        this.marking_list.push({ name: name, marking: marking });
    }

}

