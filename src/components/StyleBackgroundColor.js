import StyleComponent from './StyleComponent';

/**
 * Input number selector
 * @class StyleBackgroundColor
 * @extends StyleComponent
 */
export default class StyleBackgroundColor extends StyleComponent {
    init() {
        return m('input.form-control.input-sm.color[type=color]#'+this.id, {
            key: this.id,
            oninput: m.withAttr('value', (value) => {
                this.parent.background = value;
                this.parent.app.render();
            }),
            value: this.parent.background
        });
    }
}