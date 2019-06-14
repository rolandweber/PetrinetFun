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

enum TransitionStyle {
    Horizontal = "h",
    Vertical = "v",
    Square = "q",
}

interface GridTransition extends GridPosition {
    style: TransitionStyle;
}


enum ArcType {
    Input = "i",
    Output = "o",
    // Read = "r", Inhibit = "h",... 
}

interface GridArc {
    transition: GridTransition;
    place: GridPlace;
    arctype: ArcType;
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
                  style: TransitionStyle = TransitionStyle.Square)
    : GridTransition {

        let transition = {
            gridX: x, gridY: y, style: style
        }
        this.transitions.push(transition);
        return transition;
    }


    addArc(transition: GridTransition,
           place: GridPlace,
           arctype: ArcType,
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


// =============================================================================
// SVG layout: point coordinates
// =============================================================================


interface SVGPlace {
    posX: number;
    posY: number;
    radius: number;
}

interface SVGTransition {
    posLeft: number;
    posTop: number;
    width: number;
    height: number;
}

interface SVGArc {
    // svgTransition: SVGTransition;
    // svgPlace: SVGPlace;
    coordinates: Array<number>; // alternating x and y
    arrowT: boolean;
    arrowP: boolean;
}


class SVGLayoutStructure {
    protected readonly step = 60;

    places: Array<SVGPlace>;
    transitions: Array<SVGTransition>;
    arcs: Array<SVGArc>;

    constructor(structure: GridLayoutStructure) {
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


    protected positionPlaces(gplaces: Array<GridPlace>) {
        this.places = gplaces.map(function(gp) : SVGPlace {
            return {
                posX: this.x2svg(gp.gridX),
                posY: this.y2svg(gp.gridY),
                radius: 0.4 * this.step
            }
        }, this)
    }


    protected positionTransitions(gtransitions: Array<GridTransition>) {
        this.transitions = gtransitions.map(function(gt) : SVGTransition {
            let width, height;
            switch (gt.style) {
                case TransitionStyle.Horizontal: {
                    width  = 1.0 * this.step;
                    height = 0.3 * this.step;
                    break;
                }
                case TransitionStyle.Vertical: {
                    width  = 0.3 * this.step;
                    height = 1.0 * this.step;
                    break;
                }
                case TransitionStyle.Square: {
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


    protected positionArcs(garcs: Array<GridArc>) {
        this.arcs = garcs.map(function(ga) : SVGArc {
            //@@@ start/end positions from P and T, without re-computing?
            //@@@ would need to map Grid P/T to SVG P/T
            const tX = this.x2svg(ga.transition.gridX);
            const tY = this.y2svg(ga.transition.gridY);
            const pX = this.x2svg(ga.place.gridX);
            const pY = this.y2svg(ga.place.gridY);

            let arc = {
                coordinates: [tX, tY],
                arrowT: ga.arctype == ArcType.Input,
                arrowP: ga.arctype == ArcType.Output,
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


// =============================================================================
// SVG rendering: DOM nodes
// =============================================================================

const SVG_NS = "http://www.w3.org/2000/svg";


function renderStructureSVG(svgid: string, structure: GridLayoutStructure) {
    const svglayout = new SVGLayoutStructure(structure);

    const renderer = new SVGRenderer(svglayout, svgid);
    renderer.renderStructure();
}


class SVGRenderer {
    svg_layout: SVGLayoutStructure;
    svg_id: string;

    constructor(layout: SVGLayoutStructure, svgid: string) {
        this.svg_layout = layout;
        this.svg_id = svgid;

        this.reset();
    }


    reset() {
        //@@@ save the created nodes in the class, to avoid the lookup later?

        const svg = document.getElementById(this.svg_id);
        if (!svg) {
            console.error("Element '"+this.svg_id+"' not found.");
            return;
        }
        this.removeChildren(svg);

        if (!svg.classList.contains("PetrinetFun")) {
            svg.classList.add("PetrinetFun");
        }

        let g = this.createGroup(this.svg_id+"-backdrop",
                                 "PetrinetFun-structure");
        svg.appendChild(g);

        g = this.createGroup(this.svg_id+"-structure",
                             "PetrinetFun-structure");
        svg.appendChild(g);
        {
            let g2 = this.createGroup(this.svg_id+"-arcs",
                                      "PetrinetFun-arcs");
            g.appendChild(g2);

            g2 = this.createGroup(this.svg_id+"-nodes",
                                  "PetrinetFun-nodes");
            g.appendChild(g2);
        }

        g = this.createGroup(this.svg_id+"-marking",
                             "PetrinetFun-marking");
        svg.appendChild(g);
    }


    renderStructure() {
        this.renderPlaces();
        this.renderTransitions();
        this.renderArcs();
    }


    protected renderPlaces() {

        const svgnodes = document.getElementById(this.svg_id+"-nodes");
        if (!svgnodes) {
            console.error("Element '"+this.svg_id+"'-nodes not found.");
            return;
        }
        this.removeChildren(svgnodes);

        for (let place of this.svg_layout.places) {
            //console.log(place);
            let p = this.createElement("circle", {
                "class": "PetrinetFun-place",
                "cx"   : String(place.posX),
                "cy"   : String(place.posY),
                "r"    : String(place.radius)
            });
            svgnodes.appendChild(p);
        }
    }


    protected renderTransitions() {

        const svgnodes = document.getElementById(this.svg_id+"-nodes");
        if (!svgnodes) {
            console.error("Element '"+this.svg_id+"'-nodes not found.");
            return;
        }
        // do NOT remove children of svgnodes here, places are already there

        for (let transition of this.svg_layout.transitions) {
            //console.log(transition);

            let t = this.createElement("rect", {
                "class" : "PetrinetFun-transition",
                "x"     : String(transition.posLeft),
                "y"     : String(transition.posTop),
                "width" : String(transition.width),
                "height": String(transition.height)
            });
            svgnodes.appendChild(t);
        }
    }


    renderArcs() {

        const svgarcs = document.getElementById(this.svg_id+"-arcs");
        if (!svgarcs) {
            console.error("Element '"+this.svg_id+"'-arcs not found.");
            return;
        }
        this.removeChildren(svgarcs);

        const arrowid = this.svg_id+"-arrow";
        const arrowref = "url(#"+arrowid+")";

        let m = this.createElement("marker", {
            "class" : "PetrinetFun-arrow",
            "id"    : arrowid,
            "markerHeight":  "9",
            "markerWidth" : "17",
            //"markerUnits": "userSpaceOnUse",
            "refX"  : "16",
            "refY"  : "5",
            "orient": "auto-start-reverse"
        });
        svgarcs.appendChild(m);

        let arrow = this.createElement("polygon", {
            "points": "14 5, 2 8, 2 2"
        });
        m.appendChild(arrow);

        for (let arc of this.svg_layout.arcs) {
            //console.log(arc);

            let a = this.createElement("polyline", {
                "class" : "PetrinetFun-arc",
                "points": arc.coordinates.join(" ")
            });
            if (arc.arrowT) {
                a.setAttributeNS(null, "marker-start", arrowref);
            }
            if (arc.arrowP) {
                a.setAttributeNS(null, "marker-end", arrowref);
            }
            svgarcs.appendChild(a);
        }
    }



    removeChildren(e: Element) {
        while (e.lastChild) {
            e.removeChild(e.lastChild);
        }
    }

    createElement(name: string, attribs: object): SVGElement {

        let e = document.createElementNS("http://www.w3.org/2000/svg", name);
        for (let key in attribs) {
            e.setAttributeNS(null, key, String(attribs[key]));
        }
        return e;
    }

    createGroup(id: string, classname: string): SVGElement {
        return this.createElement("g", { "id": id, "class": classname });
    }

}
