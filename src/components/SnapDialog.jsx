/** @jsx m */
import m from 'mithril';

/**
 * Dialog that contains the options for saving snapshot
 */
export default class SnapDialog {

    constructor(vnode) {
        this.parent = vnode.attrs.parent;
        this.onclose = vnode.attrs.onclose;
        // ugly prevent double click for saveSnap toBlob
        this._saving = false;
        this.format = localStorage.snapFormat || 'png';
        this.alpha = localStorage.snapAlpha || '1';
    }

    onSave() {
        if (this._saving) {
            return;
        }
        this._saving = true;

        const { text, style, background, app } = this.parent;
        const preview = new PIXI.Container();
        const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        const label = new PIXI.Text(text._text, style);

        bg.anchor.set(0.5);
        bg.scale.set(label.width / bg.width, label.height / bg.height);
        bg.tint = parseInt(background.replace('#', ''), 16);
        bg.alpha = parseInt(this.alpha);
        label.anchor.set(0.5);
        preview.addChild(bg, label);

        const renderTexture = app.renderer.generateTexture(preview);
        preview.destroy(true);

        const snap = new PIXI.Sprite(renderTexture);

        app.renderer.extract.canvas(snap).toBlob((blob) => {
            const _URL = window.URL || window.webkitURL || URL;
            const a = document.createElement('a');
            a.href = _URL.createObjectURL(blob);
            a.download = label.text.substring(0, 24) + '.' + this.format;
            document.body.append(a);
            a.click();
            a.remove();
            snap.destroy(true);
            this._saving = false;
        }, 'image/' + this.format);
    }

    onFormat(event) {
        this.format = event.currentTarget.value;
        localStorage.setItem('snapFormat', this.format);
        m.redraw();
    }

    onAlpha(event) {
        this.alpha = event.currentTarget.value;
        localStorage.setItem('snapAlpha', this.alpha);
        m.redraw();
    }

    view() {
        return <div class='well'>
            <div class='row config'>
                <label class='col-md-3 col-sm-4'>
                    <span class='glyphicon glyphicon-picture'></span>
                    <span class='name'>Format</span>
                </label>
                <div class='col-md-9 col-sm-8'>
                    <select class='form-control input-sm' onchange={this.onFormat.bind(this)} value={this.format}>
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                    </select>
                </div>
            </div>
            <div class='row config'>
                <label class='col-md-3 col-sm-4'>
                    <span class='glyphicon glyphicon-adjust'></span>
                    <span class='name'>Background</span>
                </label>
                <div class='col-md-9 col-sm-8'>
                    <select class='form-control input-sm' onchange={this.onAlpha.bind(this)} value={this.alpha}>
                        <option value='0'>0% (hidden)</option>
                        <option value='0.1'>10%</option>
                        <option value='0.2'>20%</option>
                        <option value='0.3'>30%</option>
                        <option value='0.4'>40%</option>
                        <option value='0.5'>50%</option>
                        <option value='0.6'>60%</option>
                        <option value='0.7'>70%</option>
                        <option value='0.8'>80%</option>
                        <option value='0.9'>90%</option>
                        <option value='1'>100% (visible)</option>
                    </select>
                </div>
            </div>
            <div class='row config'>
                <div class='col-md-10 col-sm-9 col-md-offset-2 col-sm-offset-3'>
                    <div class='btn-group pull-right'>
                        <button class='btn btn-primary' onclick={this.onSave.bind(this)}>
                            <span class='glyphicon glyphicon-save'></span> Download
                        </button>
                        <button class='btn btn-default' onclick={this.onclose}>
                            <span class='glyphicon glyphicon-remove'></span> Close
                        </button>
                    </div>
                </div>
            </div>
        </div>;
    }
}
