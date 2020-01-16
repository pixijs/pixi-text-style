import m from 'mithril';

/**
 * Dialog that contains the options for saving snapshot
*/
export default class FontsLoader {

    /** LocalFonts stored with prefix */
    static get PREFIX () {
        return 'lf_';
    }

    /** default font */
    static get DEFAULT() {
        return 'Arial';
    }

    /** @param {m.Vnode} vnode*/
    constructor(vnode) {
        /**@type {Boolean} - prevent double click when loadind fonts */
        this._loading = false;
        this.onrender = vnode.attrs.onrender;
        this.text = vnode.attrs.text;
        this.initialize();
    }

    /** When page load, get all cache fonts base64 from localStorage */
    initialize (){
        Object.keys(localStorage)
            .filter(k => k.indexOf(FontsLoader.PREFIX) > -1)
            .forEach(k => {
                const name = k.split(FontsLoader.PREFIX)[1];
                this.addFont(name, localStorage.getItem(k), true);
            });
    }

    onLoadFont(event, initializing) {
        if (this._loading) {
            return;
        }
        this._loading = true;
        const input = event.target;
        const file = input.files[0];
        const name = file.name.split('.')[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            this.addToLocalStorage(FontsLoader.PREFIX + name, e.target.result);
            this.addFont(name, e.target.result, initializing);
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    addToLocalStorage(key, hashBase64){
        try {
            localStorage.setItem(key, hashBase64);
        }
        catch (error) {
            alert('addToLocalStorage failed. Your local storage is full or your font exceeds the limit!\nThe fonts will NOT BE SAVED in your local cache.');
        }
    }

    addFont(name, hashBase64, initializing) {
        const font = new FontFace(name, 'url('+hashBase64+')',{ style: 'normal', weight: 700 });
        font.load().then((loadedFontFace) => {
            document.fonts.add(loadedFontFace);
            // TODO: fix with React, bad way to update state
            const el = document.getElementById('fontFamily');
            const o = document.createElement('option');
            o.text = name;
            o.value = name;
            el.add(o);
            if (!initializing) {
                this.text.style.fontFamily = name;
            }
            this.text.updateText(); // force a texture update now that custom font has loaded
            m.redraw();
            this.onrender();
            this._loading = false;
        }).catch(function(error) {
            alert('addFont failed. Maybe the font you are trying to load is too big?\n'+error);
            this._loading = false;
        });
    }

    clearFonts() {
        Object.keys(localStorage)
            .filter(k => k.indexOf(FontsLoader.PREFIX) > -1)
            .forEach(k => {
                const name = k.split(FontsLoader.PREFIX)[1];
                const el = document.getElementById('fontFamily');
                const o = el.querySelector('option[value='+name+']');
                el.removeChild(o);
                localStorage.removeItem(k);
            });
        this.text.style.fontFamily = FontsLoader.DEFAULT;
        m.redraw();
        this.onrender();
    }

    /** @returns {HTMLDivElement} */
    view() {
        return <div class="row font-loader">
            <label class="col-xs-5"></label>
            <div class="col-xs-7">
                <div class='btn-group btn-group-xs btn-group-full'>
                    <button title='Add local custom fonts' class='btn btn-primary btn-file'>
                        <span class='glyphicon glyphicon-open'></span>
                        <input type='file' onchange={this.onLoadFont.bind(this)} />
                        <small> Add</small>
                    </button>
                    <button title='Clear all customs fonts' class='btn btn-primary' onclick={this.clearFonts.bind(this)}>
                        <span class='glyphicon glyphicon-erase'></span>
                        <small> Clear</small>
                    </button>
                </div>
            </div>
        </div>;
    }
}
