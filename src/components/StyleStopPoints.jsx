/** @jsx m */
import StyleComponent from './StyleComponent';
import m from 'mithril';

/**
 * Input selector for stop points, for example, on a color gradient
 * @class StyleStopPoints
 * @extends StyleComponent
 */
export default class StyleStopPoints extends StyleComponent {
    constructor(vnode) {
        super(vnode);
        this.step = vnode.attrs.step || 1;
        this.min = vnode.attrs.min;
        this.max = vnode.attrs.max;
    }
    init() {
        const values = this.parent.style[this.id];
        let contents;
        if (!Array.isArray(values)) {
            contents = [];
        }
        else {
            contents = values.map((value, i) => {

                let buttons = [
                    <button class='btn btn-sm btn-default' key={this.id + 'Remove' + i}
                        onclick={this.removeStop.bind(this, i)}>
                        <span class='glyphicon glyphicon-remove'></span>
                    </button>
                ];

                return <div class='input-group color-group'>
                    <input class='form-control input-sm number'
                        type='number'
                        id={this.id + i}
                        key={this.id + i}
                        oninput={m.withAttr('value', this.updateIndex.bind(this, i))}
                        step={this.step}
                        min={this.min}
                        max={this.max}
                        value={value} />
                    <span class='input-group-btn'>{buttons}</span>
                </div>;
            });
        }

        return <div class='gradient'>
            {contents}
            <button class='btn-block btn btn-sm btn-default'
                key={this.id + 'Add'}
                onclick={this.addStop.bind(this)}>
                <span class='glyphicon glyphicon-plus'></span>
                Add Stop Point
            </button>
        </div>;
    }

    removeStop(index) {
        let values = this.parent.style[this.id];
        values.splice(index, 1);
        this.update(values.slice());
    }

    updateIndex(index, value) {
        this.parent.style[this.id][index] = value;
        this.update(this.parent.style[this.id].slice());
    }

    addStop() {
        let values = this.parent.style[this.id];

        if (!Array.isArray(values)) {
            values = [values];
        }
        values.push(values[values.length - 1] || 0);
        this.update(values);
        m.redraw();
    }
}
