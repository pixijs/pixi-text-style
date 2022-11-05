import './mixins/TextStyle';
import TextStyleEditor from './TextStyleEditor';
import m from 'mithril';

// On window load, start the mithril component mount
window.addEventListener('load', function() {
    m.mount(document.body, TextStyleEditor);
});
