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

export interface Transition extends Position {
    id: string;
    style: TransitionStyle;
}


export enum ArcType {
    Input = "i",
    Output = "o",
    // Read = "r", Inhibit = "h",... 
}

export interface Arc {
    transition: Transition;
    place: Place;
    arctype: ArcType;
    stopover: Array<Position>;
}


export class LayoutStructure {
    places: Map<string, Place> = new Map();
    transitions: Map<string, Transition> = new Map();
    arcs: Array<Arc> = [];


    protected determineID(id: string | undefined, fallback: string): string {
        if (id) {
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
            transition: transition,
            place: place,
            arctype: arctype,
            stopover: stopover
        }
        this.arcs.push(arc);
        return arc;
    }

}
