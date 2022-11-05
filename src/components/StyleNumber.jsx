/** @jsx m */
import StyleComponent from './StyleComponent';
import m from 'mithril';

/**
 * Input number selector
 * @class StyleNumber
 * @extends StyleComponent
 */
export default class StyleNumber extends StyleComponent {
    constructor(vnode) {
        super(vnode);
        this.step = vnode.attrs.step || 1;
        this.min = vnode.attrs.min;
        this.max = vnode.attrs.max;
    }
    init() {
        return <input class='form-control input-sm number'
            type='number'
            id={this.id}
            key={this.id}
            step={this.step}
            min={this.min}
            max={this.max}
            oninput={m.withAttr('value', this.update, this)}
            value={this.parent.style[this.id]} />;
    }
}