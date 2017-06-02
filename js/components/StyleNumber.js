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
        this.min = vnode.attrs.min;
        this.max = vnode.attrs.max;
    }
    init() {
        return m('input.form-control.input-sm.number[type=number]#'+this.id, {
            key: this.id,
            step: this.step,
            min: this.min,
            max: this.max,
            oninput: m.withAttr('value', this.update, this),
            value: this.parent.style[this.id]
        });
    }
}