import StyleColor from './StyleColor';

/**
 * Input number selector
 * @class StyleColor
 * @extends StyleComponent
 */
export default class StyleColorGradient extends StyleColor {
    init() {
        const values = this.parent.style[this.id];
        let contents;
        if (!Array.isArray(values)) {
            contents = [ super.init() ];
        }
        else {
            contents = values.map((color, i) => {

                let buttons = [
                    m('button.btn.btn-sm.btn-default', {
                        key: this.id + 'Remove' + i,
                        onclick: this.removeStop.bind(this, i)
                    }, m('span.glyphicon.glyphicon-remove'))
                ];

                if (i > 0) {
                    buttons.unshift(
                        m('button.btn.btn-sm.btn-default', {
                            key: this.id + 'Up' + i,
                            onclick: this.moveUpStop.bind(this, i)
                        }, m('span.glyphicon.glyphicon-arrow-up'))
                    );
                }

                if (i < values.length - 1) {
                    buttons.unshift(
                        m('button.btn.btn-sm.btn-default', {
                            key: this.id + 'Down' + i,
                            class: (i === values.length - 1 ? 'disabled': ''),
                            disabled: i === values.length - 1,
                            onclick: this.moveDownStop.bind(this, i)
                        }, m('span.glyphicon.glyphicon-arrow-down'))
                    );
                }

                return m('div.input-group.color-group', [
                    m('input.form-control.input-sm.color[type=color]#' + this.id + i, {
                        key: this.id + i,
                        oninput: m.withAttr('value', this.updateIndex.bind(this, i)),
                        value: this.stringToHex(color)
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
                    m('span.glyphicon.glyphicon-plus'), ' Add Color'
                ]
            )
        ]));
    }

    moveUpStop(index) {
        if (index === 0) {
            //console.log('Already at top');
            return;
        }
        const values = this.parent.style[this.id];
        const temp = values[index];
        values[index] = values[index-1];
        values[index-1] = temp;
        this.update(values);
    }

    moveDownStop(index) {
        const values = this.parent.style[this.id];
        if (index === values.length - 1) {
            //console.log("already at the bottom");
            return;
        }
        const temp = values[index];
        values[index] = values[index+1];
        values[index+1] = temp;
        this.update(values);
    }

    removeStop(index) {
        let values = this.parent.style[this.id];
        values.splice(index, 1);
        if (values.length === 1) {
            values = values[0];
        }
        this.update(values);
    }

    updateIndex(index, value) {
        this.parent.style[this.id][index] = this.hexToString(value);
        this.update(this.parent.style[this.id]);
    }

    addStop() {
        let values = this.parent.style[this.id];

        if (!Array.isArray(values)) {
            values = [values];
        }
        values.push('#000000');
        values = values.map(hex => this.hexToString(hex));
        this.update(values);
        m.redraw();
    }
}