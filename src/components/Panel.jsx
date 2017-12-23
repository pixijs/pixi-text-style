/**
 * A collapsable pane
 * @class Panel
 */
export default class Panel {
    constructor(vnode) {
        this.id = `panel-${vnode.attrs.id}`;
        this.name = vnode.attrs.name;

        const saved = localStorage[this.id];

        this.selected = saved !== undefined ? JSON.parse(saved) : !!vnode.attrs.selected;
    }
    onclick() {
        this.selected = !this.selected;
        localStorage[this.id] = JSON.stringify(this.selected);
    }
    view(vnode) {
        const titleClassName = this.selected ? 'expanded': 'collapsed';
        const className = this.selected ? 'pane visible' : 'pane hidden';
        return <div>
            <h4 class={titleClassName} onclick={this.onclick.bind(this)}>{this.name}</h4>
            <div class={className}>
                {vnode.children}
            </div>
        </div>;
    }
}