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
            result[field] = this[field];
        }
    }
    return result;
};
