'use strict';

/**
 * Input number selector
 * @class StyleColor
 * @extends StyleComponent
 */
class StyleColor extends StyleComponent {
    init() {

        // Map of color names
        this.colorMap = {
            '#000': 'black',
            '#fff': 'white',
            '#c0c0c0': 'silver',
            '#f00': 'red',
            '#800000': 'maroon',
            '#ff0': 'yellow',
            '#808000': 'olive',
            '#0f0': 'lime',
            '#008000': 'green',
            '#0ff': 'aqua',
            '#008080': 'teal',
            '#00f': 'blue',
            '#000080': 'navy',
            '#f0f': 'fuchsia',
            '#800080': 'purple'
        };

        // Create a reverse look-up of the colorMap
        this.stringMap = {};

        Object.keys(this.colorMap).forEach(value => {
            this.stringMap[this.colorMap[value]] = value;
        });

        return m('input.form-control.input-sm.color[type=color]#'+this.id, {
            key: this.id,
            oninput: m.withAttr('value', (value) => {
                this.update(this.hexToString(value));
            }),
            value: this.stringToHex(this.parent.style[this.id])
        });
    }

    stringToHex(str) {
        let hex = this.stringMap[str] || str;
        hex = hex.replace(/^\#([a-f0-9])([a-f0-9])([a-f0-9])$/, "#$1$1$2$2$3$3");
        return hex;
    }

    hexToString(hex) {
        // Convert to shortened with double repeating colors
        const str = hex.replace(/([a-f0-9])\1([a-f0-9])\2([a-f0-9])\3/, "$1$2$3");
        return this.colorMap[str] || str;
    }
}