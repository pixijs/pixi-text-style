'use strict';

const $ = document.querySelector.bind(document);

PIXI.TextStyle.prototype.toJSON = function() {
    const result = {};
    for(const n in this) {
        if (n.indexOf('_') === 0) {
            const field = n.slice(1);
            result[field] = this[field];
        }
    }
    return result;
};

/**
 * Base control for style elements
 * @class StyleControl
 */
class StyleControl {
    constructor(vnode) {
        this.parent = vnode.attrs.parent;
        this.id = vnode.attrs.id;
        this.name = vnode.attrs.name;
    }
    view() {
        const id = this.id;
        // Wrap around all elements
        return m('div.row', [
            m('label.col-sm-5', {for: id, title: id}, this.name),
            m('div.col-sm-7', [ this.init() ])
        ]);
    }
    update(value) {
        if (/^\-?\d+$/.test(value)) {
            value = parseInt(value);
        }
        else if(/^\-?\d*\.\d+$/.test(value)) {
            value = parseFloat(value);
        }
        this.parent.style[this.id] = value;
        this.parent.app.render();
    }

    init() {
        // override
    }
}

/**
 * Select element with options
 * @class StyleSelect
 * @extends StyleControl
 */
class StyleSelect extends StyleControl {
    constructor(vnode) {
        super(vnode);
        this.options = vnode.attrs.options.map(value => {
            name = value;
            if (Array.isArray(value)) {
                name = value[1];
                value = String(value[0]);
            }
            return m('option', {value: value}, name);
        });
    }
    init() {
        return m('select.form-control.input-sm#'+this.id, {
            key: this.id,
            oninput: m.withAttr('value', (value) => {
                this.update(value);
            }),
            value: this.parent.style[this.id]
        },
        this.options);
    }
}

/**
 * Input checkbox with boolean output
 * @class StyleCheckbox
 * @extends StyleControl
 */
class StyleCheckbox extends StyleControl {
    init() {
        return m('input.check[type=checkbox]#'+this.id, {
            key: this.id,
            onchange: m.withAttr('checked', (value) => {
                this.update(value);
            }),
            checked: this.parent.style[this.id]
        });
    }
}

/**
 * Input number selector
 * @class StyleNumber
 * @extends StyleControl
 */
class StyleNumber extends StyleControl {
    init() {
        return m('input.form-control.input-sm.number[type=number]#'+this.id, {
            key: this.id,
            oninput: m.withAttr('value', (value) => {
                this.update(value);
            }),
            value: this.parent.style[this.id]
        });
    }
}

/**
 * TextStyle Component for Mithril
 * @class TextStyleComponent
 */
class TextStyleComponent {
        
    constructor() {
        this.app = null;
        this.defaults = new PIXI.TextStyle();
        this.defaultText = 'Hello World';
        this.style = new PIXI.TextStyle();
        this.text = new PIXI.Text(localStorage.text || this.defaultText, this.style);
        this.text.anchor.set(0.5);

        // Restore saved style
        if (localStorage.getItem('style')) {
            const style = JSON.parse(localStorage.style);
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
        const colors = [
            'black',
            'white',
            'silver',
            'red',
            'maroon',
            'yellow',
            'olive',
            'lime',
            'green',
            'aqua',
            'teal',
            'blue',
            'navy',
            'fuchsia',
            'purple'
        ];

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
                    'Verdana'
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
                this.select('fill', 'Color', colors),
                this.select('fillGradientType', 'Gradient Type', [
                    [0, 'linear vertical'],
                    [1, 'linear horiztonal']
                ]),

                m('h4', 'Stroke'),
                this.select('stroke', 'Color', colors),
                this.number('strokeThickness', 'Stroke Thickness'),

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
                this.number('dropShadowAlpha', 'Shadow Alpha'),
                this.number('dropShadowAngle', 'Shadow Angle'),
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
                this.number('wordWrapWidth', 'Wrap Width'),
                this.number('lineHeight', 'Line Height'),

                m('h4', 'Advanced'),
                this.select('lineJoin', 'Line Join', [
                    'miter',
                    'round',
                    'bevel'
                ]),
                this.number('miterLimit', 'Miter Limit'),

                m('h4', 'Texture Options'),
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

    number(id, name) {
        return m(StyleNumber, { parent: this, id, name });
    }

    checkbox(id, name) {
        return m(StyleCheckbox, { parent: this, id, name });
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
        localStorage.setItem('style', data);
        if (data === '{}') {
            data = '';
        }
        else {
            data = data.replace(/\"([^\"]+)\"\:/g, '$1:')
                .replace(/\"/g, "'");
        }
        const text = this.text.text.replace(/\n/g, '\\n');
        return `const style = new PIXI.TextStyle(${data});\n`
            + `const text = new PIXI.Text("${text}", style);`;
    }

    onText(text) {
        localStorage.setItem('text', text);
        this.text.text = text;
        this.app.render();
    }

    init() {

        $('#renderer').appendChild(this.app.view);
        this.app.render();
        this.resize();

        // Listen for resize events
        window.addEventListener('resize', this.resize.bind(this), false);
    }
}

window.addEventListener('load', function() {
    m.mount(document.body, new TextStyleComponent());
});
