/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

import * as grid from "./grid"

// =============================================================================
// floating layout: point coordinates, with SVG in mind
// =============================================================================


export interface Place {
    posX: number;
    posY: number;
    radius: number;
}

export interface Transition {
    posX: number;
    posY: number;
    deltaX: number;
    deltaY: number;
}

export interface Arc {
    // transition: Transition;
    // place: Place;
    coordinates: Array<number>; // alternating x and y
    arrowT: boolean;
    arrowP: boolean;
}


export class LayoutStructure {
    protected readonly step = 60;

    places: Map<string, Place> = new Map();
    transitions: Map<string, Transition> = new Map();
    arcs: Array<Arc>;

    constructor(structure: grid.LayoutStructure) {
        this.positionPlaces(structure.places);
        this.positionTransitions(structure.transitions);
        this.positionArcs(structure.arcs);
    }


    getPlace(id: string): Place {
        const result = this.places.get(id);
        if (!result) {
            throw new Error("No place with ID '"+id+"'.");
        }
        return result;
    }


    getTransition(id: string): Transition {
        const result = this.transitions.get(id);
        if (!result) {
            throw new Error("No transition with ID '"+id+"'.");
        }
        return result;
    }


    protected x2pos(gridX: number) : number {
        return (gridX+0.5) * this.step;
    }

    protected y2pos(gridY: number) : number {
        return (gridY+0.5) * this.step;
    }


    protected positionPlaces(gplaces: Map<string, grid.Place>) : void {
        gplaces.forEach(function(gp, id) {
            this.places.set(id, {
                posX: this.x2pos(gp.gridX),
                posY: this.y2pos(gp.gridY),
                radius: 0.4 * this.step
            })
        }, this);
    }


    protected positionTransitions(gtransitions: Map<string, grid.Transition>
                                 ) : void {
        gtransitions.forEach(function(gt, id) {
            let dx: number, dy: number; // half of width, half of height
            switch (gt.style) {
                case grid.TransitionStyle.Horizontal: {
                    dx = 0.45 * this.step;
                    dy = 0.15 * this.step;
                    break;
                }
                case grid.TransitionStyle.Vertical: {
                    dx = 0.15 * this.step;
                    dy = 0.45 * this.step;
                    break;
                }
                case grid.TransitionStyle.Square: {
                    dx = 0.3 * this.step;
                    dy = 0.3 * this.step;
                    break;
                }
                default: {
                    // something visible but ugly
                    dx = 0.1 * this.step;
                    dy = 0.1 * this.step;
                    break;
                }
            }

            this.transitions.set(id, {
                posX:   this.x2pos(gt.gridX),
                posY:   this.y2pos(gt.gridY),
                deltaX: dx,
                deltaY: dy
            });
        }, this)
    }


    protected positionArcs(garcs: Array<grid.Arc>) : void {
        this.arcs = garcs.map(function(ga) : Arc {
            const t = this.getTransition(ga.transition.id);
            const p = this.getPlace(ga.place.id);

            let arc = {
                coordinates: [t.posX, t.posY],
                arrowT: ga.arctype == grid.ArcType.Input,
                arrowP: ga.arctype == grid.ArcType.Output,
            }

            for (let pos of ga.stopover) {
                arc.coordinates.push(this.x2pos(pos.gridX),
                                     this.y2pos(pos.gridY));
            }

            arc.coordinates.push(p.posX, p.posY);

            this.adjustArcAtTransition(arc, t);
            this.adjustArcAtPlace(arc, p);

            return arc;
        }, this)
    }


    // adjust the end point of an arc at a transition
    // This does not take into account other arcs of that transition.
    protected adjustArcAtTransition(arc: Arc, t: Transition) : void {
        // all arcs start at the transition, consider the next point
        let posX  = arc.coordinates[0];
        let posY  = arc.coordinates[1];
        let nextX = arc.coordinates[2];
        let nextY = arc.coordinates[3];

        let dX = nextX - posX;
        let dY = nextY - posY;

        // Trivial approach: snap X and Y individually to the border of the
        // transition. Horizontal and vertical lines will snap to the middle
        // of a side, all others to a corner.

        if (dX < 0) {
            posX = t.posX - t.deltaX
        } else if (dX > 0) {
            posX = t.posX + t.deltaX
        }
        // else vertical

        if (dY < 0) {
            posY = t.posY - t.deltaY
        } else if (dY > 0) {
            posY = t.posY + t.deltaY
        }
        // else vertical

        //@@@ add special handling for lines at 45° angles, unless T is square

        arc.coordinates[0] = posX;
        arc.coordinates[1] = posY;
    }


    // adjust the end point of an arc at a place
    // This does not take into account other arcs of that place.
    protected adjustArcAtPlace(arc: Arc, p: Place) : void {
        // all arcs end at the place, consider the next point
        const len = arc.coordinates.length;
        let posX  = arc.coordinates[len-2];
        let posY  = arc.coordinates[len-1];
        let nextX = arc.coordinates[len-4];
        let nextY = arc.coordinates[len-3];

        let dX = nextX - posX;
        let dY = nextY - posY;

        // compute length of arc segment, scale dX,dY to radius of place
        let seglength = Math.sqrt(dX*dX + dY*dY);
        let scale = p.radius / seglength;

        posX = p.posX + scale*dX;
        posY = p.posY + scale*dY;

        arc.coordinates[len-2] = posX;
        arc.coordinates[len-1] = posY;
    }
}
