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
