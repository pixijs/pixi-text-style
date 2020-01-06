import m from 'mithril';

/**
 * Dialog that contains the options for saving snapshot
*/
export default class FontsLoader {
    /** @param {m.Vnode} vnode - ???*/
    /** @param {TextStyleEditor} T - ???*/
    constructor(T) {
        //this.parent = vnode.attrs.parent;
        //this.onclose = vnode.attrs.onclose;
        /**@type {Boolean} - prevent double click when loadind fonts */
        this._loading = false;
        this.T = T;
        this.initialize();
    }

    get style() {
        return this.T.style;
    }

    get app() {
        return this.T.app;
    }

    /** Wehn page load, get all cache fonts base64 from localStorage*/
    initialize (){
        // note: LocalFonts stored with prefixe `lf_`
        const storageFonts = Object.keys(localStorage).filter(k=>k.indexOf('lf_')>-1);
        for (let i = 0, l = storageFonts.length; i < l; i++) {
            const name = storageFonts[i].split('lf_')[1];
            const hashBase64 = localStorage.getItem(name);
            this.addFont(name, hashBase64);
        }
    }

    onLoadFont(event) {
        if(this._loading){
            return;
        }
        this._loading = true;
        const input = event.target;
        const file = input.files[0];
        const name = file.name.split('.')[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            this.addToLocalStorage('lf_'+name,e.target.result);
            this.addFont(name,e.target.result);
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    addToLocalStorage(key,hashBase64){
        try {
            localStorage.setItem(key, hashBase64);
        }
        catch (error) {
            alert('Warning your local storage is full or your font exeed limit!\nThe fonts will NOT SAVED in your local cache.');
        }
    }

    addFont(name,hashBase64){
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
            this.app.render();
            this._loading = false;
        }).catch(function(error) {
            alert('The FONT your tring loak are maybe too big, FontFace cant load.\n'+error);
            this._loading = false;
        });
    }

    clearFonts(){
        const storageFonts = Object.keys(localStorage).filter(k=>k.indexOf('lf_')>-1);
        for (let i = 0, l = storageFonts.length; i < l; i++) {
            const name = storageFonts[i];
            localStorage.removeItem(name);
        }
        this.T.style.fontFamily = 'Arial';
        m.redraw();
        location.reload();
    }

    /** @returns {HTMLDivElement} - [add,clear] fonts buttons (mytrill crash) if use template*/
    view() {
        // should be in a return `${htmlCode}`; ?
        return <div class="row fontLoader">
            <label class="col-xs-5"></label>
            <div class="col-xs-7">
                <button title='Add local custom fonts' class='btn btn-outline-dark btn-file btnFont'>
                    <span class='glyphicon glyphicon-open'></span>
                    <input type='file' onchange={this.onLoadFont.bind(this)} /> Add
                </button>
                <button title='Clear all customs fonts' class='btn btn-outline-dark btn-file btnFont' onclick={this.clearFonts.bind(this)}>Clear
                    <span class='glyphicon glyphicon-erase'></span>
                </button>
            </div>
        </div>;
    }
}