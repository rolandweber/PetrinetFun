// not much here yet

const SVG_NS = "http://www.w3.org/2000/svg";


function setupPetrinetSVG(svgid: string) {

    const svg = document.getElementById(svgid);
    if (!svg) {
        console.error("Element '"+svgid+"' not found.");
        return;
    }

    while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
    }
    if (!svg.classList.contains("PetrinetFun")) {
        svg.classList.add("PetrinetFun");
    }

    let g = document.createElementNS(SVG_NS, "g");
    g.setAttributeNS(null, "id", svgid+"-backdrop");
    g.setAttributeNS(null, "class", "PetrinetFun-backdrop");
    svg.appendChild(g);

    g = document.createElementNS(SVG_NS, "g");
    g.setAttributeNS(null, "id", svgid+"-structure");
    g.setAttributeNS(null, "class", "PetrinetFun-structure");
    svg.appendChild(g);
    {
        let g2 = document.createElementNS(SVG_NS, "g");
        g2.setAttributeNS(null, "id", svgid+"-arcs");
        g2.setAttributeNS(null, "class", "PetrinetFun-arcs");
        g.appendChild(g2);

        g2 = document.createElementNS(SVG_NS, "g");
        g2.setAttributeNS(null, "id", svgid+"-nodes");
        g2.setAttributeNS(null, "class", "PetrinetFun-nodes");
        g.appendChild(g2);
    }

    g = document.createElementNS(SVG_NS, "g");
    g.setAttributeNS(null, "id", svgid+"-marking");
    g.setAttributeNS(null, "class", "PetrinetFun-marking");
    svg.appendChild(g);
}


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


    protected positionPlaces(gplaces: Array<GridPlace>) {
        this.places = gplaces.map(function(gp) : SVGPlace {
            return {
                posX: (gp.gridX+0.5) * this.step,
                posY: (gp.gridY+0.5) * this.step,
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
            const centerX = (gt.gridX+0.5) * this.step;
            const centerY = (gt.gridY+0.5) * this.step;

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
            const tX = (ga.transition.gridX+0.5) * this.step;
            const tY = (ga.transition.gridY+0.5) * this.step;
            const pX = (ga.place.gridX+0.5) * this.step;
            const pY = (ga.place.gridY+0.5) * this.step;

            let arc = {
                coordinates: [tX, tY],
                arrowT: ga.arctype == ArcType.Input,
                arrowP: ga.arctype == ArcType.Output,
            }

            for (let pos of ga.stopover) {
                const x = (pos.gridX+0.5) * this.step;
                const y = (pos.gridY+0.5) * this.step;
                arc.coordinates.push(x, y);
            }

            arc.coordinates.push(pX, pY);

            return arc;
        }, this)
    }

}


function renderStructureSVG(svgid: string, structure: GridLayoutStructure) {
    const svgstructure = new SVGLayoutStructure(structure);

    setupPetrinetSVG(svgid);
    renderPlacesSVG(svgid, svgstructure.places);
    renderTransitionsSVG(svgid, svgstructure.transitions);
    renderArcsSVG(svgid, svgstructure.arcs);
}


function renderPlacesSVG(svgid: string, places: Array<SVGPlace>) {

    const svgnodes = document.getElementById(svgid+"-nodes");
    if (!svgnodes) {
        console.error("Element '"+svgid+"'-nodes not found.");
        return;
    }

    while (svgnodes.lastChild) {
        svgnodes.removeChild(svgnodes.lastChild);
    }

    for (let place of places) {
        console.log(place);

        let p = document.createElementNS(SVG_NS, "circle");
        p.setAttributeNS(null, "class", "PetrinetFun-place");
        p.setAttributeNS(null, "cx", String(place.posX));
        p.setAttributeNS(null, "cy", String(place.posY));
        p.setAttributeNS(null, "r", String(place.radius));

        svgnodes.appendChild(p);
    }
}


function renderTransitionsSVG(svgid: string,
                              transitions: Array<SVGTransition>) {

    const svgnodes = document.getElementById(svgid+"-nodes");
    if (!svgnodes) {
        console.error("Element '"+svgid+"'-nodes not found.");
        return;
    }
    // do NOT remove children of svgnodes here, places are already there

    for (let transition of transitions) {
        console.log(transition);

        let t = document.createElementNS(SVG_NS, "rect");
        t.setAttributeNS(null, "class", "PetrinetFun-transition");
        t.setAttributeNS(null, "x", String(transition.posLeft));
        t.setAttributeNS(null, "y", String(transition.posTop));
        t.setAttributeNS(null, "width", String(transition.width));
        t.setAttributeNS(null, "height", String(transition.height));

        svgnodes.appendChild(t);
    }
}


function renderArcsSVG(svgid: string, arcs: Array<SVGArc>) {

    const svgarcs = document.getElementById(svgid+"-arcs");
    if (!svgarcs) {
        console.error("Element '"+svgid+"'-arcs not found.");
        return;
    }

    while (svgarcs.lastChild) {
        svgarcs.removeChild(svgarcs.lastChild);
    }

    const arrowid = svgid+"-arrow";
    const arrowref = "url(#"+arrowid+")";

    let m = document.createElementNS(SVG_NS, "marker");
    m.setAttributeNS(null, "class", "PetrinetFun-arrow");
    m.setAttributeNS(null, "id", arrowid);
    m.setAttributeNS(null, "markerHeight", "9");
    m.setAttributeNS(null, "markerWidth", "17");
    //m.setAttributeNS(null, "markerUnits", "userSpaceOnUse");
    m.setAttributeNS(null, "refX", "16");
    m.setAttributeNS(null, "refY", "5");
    m.setAttributeNS(null, "orient", "auto-start-reverse");
    svgarcs.appendChild(m);

    let arrow = document.createElementNS(SVG_NS, "polygon");
    arrow.setAttributeNS(null, "points", "14 5, 2 8, 2 2");
    m.appendChild(arrow);

    for (let arc of arcs) {
        console.log(arc);

        let a = document.createElementNS(SVG_NS, "polyline");
        a.setAttributeNS(null, "class", "PetrinetFun-arc");
        a.setAttributeNS(null, "points", arc.coordinates.join(" "));

        if (arc.arrowT) {
            a.setAttributeNS(null, "marker-start", arrowref);
        }
        if (arc.arrowP) {
            a.setAttributeNS(null, "marker-end", arrowref);
        }

        svgarcs.appendChild(a);
    }
}
