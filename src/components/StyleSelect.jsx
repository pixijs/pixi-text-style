import StyleComponent from './StyleComponent';
import m from 'mithril';

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
            return <option value={value}>{name}</option>;
        });
    }
    init() {
        return <select class='form-control input-sm'
            id={this.id}
            key={this.key}
            oninput={m.withAttr('value', this.update, this)}
            value={this.parent.style[this.id]}>
            {this.options}
        </select>;
    }
}