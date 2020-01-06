import m from 'mithril';

/**
 * Dialog that contains the options for saving snapshot
*/
export default class TranslateLabel {
    /** @param {m.Vnode} vnode - ???*/
    /** @param {TextStyleEditor} T - ???*/
    constructor(T) {
        //this.parent = vnode.attrs.parent;
        //this.onclose = vnode.attrs.onclose;
        /**@type {Boolean} - prevent double when wait api */
        this._busy = false;
        this.T = T;
    }

    get text() {
        return this.T.text;
    }

    get app() {
        return this.T.app;
    }

    translate(lanKey){
        if(this._busy){
            return;
        }
        this._busy = true;
        const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate';
        // for now i use a free api, plz read here: https://tech.yandex.com/translate/doc/dg/concepts/api-overview-docpage/
        // this is experimental, and allow ~ monthly limit is 10,000,000 characters if peopel dont spam
        // If people spam, maybe create a box to add personal api key ?
        const keyAPI = 'trnsl.1.1.20200105T231430Z.d549b6f7b6103206.2c4b8c1983761519c17632b7f640a0ccbdeb2349';
        const xhr = new XMLHttpRequest();
        const textAPI = localStorage.getItem('text') || this.text.text;
        const langAPI = lanKey;
        const data = 'key='+keyAPI+'&text='+textAPI.substring(0, 16)+'&lang='+langAPI;
        xhr.open('POST',url,true);
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
        xhr.send(data);
        xhr.onreadystatechange = ()=>{
            if (xhr.readyState===4 && xhr.status===200) {
                const res = xhr.responseText;
                const json = JSON.parse(res);
                if(json.code === 200) {
                    this.text.text = json.text[0];
                }
                else {
                    this.text.text = 'Error Code: ' + json.code;
                }
                m.redraw();
                this.app.render();
                this._busy = false;
            }
        };
    }

    /** @returns {HTMLDivElement} - [add,clear] fonts buttons (mytrill crash) if use template*/
    view() {
        // should be in a return `${htmlCode}`; ?
        return <div>
            <button title='China' class='btn btn-outline-dark btn-file btnTran' onclick={this.translate.bind(this,'zh')}>zh
            </button>
            <button title='English' class='btn btn-outline-dark btn-file btnTran' onclick={this.translate.bind(this,'en')}>en
            </button>
            <button title='Russian' class='btn btn-outline-dark btn-file btnTran' onclick={this.translate.bind(this,'ru')}>ru
            </button>
            <button title='Japanese' class='btn btn-outline-dark btn-file btnTran' onclick={this.translate.bind(this,'ja')}>ja
            </button>
            <button title='Thai' class='btn btn-outline-dark btn-file btnTran' onclick={this.translate.bind(this,'th')}>th
            </button>
            <button title='Portuguese' class='btn btn-outline-dark btn-file btnTran' onclick={this.translate.bind(this,'pt')}>pt
            </button>
            <button title='Arabic' class='btn btn-outline-dark btn-file btnTran' onclick={this.translate.bind(this,'ar')}>ar
            </button>
            <button title='Czech' class='btn btn-outline-dark btn-file btnTran' onclick={this.translate.bind(this,'cs')}>cs
            </button>
        </div>;
    }
}