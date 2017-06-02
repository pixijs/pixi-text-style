'use strict';

/**
 * TextStyle Component for Mithril
 * @class TextStyleEditor
 */
class TextStyleEditor {
        
    constructor() {
        this.app = null;
        this.defaults = new PIXI.TextStyle();
        this.defaultText = 'Hello World';
        this.style = new PIXI.TextStyle();
        this.text = new PIXI.Text(localStorage.text || this.defaultText, this.style);
        this.text.anchor.set(0.5);

        // Restore saved style
        let style = null;

        // Revert from the window hash
        if (document.location.hash) {
            style = JSON.parse(decodeURIComponent(document.location.hash.slice(1)));
        }
        // Revert from the localStorage save
        else if (localStorage.getItem('style')) {
            style = JSON.parse(localStorage.style);
        }

        if (style) {
            for (const prop in style) {
                this.style[prop] = style[prop];
            }
        }

        this.app = new PIXI.Application({
            width: 400,
            height: 100,
            backgroundColor: 0xEEEEEE,
            roundPixels: true,
            resolution: devicePixelRatio
        });
        this.app.stage.addChild(this.text);
        this.app.stop();
    }

    view() {
        const init = this.init.bind(this);
        const onText = this.onText.bind(this);
        const codeColor = this.codeColor.bind(this);
        const resize = this.resize.bind(this);
        const reset = this.reset.bind(this);

        return m('main', {oncreate: init}, [
            m('nav.controls.container-fluid', [
                m('h3.title', 'PixiJS TextStyle'),
                m('h4', 'Text'),
                m('div.row', [
                    m('div.col-sm-12', [
                        m('textarea.form-control#input', {
                            autofocus: true,
                            oninput: m.withAttr('value', onText),
                            value: this.text.text
                        })
                    ])
                ]),
                
                m('h4', 'Font'),
                this.select('fontFamily', 'Font Family', [
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
                ]),
                this.number('fontSize', 'Font Size'),
                this.select('fontStyle', 'Font Style', [
                    'normal',
                    'italic',
                    'oblique'
                ]),
                this.select('fontVariant', 'Font Variant', [
                    'normal',
                    'small-caps'
                ]),
                this.select('fontWeight', 'Font Weight', [
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
                ]),

                m('h4', 'Fill'),
                this.color('fill', 'Color'),
                this.select('fillGradientType', 'Gradient Type', [
                    [0, 'linear vertical'],
                    [1, 'linear horiztonal']
                ]),

                m('h4', 'Stroke'),
                this.color('stroke', 'Color'),
                this.number('strokeThickness', 'Stroke Thickness'),
                this.select('lineJoin', 'Line Join', [
                    'miter',
                    'round',
                    'bevel'
                ]),
                this.number('miterLimit', 'Miter Limit'),

                m('h4', 'Layout'),
                this.number('letterSpacing', 'Letter Spacing'),
                this.select('textBaseline', 'Text Baseline', [
                    'alphabetic',
                    'bottom',
                    'middle',
                    'top',
                    'hanging'
                ]),

                m('h4', 'Drop Shadow'),
                this.checkbox('dropShadow', 'Enable'),
                this.number('dropShadowAlpha', 'Shadow Alpha', 0.1),
                this.number('dropShadowAngle', 'Shadow Angle', 0.1),
                this.number('dropShadowBlur', 'Shadow Blur'),
                this.number('dropShadowDistance', 'Shadow Distance'),
                
                m('h4', 'Multiline'),
                this.checkbox('wordWrap', 'Enable'),
                this.checkbox('breakWords', 'Break Words'),
                this.select('align', 'Align', [
                    'left',
                    'center',
                    'right'
                ]),
                this.number('wordWrapWidth', 'Wrap Width', 10),
                this.number('lineHeight', 'Line Height'),                

                m('h4', 'Texture'),
                this.number('padding', 'Padding'),
                this.checkbox('trim', 'Trim'),
                m('button.btn.btn-danger.btn-block', {
                    onclick: reset
                }, 'Reset')
            ]),
            m('h3', [
                m('span.glyphicon.glyphicon-eye-open'),
                m('span', 'Preview')
            ]),
            m('div.renderer#renderer'),
            m('h3', [
                m('span.glyphicon.glyphicon-scissors'),
                m('span', 'Sample Code')
            ]),
            m('pre.code-display.hljs', [
                m('code.javascript', {
                    onupdate: codeColor,
                    oncreate: codeColor,
                    innerHTML: this.getCode()
                })
            ]),
            m('h3', [
                m('span.glyphicon.glyphicon-book'),
                m('span', 'Documentation')
            ]),
            m('ul', [
                m('li', [
                    m('a', {href: '//pixijs.download/release/docs/PIXI.TextStyle.html'}, 'PIXI.TextStyle')
                ]),
                m('li', [
                    m('a', {href: '//pixijs.download/release/docs/PIXI.Text.html'}, 'PIXI.Text')
                ]),
                m('li', [
                    m('a', {href: '//pixijs.download/release/docs/PIXI.TextMetrics.html'}, 'PIXI.TextMetrics')
                ])
            ])
        ]);
    }

    select(id, name, options) {
        return m(StyleSelect, { parent: this, id, name, options });
    }

    number(id, name, step) {
        return m(StyleNumber, { parent: this, id, name, step });
    }

    checkbox(id, name) {
        return m(StyleCheckbox, { parent: this, id, name });
    }

    color(id, name) {
        return m(StyleColor, { parent: this, id, name });
    }

    reset() {
        localStorage.removeItem('style');
        localStorage.removeItem('text');
        const style = this.defaults.toJSON();
        for (const prop in style) {
            this.style[prop] = style[prop];
        }
        this.text.text = this.defaultText;
        m.redraw();
        this.app.render();
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

    getCode() {
        const style = this.style.toJSON();
        for (const name in style) {
            if (style[name] === this.defaults[name]) {
                delete style[name];
            }
        }
        let data = JSON.stringify(style, null, '    ');
        let dataStore = JSON.stringify(style);
        localStorage.setItem('style', dataStore);
        document.location.hash = '#' + encodeURIComponent(dataStore);

        if (data === '{}') {
            data = '';
        }
        else {
            data = data.replace(/\"([^\"]+)\"\:/g, '$1:')
                .replace(/\"/g, "'")
                .replace(/\\'/g, '"');
        }

        const text = this.text.text.replace(/\n/g, '\\n')
            .replace(/\'/g, '\\\'');

        return `const style = new PIXI.TextStyle(${data});\n`
            + `const text = new PIXI.Text('${text}', style);`;
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