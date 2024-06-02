import { instance } from "../composition/instance.js";

export function props(props) {
    instance.components[instance.activeComponent].props = props;
    // const component = instance.components[instance.activeComponent];
    // console.log(component.parent);
    // props.forEach(prop => {
    //     component[prop] = component.parent[prop];
    // });
}

export function emits(props) {
    instance.components[instance.activeComponent].emits = emits;
}