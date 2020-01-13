import m from 'mithril';

/**
 * Dialog that contains the options for saving snapshot
*/
export default class FontsLoader {

    /** LocalFonts stored with prefix */
    static get PREFIX () {
        return 'lf_';
    }

    /** @param {m.Vnode} vnode*/
    constructor(vnode) {
        /**@type {Boolean} - prevent double click when loadind fonts */
        this._loading = false;
        this.onrender = vnode.attrs.onrender;
        this.style = vnode.attrs.style;
        this.initialize();
    }

    /** When page load, get all cache fonts base64 from localStorage */
    initialize (){
        const storageFontsName = Object.keys(localStorage)
            .filter(k=>k.indexOf(FontsLoader.PREFIX)>-1);
        for (let i = 0, l = storageFontsName.length; i < l; i++) {
            const name = storageFontsName[i].split(FontsLoader.PREFIX)[1];
            const hashBase64 = localStorage.getItem(storageFontsName[i]);
            this.addFont(name, hashBase64);
        }
    }

    onLoadFont(event) {
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
            this.addFont(name,e.target.result);
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    addToLocalStorage(key, hashBase64){
        try {
            localStorage.setItem(key, hashBase64);
        }
        catch (error) {
            alert('Warning your local storage is full or your font exeed limit!\nThe fonts will NOT BE SAVED in your local cache.');
        }
    }

    addFont(name,hashBase64) {
        const font = new FontFace(name, 'url('+hashBase64+')',{ style: 'normal', weight: 700 });
        font.load().then((loadedFontFace) => {
            document.fonts.add(loadedFontFace);
            const el = document.getElementById('fontFamily');
            const o = document.createElement('option');
            o.text = name;
            o.value = name;
            el.add(o);
            this.style.fontFamily = name;
            m.redraw();
            this.onrender();
            this._loading = false;
        }).catch(function(error) {
            alert('The font you\'re trying to load maybe too big.\n'+error);
            this._loading = false;
        });
    }

    clearFonts() {
        const storageFonts = Object.keys(localStorage)
            .filter(k => k.indexOf(FontsLoader.PREFIX) > -1);
        for (let i = 0, l = storageFonts.length; i < l; i++) {
            const name = storageFonts[i];
            localStorage.removeItem(name);
        }
        this.style.fontFamily = 'Arial';
        m.redraw();
        location.reload();
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