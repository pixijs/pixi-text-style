import StyleColor from './StyleColor';
import m from 'mithril';

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
                    <button class="btn btn-sm btn-default"
                        key={this.id + 'Remove' + i}
                        onclick={this.removeStop.bind(this, i)}>
                        <span class="glyphicon glyphicon-remove"></span>
                    </button>
                ];

                if (i > 0) {
                    buttons.unshift(
                        <button class="btn btn-sm btn-default"
                            key={this.id + 'Up' + i}
                            onclick={this.moveUpStop.bind(this, i)}>
                            <span class="glyphicon glyphicon-arrow-up"></span>
                        </button>
                    );
                }

                if (i < values.length - 1) {
                    const className = `btn btn-sm btn-default ${(i === values.length - 1 ? 'disabled': '')}`;

                    buttons.unshift(
                        <button class={className}
                            key={this.id + 'Down' + i}
                            disabled={i === values.length - 1}
                            onclick={this.moveDownStop.bind(this, i)}>
                            <span class="glyphicon glyphicon-arrow-down"></span>
                        </button>
                    );
                }

                return <div class="input-group color-group">
                    <input class="form-control input-sm color"
                        type="color"
                        id={this.id + i}
                        key={this.id + i}
                        oninput={m.withAttr('value', this.updateIndex.bind(this, i))}
                        value={this.stringToHex(color)} />
                    <span class="input-group-btn">{buttons}</span>
                </div>;
            });
        }
        return <div class="gradient">
            {contents}
            <button class="btn-block btn btn-sm btn-default"
                key={this.id + 'Add'}
                onclick={this.addStop.bind(this)}>
                <span class="glyphicon glyphicon-plus"></span>
                Add Color
            </button>
        </div>;
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