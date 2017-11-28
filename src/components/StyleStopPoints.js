import StyleComponent from './StyleComponent';

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
                    m('button.btn.btn-sm.btn-default', {
                        key: this.id + 'Remove' + i,
                        onclick: this.removeStop.bind(this, i)
                    }, m('span.glyphicon.glyphicon-remove'))
                ];

                return m('div.input-group.color-group', [
                    m('input.form-control.input-sm.number[type=number]#' + this.id + i, {
                        key: this.id + i,
                        oninput: m.withAttr('value', this.updateIndex.bind(this, i)),
                        step: this.step,
                        min: this.min,
                        max: this.max,
                        value
                    }),
                    m('span.input-group-btn', buttons)
                ]);
            });
        }
        return m('div.gradient', contents.concat([
            m('button.btn-block.btn.btn-sm.btn-default', {
                key: this.id + 'Add',
                onclick: this.addStop.bind(this)
            }, [
                m('span.glyphicon.glyphicon-plus'), ' Add Stop Point'
            ]
            )
        ]));
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
