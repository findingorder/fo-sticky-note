// rollup.config.js
import resolve  from 'rollup-plugin-node-resolve'

import commonjs from 'rollup-plugin-commonjs'
import svg      from 'rollup-plugin-svg'
import postcss  from 'rollup-plugin-postcss'
import vue      from 'rollup-plugin-vue'

export default {
    input: 'fo-sticky-note-merged.js',
    output: {
        file: '../dist/fo-sticky-note-bundle.js',
        format: 'es'
    },
    plugins: [ 
        resolve({
            browser: true
        }),
        vue(),
        commonjs(),
        svg(),
        postcss({
            plugins: []
        })
    ]
}

