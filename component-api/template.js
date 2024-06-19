import { instance, extractComponent } from "../composition/instance.js";

export function template(template, component) {
    if (!component.startsWith('d-')) {
        instance.$template = template;
        return;
    }

    instance.components[component].template = template;
}

export function style(style, scoped = false) {
    if (!scoped) {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);
    } else {
        if (instance.activeComponent) {
            const styleElement = document.createElement('style');
            let newStyle = '';
            style = style.split(' {');

            style.forEach((styleEl, index) => {
                if (index < style.length - 1) {
                    newStyle += `${styleEl.trim()}[${instance.activeComponent}] {\n`;
                } else {
                    newStyle += styleEl.trim();
                }
            });

            styleElement.innerHTML = newStyle;
            document.head.appendChild(styleElement);
            extractComponent(instance.activeComponent, instance).styleElement = instance.activeComponent;
        }
    }
}