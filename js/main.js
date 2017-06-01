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
                m('h3.title', [
                    m('a', {href:'//pixijs.download/release/docs/PIXI.TextStyle.html'}, 'PixiJS TextStyle')
                ]),
                m('div.row', [
                    m('label.col-sm-12', {for: 'input'}, 'Text'),
                    m('div.col-sm-12', [
                        m('textarea.form-control#input', {
                            autofocus: true,
                            oninput: m.withAttr('value', onText),
                            value: this.text.text
                        })
                    ])
                ]),
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
                this.select('align', 'Align', [
                    'left',
                    'center',
                    'right'
                ]),
                this.select('fill', 'Fill', colors),
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
                this.select('lineJoin', 'Line Join', [
                    'miter',
                    'round',
                    'bevel'
                ]),
                this.number('miterLimit', 'Miter Limit'),
                this.select('textBaseline', 'Text Baseline', [
                    'alphabetic',
                    'bottom',
                    'middle',
                    'top',
                    'hanging'
                ]),
                this.select('stroke', 'Stroke', colors),
                this.number('strokeThickness', 'Stroke Thickness'),
                this.number('fillGradientType', 'Gradient Type'),
                this.number('letterSpacing', 'Letter Spacing'),
                this.number('lineHeight', 'Line Height'),
                this.number('padding', 'Padding'),
                this.number('dropShadowAlpha', 'Shadow Alpha'),
                this.number('dropShadowAngle', 'Shadow Angle'),
                this.number('dropShadowBlur', 'Shadow Blur'),
                this.number('dropShadowDistance', 'Shadow Distance'),
                this.number('wordWrapWidth', 'Wrap Width'),
                this.checkbox('wordWrap', 'Work Wrap'),
                this.checkbox('dropShadow', 'Drop Shadow'),
                this.checkbox('breakWords', 'Break Works'),
                this.checkbox('trim', 'Trim'),
                m('button.btn.btn-warning.btn-block', {
                    onclick: reset
                }, 'Reset')
            ]),
            m('div.renderer', [
                m('canvas#renderer')
            ]),
            m('pre.code-display.hljs', [
                m('code.javascript', {
                    onupdate: codeColor,
                    oncreate: codeColor,
                    innerHTML: this.getCode()
                })
            ])
        ]);
    }

    checkbox(prop, name) {
        const attr = {
            onchange: m.withAttr('checked', (value) => {
                this.style[prop] = value;
                this.app.render();
            }),
            checked: this.style[prop]
        };

        return m('div.row', [
            m('label.col-sm-5', { for: prop, title: prop }, name),
            m('div.col-sm-7', [
                m('input.check[type=checkbox]#' + prop, attr),
            ])
        ]);
    }

    select(prop, name, options) {
        const attr = {
            oninput: m.withAttr('value', (value) => {
                this.style[prop] = value;
                this.app.render();
            }),
            value: this.style[prop]
        };

        return m('div.row', [
            m('label.col-sm-5', {for: prop, title: prop}, name),
            m('div.col-sm-7', [
                m('select.form-control.input-sm#'+prop, attr, options.map(value => {
                    return m('option', value);
                }))
            ])
        ]);
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

    number(prop, name) {
        const attr = {
            oninput: m.withAttr('value', (value) => {
                this.style[prop] = parseFloat(value);
                this.app.render();
            }),
            value: this.style[prop]
        };

        return m('div.row', [
            m('label.col-sm-5', { for: prop, title: prop }, name),
            m('div.col-sm-7', [
                m('input.form-control.input-sm.number[type=number]#' + prop, attr),
            ])
        ]);
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
        let data = JSON.stringify(style, null, '  ');
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
        this.app = new PIXI.Application({
            width: 400,
            height: 100,
            backgroundColor: 0xEEEEEE,
            resolution: devicePixelRatio,
            view: $('#renderer')
        });
        this.app.stage.addChild(this.text);
        this.app.stop();
        this.app.render();
        this.resize();

        // Listen for resize events
        window.addEventListener('resize', this.resize.bind(this), false);
    }
}

window.addEventListener('load', function() {
    m.mount(document.body, new TextStyleComponent());
});
