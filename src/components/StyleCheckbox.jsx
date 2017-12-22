import StyleComponent from './StyleComponent';
import m from 'mithril';

/**
 * Input checkbox with boolean output
 * @class StyleCheckbox
 * @extends StyleComponent
 */
export default class StyleCheckbox extends StyleComponent {
    init() {
        return <input type="checkbox"
            className="check"
            id={this.id}
            key={this.id}
            onchange={m.withAttr('checked', this.update, this)}
            checked={this.parent.style[this.id]} />;
    }
}