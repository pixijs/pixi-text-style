import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import eslint from 'rollup-plugin-eslint';
import copy from 'rollup-plugin-copy';
import cssnano from 'cssnano';

const sourcemap = process.argv.indexOf('--sourcemap') > -1;
const compiled = (new Date()).toUTCString().replace(/GMT/g, 'UTC')

export default {
    input: 'src/index.js',
    output: {
        format: 'iife',
        file: 'dist/bundle.js',
        sourcemap,
        banner: `/*! PixiJS TextStyle (${compiled}) */`
    },
    plugins: [
        copy({
            'src/index.html': 'dist/index.html'
        }),
        eslint({
            throwOnError: true,
            throwOnWarning: true,
            include: 'src/**.js'
        }),
        postcss({
            plugins: [cssnano],
            sourceMap: sourcemap,
            extract: true
        }),
        buble(),
        uglify({
            mangle: true,
            compress: true,
            output: {
                comments(node, comment)
                {
                    return comment.line === 1;
                },
            },
        })
    ]
}