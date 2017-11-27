import StyleComponent from './StyleComponent';

/**
 * Select element with options
 * @class StyleSelect
 * @extends StyleComponent
 */
export default class StyleSelect extends StyleComponent {
    constructor(vnode) {
        super(vnode);
        this.options = vnode.attrs.options.map(value => {
            let name = value;
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
            oninput: m.withAttr('value', this.update, this),
            value: this.parent.style[this.id]
        },
        this.options);
    }
}