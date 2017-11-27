import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';

export default {
    input: 'src/index.js',
    output: {
        format: 'iife',
        file: 'dist/bundle.js',
        sourcemap: true
    },
    plugins: [
        postcss({
            plugins: [cssnano],
            sourceMap: true,
            extract: true
        }),
        buble(),
        uglify()
    ]
}