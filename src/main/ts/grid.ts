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
}

export enum TransitionStyle {
    Horizontal = "h",
    Vertical = "v",
    Square = "q",
}

export interface Transition extends Position {
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
    places: Array<Place> = [];
    transitions: Array<Transition> = [];
    arcs: Array<Arc> = [];


    addPlace(x: number, y: number): Place {
        let place = {
            gridX: x, gridY: y
        }
        this.places.push(place);
        return place;
    }


    addTransition(x: number, y: number,
                  style: TransitionStyle = TransitionStyle.Square)
    : Transition {

        let transition = {
            gridX: x, gridY: y, style: style
        }
        this.transitions.push(transition);
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
