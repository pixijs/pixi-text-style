'use strict';

/**
 * Select element with options
 * @class StyleSelect
 * @extends StyleComponent
 */
class StyleSelect extends StyleComponent {
    constructor(vnode) {
        super(vnode);
        this.options = vnode.attrs.options.map(value => {
            name = value;
            if (Array.isArray(value)) {
                name = value[1];
                value = String(value[0]);
            }
            return m('option', {value: value}, name);
        });
    }
    init() {
        return m('select.form-control.input-sm#'+this.id, {
            key: this.id,
            oninput: m.withAttr('value', (value) => {
                this.update(value);
            }),
            value: this.parent.style[this.id]
        },
        this.options);
    }
}