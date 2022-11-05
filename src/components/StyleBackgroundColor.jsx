/** @jsx m */
import StyleComponent from './StyleComponent';
import m from 'mithril';

/**
 * Input number selector
 * @class StyleBackgroundColor
 * @extends StyleComponent
 */
export default class StyleBackgroundColor extends StyleComponent {
    init() {
        const oninput = m.withAttr('value', (value) => {
            this.parent.background = value;
            this.parent.app.render();
        });
        return <input class='form-control input-sm color'
            type='color'
            id={this.id}
            key={this.id}
            value={this.parent.background}
            oninput={oninput} />;
    }
}