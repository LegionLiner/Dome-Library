import { qsa, index, errThrower } from "../utilities/index.js";
import { syncNode, syncValue, syncOnce, syncAsHtml, syncSelect, syncVM } from "./syncModel/index.js";
import { ifNode } from "./syncCondition/syncCondition.js";
import { syncBind, syncClicks, syncStyles } from "./syncBind/index.js";

export function parseDOM(parentNode, observable) {

    console.log(parentNode, observable, 'observable');

    // парс DOM, ищем все атрибуты в node
    const ifs = qsa(`${parentNode} [d-if]`);
    ifs.forEach((node) => {
        errThrower(node.attributes['d-if'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        ifNode(node, observable, node.attributes['d-if'].value);
    });
    // const dFor = qsa(`${parentNode} [d-for]`);
    // dFor.forEach((node) => {
    //     errThrower(node.attributes['d-for'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
    //     syncFor(node, observable, node.attributes['d-for'].value);
    // });
    // const bind = qsa(`${parentNode} [d-bind]`);
    // bind.forEach((node) => {
    //     errThrower(node.attributes['d-bind'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
    //     syncBind(node, observable, node.attributes['d-bind'].value);
    // });

    const asHtml = qsa(`${parentNode} [d-html]`);
    const once = qsa(`${parentNode} [d-once]`);
    const nodes = qsa(`${parentNode} [d-text]`);
    const vm = qsa(`${parentNode} :not(input, button)`);
    const model = qsa(`${parentNode} [d-model]`);
    // для кадого найденного элемента с атрибутом x вызываем функцию,
    // связанную c этим x атрибутом

    nodes.forEach((node) => {
        errThrower(node.attributes['d-text'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        if (node.nodeName == 'INPUT' || node.nodeName == "TEXTAREA") {
            syncValue(node, observable, node.attributes['d-text'].value);
        } else {
            syncNode(node, observable, node.attributes['d-text'].value);
        }
    });
    once.forEach((node) => {
        errThrower(node.attributes['d-once'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncOnce(node, observable, node.attributes['d-once'].value);
    });
    asHtml.forEach((node) => {
        errThrower(node.attributes['d-html'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncAsHtml(node, observable, node.attributes['d-html'].value);
    });
    vm.forEach((node) => {
        if (index(node.textContent, '{{')) {
            syncVM(node, observable);
        }
    });
    model.forEach((node) => {
        errThrower(node.attributes['d-model'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncSelect(node, observable, node.attributes['d-model'].value);
    });
    const clicks = qsa(`${parentNode} [d-on]`);
    clicks.forEach((node) => {
        errThrower(node.attributes['d-on'].value, `В узле ${node.outerHTML} атрибут обьявлен без значения`)
        syncClicks(node, observable, node.attributes['d-on'].value);
    });
    syncStyles(parentNode)
}