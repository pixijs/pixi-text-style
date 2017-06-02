'use strict';

/**
 * Input checkbox with boolean output
 * @class StyleCheckbox
 * @extends StyleComponent
 */
class StyleCheckbox extends StyleComponent {
    init() {
        return m('input.check[type=checkbox]#'+this.id, {
            key: this.id,
            onchange: m.withAttr('checked', this.update, this),
            checked: this.parent.style[this.id]
        });
    }
}