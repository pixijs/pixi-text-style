export default function deepCopy(target, source) {
    for (const prop in source) {
        if (Array.isArray(source[prop])) {
            target[prop] = source[prop].slice();
        } else {
            target[prop] = source[prop];
        }
    }
}
