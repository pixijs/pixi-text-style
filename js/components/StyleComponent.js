'use strict';

/**
 * Base control for style elements
 * @class StyleComponent
 */
class StyleComponent {
    constructor(vnode) {
        this.parent = vnode.attrs.parent;
        this.id = vnode.attrs.id;
        this.name = vnode.attrs.name;
    }
    view() {
        const id = this.id;
        // Wrap around all elements
        return m('div.row', [
            m('label.col-xs-5', {for: id, title: id}, this.name),
            m('div.col-xs-7', [ this.init() ])
        ]);
    }
    update(value) {
        if (/^\-?\d+$/.test(value)) {
            value = parseInt(value);
        }
        else if(/^\-?\d*\.\d+$/.test(value)) {
            value = parseFloat(value);
        }
        this.parent.style[this.id] = value;
        this.parent.app.render();
    }

    init() {
        // override
    }
}