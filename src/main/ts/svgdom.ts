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

    constructor(layout: float.LayoutStructure, svgid: string) {
        this.float_layout = layout;
        this.svg_id = svgid;

        this.reset();
    }


    reset() : void {
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

        for (let arc of this.float_layout.arcs) {
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
