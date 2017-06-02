'use strict';

/**
 * Input number selector
 * @class StyleNumber
 * @extends StyleComponent
 */
class StyleNumber extends StyleComponent {
    constructor(vnode) {
        super(vnode);
        this.step = vnode.attrs.step || 1;
    }
    init() {
        return m('input.form-control.input-sm.number[type=number]#'+this.id, {
            key: this.id,
            step: this.step,
            oninput: m.withAttr('value', (value) => {
                this.update(value);
            }),
            value: this.parent.style[this.id]
        });
    }
}