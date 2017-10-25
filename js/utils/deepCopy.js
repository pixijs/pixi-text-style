'use strict';

function deepCopy(target, source) {
    for (const prop in source) {
        if (Array.isArray(source[prop])) {
            target[prop] = source[prop].slice();
        } else if (source[prop] && typeof source[prop] === 'object') {
            Object.assign(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }
    }
}
