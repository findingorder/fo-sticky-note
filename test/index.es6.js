// console.info('index.es6.js: Start')

// Uses a symlink to the ../dist directory.
import FoStickyNote from './dist/fo-sticky-note-bundle.js'

var vueModel = new Vue({
    el: '#app',
    components: {
        FoStickyNote
    },
    methods: {
    //     noteOnChange(e) {
    //         console.info('index.es6.js: noteOnChage(): Fired!')
    //     },
        handleTitleChange(newTitle) {
            console.info('index.es6.js: handleTitleChange(): Fired! newTitle = ')
            console.info(newTitle)    
        },
        handleNoteChange(newNote) {
            console.info('index.es6.js: handleNoteChange(): Fired! newNote = ')
            console.info(newNote)        
        }        
    }
})

var gridstackOptions = {
    verticalMargin: 10
}

$('.grid-stack').gridstack(gridstackOptions)

// function noteOnChange(e) {
//     console.info('index.es6.js: noteOnChage(): Fired!')
// }


// console.info('index.es6.js: End')