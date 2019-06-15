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
    posLeft: number;
    posTop: number;
    width: number;
    height: number;
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

    places: Array<Place>;
    transitions: Array<Transition>;
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


    protected positionPlaces(gplaces: Array<grid.Place>) {
        this.places = gplaces.map(function(gp) : Place {
            return {
                posX: this.x2svg(gp.gridX),
                posY: this.y2svg(gp.gridY),
                radius: 0.4 * this.step
            }
        }, this)
    }


    protected positionTransitions(gtransitions: Array<grid.Transition>) {
        this.transitions = gtransitions.map(function(gt) : Transition {
            let width, height;
            switch (gt.style) {
                case grid.TransitionStyle.Horizontal: {
                    width  = 1.0 * this.step;
                    height = 0.3 * this.step;
                    break;
                }
                case grid.TransitionStyle.Vertical: {
                    width  = 0.3 * this.step;
                    height = 1.0 * this.step;
                    break;
                }
                case grid.TransitionStyle.Square: {
                    width  = 0.6 * this.step;
                    height = 0.6 * this.step;
                    break;
                }
                default: {
                    // something visible but ugly
                    width  = 0.2 * this.step;
                    height = 0.2 * this.step;
                    break;
                }
            }
            const centerX = this.x2svg(gt.gridX);
            const centerY = this.y2svg(gt.gridY);

            return {
                posLeft: centerX - width/2,
                posTop:  centerY - height/2,
                width:   width,
                height:  height
            }
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
