/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

import * as grid from "./grid"

// =============================================================================
// floating layout: point coordinates, with SVG in mind
// =============================================================================
//@@@ formerly SVG layout, rename of interfaces and classes pending


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
    // svgTransition: Transition;
    // svgPlace: Place;
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


    protected x2svg(gridX: number) : number {
        return (gridX+0.5) * this.step;
    }

    protected y2svg(gridY: number) : number {
        return (gridY+0.5) * this.step;
    }


    protected positionPlaces(gplaces: Map<string, grid.Place>) {
        gplaces.forEach(function(gp, id) {
            this.places.set(id, {
                posX: this.x2svg(gp.gridX),
                posY: this.y2svg(gp.gridY),
                radius: 0.4 * this.step
            })
        }, this);
    }


    protected positionTransitions(gtransitions: Map<string, grid.Transition>) {
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
                posX:   this.x2svg(gt.gridX),
                posY:   this.y2svg(gt.gridY),
                deltaX: dx,
                deltaY: dy
            });
        }, this)
    }


    protected positionArcs(garcs: Array<grid.Arc>) {
        this.arcs = garcs.map(function(ga) : Arc {
            //@@@ start/end positions from P and T, without re-computing?
            //@@@ would need to map Grid P/T to SVG P/T
            const tX = this.x2svg(ga.transition.gridX);
            const tY = this.y2svg(ga.transition.gridY);
            const pX = this.x2svg(ga.place.gridX);
            const pY = this.y2svg(ga.place.gridY);

            let arc = {
                coordinates: [tX, tY],
                arrowT: ga.arctype == grid.ArcType.Input,
                arrowP: ga.arctype == grid.ArcType.Output,
            }

            for (let pos of ga.stopover) {
                arc.coordinates.push(this.x2svg(pos.gridX),
                                     this.y2svg(pos.gridY));
            }

            arc.coordinates.push(pX, pY);

            return arc;
        }, this)
    }

}
