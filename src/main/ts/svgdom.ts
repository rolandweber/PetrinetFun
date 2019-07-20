/*
 * This work is released into the Public Domain under the
 * terms of the Creative Commons CC0 1.0 Universal license.
 * https://creativecommons.org/publicdomain/zero/1.0/
 */

import * as float from "./float"

// =============================================================================
// SVG rendering: DOM nodes
// =============================================================================

const SVG_NS = "http://www.w3.org/2000/svg";


export class SVGRenderer {
    float_layout: float.LayoutStructure;
    svg_id: string;

    places: Map<string, SVGElement> = new Map();
    transitions: Map<string, SVGElement> = new Map();
    arcs: Map<string, SVGElement> = new Map();


    constructor(layout: float.LayoutStructure, svgid: string) {
        this.float_layout = layout;
        this.svg_id = svgid;

        this.reset();
    }


    reset() : void {
        const svg = document.getElementById(this.svg_id);
        if (!svg) {
            console.error("Element '"+this.svg_id+"' not found.");
            return;
        }
        this.removeChildren(svg);

        (svg as any)._petrinetfun_renderer = this;
        this.places.clear();
        this.transitions.clear();
        this.arcs.clear();

        if (!svg.classList.contains("PetrinetFun")) {
            svg.classList.add("PetrinetFun");
        }

        let g = this.createGroup(this.svg_id+"-backdrop",
                                 "PetrinetFun-backdrop");
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


    renderStructure() : void {
        this.renderPlaces();
        this.renderTransitions();
        this.renderArcs();
    }


    protected renderPlaces() : void {

        const svgnodes = document.getElementById(this.svg_id+"-nodes");
        if (!svgnodes) {
            console.error("Element '"+this.svg_id+"'-nodes not found.");
            return;
        }
        this.removeChildren(svgnodes);

        for (let place of this.float_layout.places.values()) {
            //console.log(place);
            let p = this.createElement("circle", {
                "class": "PetrinetFun-place",
                "cx"   : String(place.posX),
                "cy"   : String(place.posY),
                "r"    : String(place.radius)
            });
            this.addTitle(p, place.label);
            svgnodes.appendChild(p);
            this.places.set(place.id, p);
        }
    }


    protected renderTransitions() : void {

        const svgnodes = document.getElementById(this.svg_id+"-nodes");
        if (!svgnodes) {
            console.error("Element '"+this.svg_id+"'-nodes not found.");
            return;
        }
        // do NOT remove children of svgnodes here, places are already there

        for (let transition of this.float_layout.transitions.values()) {
            //console.log(transition);

            let t = this.createElement("rect", {
                "class" : "PetrinetFun-transition",
                "x"     : String(transition.posX-transition.deltaX),
                "y"     : String(transition.posY-transition.deltaY),
                "width" : String(transition.deltaX * 2),
                "height": String(transition.deltaY * 2)
            });
            this.addTitle(t, transition.label);
            svgnodes.appendChild(t);
            this.transitions.set(transition.id, t);
        }
    }


    renderArcs() : void {

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

        for (let arc of this.float_layout.arcs.values()) {
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
            this.arcs.set(arc.id, a);
        }
    }


    // --------------------------------------------------------------

    renderMarking(marking: Map<string,string|number>) : void {

        const svgmarking = document.getElementById(this.svg_id+"-marking");
        if (!svgmarking) {
            console.error("Element '"+this.svg_id+"'-marking not found.");
            return;
        }
        this.removeChildren(svgmarking);

        for (let [plid, mark] of marking) {
            //@@@ the positions of places are actually tracked in the layout
            //@@@ taking them from the rendering feels hacky
            const place = this.places.get(plid);
            if (!place) {
                console.warn("Place '"+plid+"' not found.");
                continue;
            }
            let styleclass = "PetrinetFun-symbolic";
            let dy = 0;

            if (typeof mark === 'number') {
                if (this.renderTokenDots(svgmarking, place, mark))
                    continue;
                styleclass = "PetrinetFun-numeric";
                dy = 2;
            }
            //console.log("place", plid, "with", mark, "as", styleclass);

            let m = this.createElement("text", {
                "class" : styleclass,
                "x" : place.getAttribute("cx"),
                "y" : place.getAttribute("cy"),
                "dy": (typeof mark === 'number') ? "2" : "0"
                // "dy" refused as CSS property by FF 68.0
            });
            m.textContent = String(mark);
            svgmarking.appendChild(m);
        }
    }


    renderTokenDots(svgmarking: HTMLElement,
                    place: SVGElement, mark: number) : boolean {
        if (mark < 1)
            return true; // render nothing for 0

        let dots: Array<[number, number]> = [];
        let radius = 6;
        let stretch = 8;

        // the order of dots is relevant if they overlap
        switch (mark) {
            case 1:
                dots = [[0, 0]];
                break;

            case 2:
                dots = [[-stretch, -stretch],
                        [+stretch, +stretch]];
                break;

            case 3:
                dots = [[0, -1.25*stretch],
                        [-stretch, 0.75*stretch],
                        [+stretch, 0.75*stretch]];
                break;

            case 4:
                dots = [[-stretch, -stretch],
                        [-stretch, +stretch],
                        [+stretch, -stretch],
                        [+stretch, +stretch]];
                break;

            case 5:
                dots = [[-1.25*stretch, -1.25*stretch],
                        [-1.25*stretch, +1.25*stretch],
                        [+1.25*stretch, -1.25*stretch],
                        [+1.25*stretch, +1.25*stretch],
                        [0, 0]];
                break;

            case 6:
                dots = [[-stretch, +1.5*stretch],
                        [+stretch, +1.5*stretch],
                        [-stretch, 0],
                        [+stretch, 0],
                        [-stretch, -1.5*stretch],
                        [+stretch, -1.5*stretch]];
                break;

            case 7:
                dots = [[-0.75*stretch, -1.50*stretch],
                        [-1.50*stretch, 0],
                        [-0.75*stretch, +1.50*stretch],
                        [+0.75*stretch, -1.50*stretch],
                        [+1.50*stretch, 0],
                        [+0.75*stretch, +1.50*stretch],
                        [0, 0]];
                break;

            case 8:
                dots = [[-1.4*stretch, +1.4*stretch],
                        [0, +1.4*stretch],
                        [+1.4*stretch, +1.4*stretch],
                        [-0.7*stretch, 0],
                        [+0.7*stretch, 0],
                        [-1.4*stretch, -1.4*stretch],
                        [0, -1.4*stretch],
                        [+1.4*stretch, -1.4*stretch]];
                break;

            case 9:
                dots = [[-1.4*stretch, +1.4*stretch],
                        [ 0          , +1.4*stretch],
                        [+1.4*stretch, +1.4*stretch],
                        [-1.4*stretch, 0],
                        [ 0          , 0],
                        [+1.4*stretch, 0],
                        [-1.4*stretch, -1.4*stretch],
                        [ 0          , -1.4*stretch],
                        [+1.4*stretch, -1.4*stretch]];
                break;
        }
        if (dots.length < 1)
            return false;

        let g = this.createElement("g", {
            "class" : "PetrinetFun-dots PetrinetFun-dots"+mark,
            "transform" : "translate("+
                place.getAttribute("cx")+" "+
                place.getAttribute("cy")+")"
        });
        for (let [x, y] of dots) {
            let c = this.createElement("circle", {
                "cx" : String(x),
                "cy" : String(y),
                "r"  : String(radius) // refused as CSS property by FF 68.0
            });
            g.appendChild(c);
        }
        svgmarking.appendChild(g);

        return true;
    }


    highlight(ids: Array<string>) {

        const backdrop = document.getElementById(this.svg_id+"-backdrop");
        if (!backdrop) {
            console.error("Element '"+this.svg_id+"'-backdrop not found.");
            return;
        }
        this.removeChildren(backdrop);

        for (let id of ids) {
            //console.log(id);
            const e = (this.places.get(id) ||
                       this.transitions.get(id) ||
                       this.arcs.get(id));
            if (e) {
                const e2 = <Element> e.cloneNode(false);
                e2.removeAttribute("id");
                e2.removeAttribute("marker-start");
                e2.removeAttribute("marker-end");
                if (e.classList.contains("PetrinetFun-arc")) {
                    backdrop.insertBefore(e2, backdrop.firstChild);
                } else {
                    backdrop.appendChild(e2);
                }
            } else {
                console.warn("Place, transition or arc '"+id+"' not found.");
            }
        }
    }


    // --------------------------------------------------------------

    removeChildren(e: Element) : void {
        while (e.lastChild) {
            e.removeChild(e.lastChild);
        }
    }

    createElement(name: string, attribs: object = {}): SVGElement {

        let e = document.createElementNS("http://www.w3.org/2000/svg", name);
        for (let key in attribs) {
            e.setAttributeNS(null, key, String(attribs[key]));
        }
        return e;
    }

    createGroup(id: string, classname: string): SVGElement {
        return this.createElement("g", { "id": id, "class": classname });
    }

    addTitle(e: SVGElement, text: string) : void {
        let t = this.createElement("title");
        t.textContent = text;
        e.appendChild(t);
    } 
}



export function marking(svgid: string, marking: Map<string,string|number>)
{
    const svg = document.getElementById(svgid);
    if (!svg) {
        console.error("Element '"+svgid+"' not found.");
        return;
    }

    const renderer = <SVGRenderer>(svg as any)._petrinetfun_renderer;
    renderer.renderMarking(marking);
}


export function highlight(svgid: string, ids: Array<string>)
{
    const svg = document.getElementById(svgid);
    if (!svg) {
        console.error("Element '"+svgid+"' not found.");
        return;
    }

    const renderer = <SVGRenderer>(svg as any)._petrinetfun_renderer;
    renderer.highlight(ids);
}
