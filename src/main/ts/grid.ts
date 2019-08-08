/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

// =============================================================================
// Grid layout: grid coordinates
// =============================================================================


export interface Position {
    gridX: number;
    gridY: number;
}

export interface Place extends Position {
    id: string;
}

export enum TransitionStyle {
    Horizontal = "h",
    Vertical = "v",
    Square = "q",
}
export const Horizontal = TransitionStyle.Horizontal;
export const Vertical = TransitionStyle.Vertical;
export const Square = TransitionStyle.Square;

export interface Transition extends Position {
    id: string;
    style: TransitionStyle;
}


export enum ArcType {
    Input = "i",
    Output = "o",
    // Read = "r", Inhibit = "h",... 
}
export const Input = ArcType.Input;
export const Output = ArcType.Output;

export interface Arc {
    id: string;
    transition: Transition;
    place: Place;
    arctype: ArcType;
    stopover: Array<Position>;
}


export class LayoutStructure {
    places: Map<string, Place> = new Map();
    transitions: Map<string, Transition> = new Map();
    arcs: Map<string, Arc> = new Map();


    protected determineID(id: string | undefined, fallback: string): string {
        if (id) {
            if (id.indexOf('$') >= 0) {
                throw new Error("Reserved character '$' in ID '"+id+"'.");
            }
            if (this.places.has(id) || this.transitions.has(id)) {
                throw new Error("ID '"+id+"' already in use.");
            }
            return id;
        }

        // generate a unique ID from the fallback
        let result = fallback;
        while (this.places.has(result) || this.transitions.has(result)) {
            result += "_" + Math.floor(Math.random()*1000);
        }
        return result;
    }

    protected composeArcID(transition: Transition,
                           place: Place,
                           arctype: ArcType) : string {
        return transition.id + "$" + arctype + "$" + place.id;
    }


    addPlace(x: number, y: number, id?: string): Place {
        let place = {
            id: this.determineID(id, 'P'+this.places.size),
            gridX: x, gridY: y
        }
        this.places.set(place.id, place);
        return place;
    }


    addTransition(x: number, y: number,
                  style: TransitionStyle = TransitionStyle.Square,
                  id?: string)
    : Transition {

        let transition = {
            id: this.determineID(id, 'T'+this.transitions.size),
            gridX: x, gridY: y, style: style
        }
        this.transitions.set(transition.id, transition);
        return transition;
    }


    addArc(transition: Transition,
           place: Place,
           arctype: ArcType,
           stopover: Array<Position> = []) : Arc
    {
        let arc = {
            id: this.composeArcID(transition, place, arctype),
            transition: transition,
            place: place,
            arctype: arctype,
            stopover: stopover
        }
        this.arcs.set(arc.id, arc);
        return arc;
    }


    protected pickRelatedArcIDs(nodeIDs: Array<string>,
                                connecting: boolean) : Set<string> {
        // if 'connecting' is true, both ends of an arc must be in nodeIDs
        // if 'connecting' is false, just one end is sufficient

        let nodeset = new Set<string>(nodeIDs);
        let arcset = new Set<string>();

        for (let arc of this.arcs.values()) {
            const hasT = nodeset.has(arc.transition.id);
            const hasP = nodeset.has(arc.place.id);
            if ((hasT && hasP) || (!connecting && (hasT || hasP))) {
                arcset.add(arc.id);
            }
        }
        return arcset;
    }

    getConnectingArcIDs(nodeIDs: Array<string>) : Set<string> {
        return this.pickRelatedArcIDs(nodeIDs, true);
    }

    getTouchingArcIDs(nodeIDs: Array<string>) : Set<string> {
        return this.pickRelatedArcIDs(nodeIDs, false);
    }

}
