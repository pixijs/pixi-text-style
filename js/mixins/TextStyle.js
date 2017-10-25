'use strict';

/**
 * Add a `toJSON` function for TextStyle
 * to more easily do the serialization
 * @mixin
 */
PIXI.TextStyle.prototype.toJSON = function() {
    const result = {};
    for(const n in this) {
        if (n.indexOf('_') === 0) {
            const field = n.slice(1);

            if (Array.isArray(this[field])) {
                result[field] = this[field].slice();
            } else if (this[field] && typeof this[field] === 'object') {
                Object.assign(result[field], this[field]);
            } else {
                result[field] = this[field];
            }
        }
    }
    return result;
};
