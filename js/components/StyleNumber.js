'use strict';

/**
 * Input number selector
 * @class StyleNumber
 * @extends StyleComponent
 */
class StyleNumber extends StyleComponent {
    init() {
        return m('input.form-control.input-sm.number[type=number]#'+this.id, {
            key: this.id,
            oninput: m.withAttr('value', (value) => {
                this.update(value);
            }),
            value: this.parent.style[this.id]
        });
    }
}