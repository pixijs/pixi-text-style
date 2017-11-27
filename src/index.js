import './index.css';
import './mixins/TextStyle';
import TextStyleEditor from './TextStyleEditor';

// On window load, start the mithril component mount
window.addEventListener('load', function() {
    m.mount(document.body, TextStyleEditor);
});
