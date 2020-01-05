import StyleBackgroundColor from './components/StyleBackgroundColor';
import StyleCheckbox from './components/StyleCheckbox';
import StyleColor from './components/StyleColor';
import StyleColorGradient from './components/StyleColorGradient';
import StyleNumber from './components/StyleNumber';
import StyleSelect from './components/StyleSelect';
import StyleStopPoints from './components/StyleStopPoints';
import Panel from './components/Panel';
import { deepCopy, deepEqual } from './utils';
import m from 'mithril';

/**
 * TextStyle Component for Mithril
 * @class TextStyleEditor
 */
export default class TextStyleEditor {

    constructor() {
        this.defaults = new PIXI.TextStyle();

        this.defaultText = 'Hello World';
        this.defaultBG = '#ffffff';
        this.style = new PIXI.TextStyle();

        // The default dropShadowColor is "#000000",
        // this makes it consistent with fill, strokeFill, etc
        this.defaults.dropShadowColor = 'black';
        this.style.dropShadowColor = 'black';

        this.text = new PIXI.Text('', this.style);
        this.text.anchor.set(0.5);

        // Spacing type
        this.indent = parseInt(localStorage.indent) || TextStyleEditor.INDENT.SPACE_4;

        // Placeholder for URL
        this.shortenUrl = '';

        // ugly prevent double click for saveSnap toBlob
        this._busy = false;
        // Restore the values or get the defaults
        let values = {
            text: localStorage.text || this.defaultText,
            background: localStorage.background || this.defaultBG,
            style: JSON.parse(localStorage.style || null) || this.defaults.toJSON()
        };

        // Revert from the window hash
        if (document.location.hash) {
            try {
                const hash = document.location.hash.slice(1);
                values = Object.assign(values, JSON.parse(
                    decodeURIComponent(hash)
                ));
            }
            catch(err) {
                // do nothing if theres a parse error
            }
        }

        PIXI.utils.skipHello();
        this.app = new PIXI.Application({
            width: 400,
            height: 100,
            roundPixels: true,
            resolution: devicePixelRatio
        });
        this.app.renderer.plugins.interaction.autoPreventDefault = false;

        deepCopy(this.style, values.style);

        this.text.text = values.text;
        this.background = values.background;

        this.app.stage.addChild(this.text);
        this.app.stop();
    }

    view() {
        const codeColor = this.codeColor.bind(this);

        return <div oncreate={this.init.bind(this)}>
            <nav class='controls'>
                <div class='container-fluid'>
                    <h3 class='title'>
                        PixiJS TextStyle
                        <button class='btn btn-primary btn-sm pull-right' onclick={this.reset.bind(this)}>
                            <span class='glyphicon glyphicon-refresh'></span>
                        </button>
                        <button class='btn btn-primary btn-sm pull-right' onclick={this.saveSnap.bind(this)}>
                            <span class='glyphicon glyphicon-camera'></span>
                        </button>
                    </h3>
                    <Panel id='text' name='Text' selected='true'>
                        <textarea class='form-control'
                            id='input'
                            autofocus='true'
                            oninput={m.withAttr('value', this.onText.bind(this))}
                            value={this.text.text}></textarea>
                    </Panel>
                    <Panel id='font' name='Font' selected='true'>
                        <StyleSelect parent={this} id='fontFamily' name='Font Family' options={[
                            'Arial',
                            'Arial Black',
                            'Comic Sans MS',
                            'Courier New',
                            'Georgia',
                            'Helvetica',
                            'Impact',
                            'Tahoma',
                            'Times New Roman',
                            'Verdana',
                            'Georgia, serif',
                            '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                            '"Times New Roman", Times, serif',
                            'Arial, Helvetica, sans-serif',
                            '"Arial Black", Gadget, sans-serif',
                            '"Comic Sans MS", cursive, sans-serif',
                            'Impact, Charcoal, sans-serif',
                            '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
                            'Tahoma, Geneva, sans-serif',
                            '"Trebuchet MS", Helvetica, sans-serif',
                            'Verdana, Geneva, sans-serif',
                            '"Courier New", Courier, monospace',
                            '"Lucida Console", Monaco, monospace'
                        ]} />
                        <StyleNumber parent={this} id='fontSize' name='Font Size' step='1' min='1' />
                        <StyleSelect parent={this} id='fontStyle' name='Font Style' options={[
                            'normal',
                            'italic',
                            'oblique'
                        ]} />
                        <StyleSelect parent={this} id='fontVariant' name='Font Variant' options={[
                            'normal',
                            'small-caps'
                        ]} />
                        <StyleSelect parent={this} id='fontWeight' name='Font Weight' options={[
                            'normal',
                            'bold',
                            'bolder',
                            'lighter',
                            '100',
                            '200',
                            '300',
                            '400',
                            '500',
                            '600',
                            '700',
                            '800',
                            '900'
                        ]} />
                    </Panel>

                    <Panel id='fill' name='Fill'>
                        <StyleColorGradient parent={this} id='fill' name='Color' />
                        <StyleSelect parent={this} id='fillGradientType' name='Gradient Type' options={[
                            [0, 'linear vertical'],
                            [1, 'linear horizontal']
                        ]} />
                        <StyleStopPoints parent={this} id='fillGradientStops' name='Fill Gradient Stops' step='0.1' min='0' max='1' />
                    </Panel>

                    <Panel id='stroke' name='Stroke'>
                        <StyleColor parent={this} id='stroke' name='Color' />
                        <StyleNumber parent={this} id='strokeThickness' name='Thickness' step='1' min='0' />
                        <StyleSelect parent={this} id='lineJoin' name='Line Join' options={[
                            'miter',
                            'round',
                            'bevel'
                        ]} />
                        <StyleNumber parent={this} id='miterLimit' name='Miter Limit' step='1' min='0' />
                    </Panel>

                    <Panel id='layout' name='Layout'>
                        <StyleNumber parent={this} id='letterSpacing' name='Letter Spacing' />
                        <StyleSelect parent={this} id='textBaseline' name='Text Baseline' options={[
                            'alphabetic',
                            'bottom',
                            'middle',
                            'top',
                            'hanging'
                        ]} />
                    </Panel>

                    <Panel id='shadow' name='Drop Shadow'>
                        <StyleCheckbox parent={this} id='dropShadow' name='Enable' />
                        <StyleColor parent={this} id='dropShadowColor' name='Color' />
                        <StyleNumber parent={this} id='dropShadowAlpha' name='Alpha' step='0.1' min='0' max='1' />
                        <StyleNumber parent={this} id='dropShadowAngle' name='Angle' step='0.1' />
                        <StyleNumber parent={this} id='dropShadowBlur' name='Blur' />
                        <StyleNumber parent={this} id='dropShadowDistance' name='Distance' />
                    </Panel>

                    <Panel id='multiline' name='Multiline'>
                        <StyleCheckbox parent={this} id='wordWrap' name='Enable' />
                        <StyleCheckbox parent={this} id='breakWords' name='Break Words' />
                        <StyleSelect parent={this} id='align' name='Align' options={[
                            'left',
                            'center',
                            'right'
                        ]} />
                        <StyleSelect parent={this} id='whiteSpace' name='White Space' options={[
                            'normal',
                            'pre',
                            'pre-line'
                        ]} />
                        <StyleNumber parent={this} id='wordWrapWidth' name='Wrap Width' step='10' min='0' />
                        <StyleNumber parent={this} id='lineHeight' name='Line Height' step='1' min='0' />
                    </Panel>

                    <Panel id='texture' name='Texture'>
                        <StyleNumber parent={this} id='padding' name='Padding' />
                        <StyleCheckbox parent={this} id='trim' name='Trim' />
                    </Panel>

                    <Panel id='background' name='Background'>
                        <StyleBackgroundColor parent={this} id='backgroundColor' name='Color' />
                    </Panel>
                </div>
            </nav>
            <main class='main'>
                <div class='col-sm-12'>
                    <h3>
                        <span class='glyphicon glyphicon-eye-open'></span>
                        Preview
                        <small>PixiJS v{PIXI.VERSION}</small>
                    </h3>
                    <div class='renderer' id='renderer'></div>
                </div>
                <div class='col-sm-6'>
                    <h3>
                        <span class='glyphicon glyphicon-scissors'></span> JavaScript
                    </h3>
                    <pre class='code-display hljs'>
                        <code class='javascript' onupdate={codeColor} oncreate={codeColor} innerHTML={this.getCode()}></code>
                    </pre>
                </div>
                <div class='col-sm-6'>
                    <h3>
                        <span clasName='glyphicon glyphicon-scissors'></span> JSON
                        <span class='btn-group pull-right'>
                            <button class='btn btn-primary btn-sm' onclick={this.onSave.bind(this)}>
                                <span class='glyphicon glyphicon-save'></span> Save
                            </button>
                            <button class='btn btn-primary btn-sm btn-file'>
                                <span class='glyphicon glyphicon-open'></span>
                                <input type='file' onchange={this.onLoad.bind(this)} /> Load
                            </button>
                        </span>
                    </h3>
                    <pre class='code-display hljs'>
                        <code class='json' onupdate={codeColor} oncreate={codeColor} innerHTML={this.getCode(true)}></code>
                    </pre>
                </div>
                <div class='col-sm-12'>
                    <h3>
                        <span class='glyphicon glyphicon-cog'></span> Options
                    </h3>
                    <div class='well'>
                        <div class='row config'>
                            <label class='col-md-2 col-sm-3'>
                                <span class='glyphicon glyphicon-indent-left'></span>
                                <span class='name'>Indent</span>
                            </label>
                            <div class='col-md-10 col-sm-9'>
                                <select class='form-control input-sm' onchange={this.onFormat.bind(this)} value={this.indent}>
                                    <option value={TextStyleEditor.INDENT.SPACE_4}>4 Spaces</option>
                                    <option value={TextStyleEditor.INDENT.SPACE_3}>3 Spaces</option>
                                    <option value={TextStyleEditor.INDENT.SPACE_2}>2 Spaces</option>
                                    <option value={TextStyleEditor.INDENT.TAB}>Tab</option>
                                    <option value={TextStyleEditor.INDENT.NONE}>No indent</option>
                                    <option value={TextStyleEditor.INDENT.NONE_PRETTY}>No indent (with spaces)</option>
                                </select>
                            </div>
                        </div>
                        <div class='row config'>
                            <label class='col-md-2 col-sm-3'>
                                <span class='glyphicon glyphicon-share'></span>
                                <span class='name'>Share</span>
                            </label>
                            <div class='col-md-10 col-sm-9'>
                                <div class='input-group'>
                                    <span class='input-group-btn'>
                                        <button class='btn btn-sm btn-primary' onclick={this.onShorten.bind(this)}>
                                            Shorten URL
                                        </button>
                                    </span>
                                    <input class='form-control input-sm' type='text' value={this.shortenUrl} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='col-sm-12'>
                    <h3>
                        <span class='glyphicon glyphicon-book'></span> Documentation
                    </h3>
                    <ul>
                        <li><a href='//pixijs.download/release/docs/PIXI.TextStyle.html'>PIXI.TextStyle</a></li>
                        <li><a href='//pixijs.download/release/docs/PIXI.Text.html'>PIXI.Text</a></li>
                        <li><a href='//pixijs.download/release/docs/PIXI.TextMetrics.html'>PIXI.TextMetrics</a></li>
                    </ul>
                </div>
            </main>
        </div>;
    }

    onFormat(element) {
        this.indent = parseInt(element.target.value);
        localStorage.indent = this.indent;
        m.redraw();
    }

    onLoad(event) {
        const input = event.target;
        if (input.files.length !== 1) {
            return;
        }
        if (!/\.json$/.test(input.files[0].name)) {
            alert('Unable to load, must be a JSON file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const style = JSON.parse(reader.result);
                deepCopy(this.style, this.defaults.toJSON());
                deepCopy(this.style, style);
                m.redraw();
                this.app.render();
            }
            catch(e) {
                alert('Unable to parse JSON file');
            }
        };
        reader.readAsText(input.files[0]);
        event.target.value = '';
    }

    onSave() {
        const style = this.style.toJSON();
        for (const name in style) {
            if (deepEqual(style[name], this.defaults[name])) {
                delete style[name];
            }
        }
        const data = JSON.stringify(style, null, this.getIndent());
        const blob = new Blob([data], {
            type: 'text/plain;charset=utf-8'
        });
        saveAs(blob, 'style.json');
    }

    onShorten() {
        const url = 'https://www.googleapis.com/urlshortener/v1/url';
        const key = 'AIzaSyCc-YIpSnyqr3RQcBN8-s-8u8DRXGECon0';
        m.request({
            method: 'POST',
            url: `${url}?key=${key}`,
            data: { longUrl: document.location.href }
        })
            .then((data) => {
                this.shortenUrl = data.id;
            });
    }

    reset() {
        if (!confirm('Are you sure you want to remove all your saved styles?')) {
            return;
        }

        localStorage.removeItem('background');
        localStorage.removeItem('style');
        localStorage.removeItem('text');
        deepCopy(this.style, this.defaults.toJSON());

        this.text.text = this.defaultText;
        this.background = this.defaultBG;
        m.redraw();
        this.app.render();
    }

    saveSnap() {
        if(this._busy) {
            return;
        }
        this._busy = true;
        const alpha = +prompt('Background Alpha', sessionStorage.getItem('snapAlpha')||'1');
        sessionStorage.setItem('snapAlpha', String(alpha));

        const Container = new PIXI.Container();
        const Background = new PIXI.Sprite(PIXI.Texture.WHITE);
        const Text = new PIXI.Text(this.text._text, this.style);
        Background.anchor.set(0.5);
        Background.scale.set(Text.width/Background.width, Text.height/Background.height);
        Background.tint = +('0x'+this.background.split('#')[1]);
        Background.alpha = alpha;
        Text.anchor.set(0.5);
        Container.addChild(Background,Text);

        const SnapSprite = new PIXI.Sprite(this.app.renderer.generateTexture(Container));
        this.app.renderer.extract.canvas(SnapSprite).toBlob((blob)=>{
            const _URL = window.URL || window.webkitURL || URL;
            const a = document.createElement('a');
            a.href = _URL.createObjectURL(blob);
            a.download = Text.text.substring(0, 24) + '.png';
            document.body.append(a);
            a.click();
            a.remove();
            Container.destroy({children:true});
            PIXI.utils.clearTextureCache();
            this._busy = false;
        }, 'image/png');
    }

    set background(color) {
        localStorage.setItem('background', color);
        this.app.renderer.backgroundColor = parseInt(color.slice(1), 16);
    }

    get background() {
        const str = this.app.renderer.backgroundColor.toString(16);
        return '#' + '0'.repeat(6 - str.length) + str;
    }

    resize() {
        const view = this.app.view;
        const width = view.parentNode.clientWidth;
        const height = view.parentNode.clientHeight;
        this.app.renderer.resize(width, height);
        this.text.x = width / 2;
        this.text.y = height / 2;
        this.app.render();
    }

    codeColor(element) {
        hljs.highlightBlock(element.dom);
    }

    getIndent() {
        let indent;
        switch(this.indent) {
            case TextStyleEditor.INDENT.SPACE_4: indent = '    '; break;
            case TextStyleEditor.INDENT.SPACE_3: indent = '   '; break;
            case TextStyleEditor.INDENT.SPACE_2: indent = '  '; break;
            case TextStyleEditor.INDENT.TAB: indent = '\t'; break;
            default: indent = ''; break;
        }
        return indent;
    }

    getCode(jsonOnly) {
        const style = this.style.toJSON();
        for (const name in style) {
            if (deepEqual(style[name], this.defaults[name])) {
                delete style[name];
            }
        }

        const indent = this.getIndent();
        const pretty = TextStyleEditor.INDENT.NONE_PRETTY === this.indent;

        let data = JSON.stringify(style, null, indent);

        if (jsonOnly) {
            if (pretty) {
                return this.prettify(data);
            }
            return data;
        }

        let dataStore = JSON.stringify(style);
        localStorage.setItem('style', dataStore);

        const hash = {};

        if (dataStore !== '{}') {
            hash.style = style;
        }
        if (this.defaultText !== this.text.text) {
            hash.text = this.text.text;
        }
        if (this.defaultBG !== this.background) {
            hash.background = this.background;
        }

        const encoded = Object.keys(hash).length ?
            encodeURIComponent(JSON.stringify(hash)) : '';

        history.replaceState(null, null, `#${encoded}`);

        if (data === '{}') {
            data = '';
        }
        else {
            data = data.replace(/"([^"]+)":/g, '$1:')
                .replace(/"/g, '\'')
                .replace(/'/g, '"');

            if (pretty) {
                data = this.prettify(data);
            }
        }

        const text = this.text.text.replace(/\n/g, '\\n')
            .replace(/'/g, '\\\'');

        return `const style = new PIXI.TextStyle(${data});\n`
            + `const text = new PIXI.Text('${text}', style);`;
    }

    prettify(data) {
        return data.replace(/([{:,])/g, '$1 ').replace(/}$/, ' }');
    }

    onText(text) {
        localStorage.setItem('text', text);
        this.text.text = text;
        this.app.render();
    }

    init() {
        document.getElementById('renderer').appendChild(this.app.view);
        this.app.render();
        this.resize();

        // Listen for resize events
        window.addEventListener('resize', this.resize.bind(this), false);
    }
}

TextStyleEditor.INDENT = {
    NONE: 1,
    NONE_PRETTY: 2,
    TAB: 3,
    SPACE_4: 4,
    SPACE_3: 5,
    SPACE_2: 6
};
