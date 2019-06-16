/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

// =============================================================================
// Grid layout: grid coordinates
// =============================================================================


interface GridPosition {
    gridX: number;
    gridY: number;
}

interface GridPlace extends GridPosition {
}

enum GridTransitionStyle {
    Horizontal = "h",
    Vertical = "v",
    Square = "q",
}

interface GridTransition extends GridPosition {
    style: GridTransitionStyle;
}


enum GridArcType {
    Input = "i",
    Output = "o",
    // Read = "r", Inhibit = "h",... 
}

interface GridArc {
    transition: GridTransition;
    place: GridPlace;
    arctype: GridArcType;
    stopover: Array<GridPosition>;
}


class GridLayoutStructure {
    places: Array<GridPlace> = [];
    transitions: Array<GridTransition> = [];
    arcs: Array<GridArc> = [];


    addPlace(x: number, y: number): GridPlace {
        let place = {
            gridX: x, gridY: y
        }
        this.places.push(place);
        return place;
    }


    addTransition(x: number, y: number,
                  style: GridTransitionStyle = GridTransitionStyle.Square)
    : GridTransition {

        let transition = {
            gridX: x, gridY: y, style: style
        }
        this.transitions.push(transition);
        return transition;
    }


    addArc(transition: GridTransition,
           place: GridPlace,
           arctype: GridArcType,
           stopover: Array<GridPosition> = []) : GridArc
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
