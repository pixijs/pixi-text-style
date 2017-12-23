/**
 * Base control for style elements
 * @class StyleComponent
 */
export default class StyleComponent {
    constructor(vnode) {
        this.parent = vnode.attrs.parent;
        this.id = vnode.attrs.id;
        this.name = vnode.attrs.name;
    }
    view() {
        // Wrap around all elements
        return <div class='row'>
            <label class='col-xs-5' for={this.id} title={this.id}>{this.name}</label>
            <div class='col-xs-7'>{this.init()}</div>
        </div>;
    }

    parse(value) {
        // recursively parse arrays
        if (Array.isArray(value)) {
            value = value.map(v => this.parse(v));
        }
        // Handle integers as strings
        else if (/^-?\d+$/.test(value)) {
            value = parseInt(value);
        }
        // Handle floats as strings
        else if(/^-?\d*\.\d+$/.test(value)) {
            value = parseFloat(value);
        }
        return value;
    }

    update(value) {
        this.parent.style[this.id] = this.parse(value);
        this.parent.app.render();
    }

    init() {
        throw 'override init';
    }
}