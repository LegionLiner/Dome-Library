export function syncStyles(node) {
    node = document.querySelector(node);
    let parseStyles = node.querySelectorAll("[d-style]");
    parseStyles.forEach((el) => {
        let style = el.attributes["d-style"].value;
        style = style.split(" ");
        let stylesKeys = {};
        style.forEach((el) => {
            let key = el.slice(0, el.indexOf("-"));
            if (keyStyleWords[key]) {
                let value = el.slice(el.indexOf("-") + 1);
                value = value.replaceAll(",", " ")
                stylesKeys[keyStyleWords[key]] = value;
            }
        })
        for (let key in stylesKeys) {
            el.style[key] = stylesKeys[key];
        }
    })
}

const keyStyleWords = {
    c: "color",
    fs: "font-size",
    ff: "font-family",
    fw: "font-weight",
    fs: "font-style",
    lh: "line-height",
    ls: "letter-spacing",
    ta: "text-align",
    tt: "text-transform",
    toverflow: "text-overflow",
    tdecoration: "text-decoration",
    w: "width",
    h: "height",
    p: "padding",
    pt: "padding-top",
    pb: "padding-bottom",
    pl: "padding-left",
    pr: "padding-right",
    m: "margin",
    mt: "margin-top",
    mb: "margin-bottom",
    ml: "margin-left",
    mr: "margin-right",
    d: "display",
    o: "opacity",
    bg: "background",
    bgposition: "background-position",
    bgrepeat: "background-repeat",
    bgsize: "background-size",
    bgimage: "background-image",
    bgcolor: "background-color",
    bgclip: "background-clip",
    bgorigin: "background-origin",
    transition: "transition",
    pos: "position",
    l: "left",
    t: "top",
    r: "right",
    b: "bottom",
    z: "z-index",
    lstyle: "list-style",
    ltype: "list-style-type",
    lpos: "list-style-position",
    limg: "list-style-image",
    lsize: "list-style-size",
    overflow: "overflow",
    vis: "visibility",
    float: "float",
    cursor: "cursor",
    border: "border",
    bradius: "border-radius",
    outline: "outline",
    boxshadow: "box-shadow",
    textshadow: "text-shadow",
    flex: "flex",
    flexdir: "flex-direction",
    flexwrap: "flex-wrap",
    align: "align-items",
    justify: "justify-content",
    flexbasis: "flex-basis",
    flexgrow: "flex-grow",
    flexshrink: "flex-shrink",
    flexwrap: "flex-wrap",
    gap: "gap",
    order: "order",
    grid: "grid",
    gridtemplate: "grid-template",
    gridtemplateareas: "grid-template-areas",
    gridtemplatecolumns: "grid-template-columns",
    gridtemplaterows: "grid-template-rows",
    gridcolumnstart: "grid-column-start",
    gridcolumnend: "grid-column-end",
    gridrowstart: "grid-row-start",
    gridrowend: "grid-row-end",
    gridcolumngap: "grid-column-gap",
    gridrowgap: "grid-row-gap",
    gridautoflow: "grid-auto-flow",
    gridautorows: "grid-auto-rows",
    gridautocolumns: "grid-auto-columns",
    boxsizing: "box-sizing"
}