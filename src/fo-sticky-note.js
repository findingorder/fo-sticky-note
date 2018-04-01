// console.info("fo-sticky-note.es6.js: Start")

// PUNCH LIST
// DONE: Add line height attribute to fo-markdown-note and fo-sticky-note.
// --------------------------------------------------------------------------------
// TODO: Use autokey to run Ctrl-S, Shift-Ctrl-B, Ctrl-J combination
// TODO: Make title editable.
// TODO: Use ems instead of pixels everywhere.
// TODO: Close button
// TODO: Menu button and drop-down menu; drop-down menu should be fully configurable
// TODO: Color picker: http://xiaokaike.github.io/vue-color/

import FoMarkdownNote from 'fo-markdown-note'

// https://github.com/Akryum/vue-resize
import './node_modules/vue-resize/dist/vue-resize.css'
import { ResizeObserver } from 'vue-resize'
import './lib/jquery-autogrow-textarea.js'


export default {
    components: {
        FoMarkdownNote,
        ResizeObserver
    },

    // Props are component data that can be set in the html tag using attributes.
    
    props: {
        id: String, 
        backgroundColor: {
            // Corresponding attribute: background-color
            type: String,
            default: '#f3f3f3'
        }, 
        color: {
            type: String,
            default: '#000'
        },
        fontFamily: {
            // Corresponding attribute: font-family
            type: String,
            default: 'Arial, Helvetica, "DejaVu Sans", sans-serif'
        },
        fontSize: {
            // Corresponding attribute: font-size
            type: String,
            default: '14px'
        },
        lineHeight: {
            type: String,
            default: '1.2'
        },
        note: String,
        noteTitle: {
            type: String,
            default: 'Title'
        }
    },

    data() { return {
        blurHandlerEnabled:     true,
        foMarkdownNote:         null,
        foMarkdownNoteId:       this.id + '-markdown-note',
        markdownDiv:            null,
        markdownDivId:          this.id + '-markdown-div',
        titleBackgroundColor:   this.backgroundColor,
        titleDiv:               null,
        titleDivId:             this.id + '-title-div',
        titleInput:             null,
        titleInputId:           this.id + '-title-input',
        vueOuterDiv:            null
    }},

    // In the template we set the id of the outer div to be the same as the id of the vue component.
    // Code inside the component should see this as unique and should not confuse it with the vue component itself.

    template: `
        <div :id='id' 
            class='outer-div'>

            <div 
                :id='titleDivId' 
                class='title-div' 
                :title='noteTitle' 
                ref='titleDiv'
                v-on:click='titleDivOnClick'
            >{{noteTitle}}</div>

            <div :id='markdownDivId' class='markdown-div' ref='markdownDiv'>
                <fo-markdown-note 
                    :id='foMarkdownNoteId'
                    v-bind:note='note' 
                    v-bind:background-color='backgroundColor'
                    v-bind:color='color'
                    v-bind:line-height='lineHeight'
                    v-bind:font-family='fontFamily'
                    v-bind:font-size='fontSize'>
                </fo-markdown-note>
            </div>

            <textarea 
                :id='titleInputId' 
                class='title-textarea' 
                ref='titleTextarea' 
                :title='noteTitle' 
                placeholder='Title' 
                rows='1'
                v-on:blur='titleInputOnBlur'
                v-on:keydown='titleInputOnKeyDown'
                v-model='noteTitle' 
                style='visibility: hidden;'
            ></textarea>

            <resize-observer id='outer-div-resize-observer' @notify='outerDivOnResize' />
        </div>
    `,

    // style="visibility: hidden;"

    // EXAMPLE FROM PREVIOUS CODE
    // <div :id="outerDivId" v-on:drag="stickyNoteOnMouseDrag" v-on:mousedown="stickyNoteOnMouseDown" v-on:mouseup="stickyNoteOnMouseUp">

    //     <div :id="titleDivId" :class="titleDivId" :title="title" style="z-index: 10;">
    //         {{title}}
    //     </div>

    //     <i :id="closeButtonId" class="fa fa-close close-button" title="Close" style="z-index: 20;"></i>
    //     <i :id="menuButtonId" class="fa fa-bars menu-button" v-on:click="stickyNoteOnMenuButtonClick" title="Menu" style="z-index: 20;"></i>

    //     <div :id="menuId" style="z-index: 20;">
    //         <div :id="menuChoiceColorId" class="menu-choice menu-choice-color" style="z-index: 30;">Color</div>
    //     </div>

    //     <textarea :id="elementId" style="z-index: 0;">{{note}}</textarea>
    //     <textarea :id="titleInputId" v-model="title" :title="title" placeholder="Title" @blur="titleInputOnBlur" style="visibility: hidden; z-index: 10;"></textarea>
    // </div>

    mounted() {
        // console.info('fo-sticky-note.es6.js: mounted(): Start')

        // Initialize convenience references.
    
        this.markdownDiv    = document.getElementById(this.markdownDivId)
        this.foMarkdownNote = document.getElementById(this.foMarkdownNoteId)
        this.titleDiv       = document.getElementById(this.titleDivId)
        this.titleInput     = document.getElementById(this.titleInputId)
        this.vueOuterDiv    = document.getElementById(this.id)

        // console.info('fo-sticky-note.es6.js: mounted(): this.foMarkdownNoteId = ' + this.foMarkdownNoteId)
        // console.info('fo-sticky-note.es6.js: mounted(): this.foMarkdownNote = ')
        // console.info(this.foMarkdownNote)

        this.initializeColors()
        this.initializeResizeObserver()
        this.initializeTitleStyles()
        this.initializeMarkdownStyles()
        this.initializeVueOuterDivStyles()

        // Wait a short time until the browser is able to display and resize the markdown div.

        // TODO: Instead of using setTimeout, implement a 'componentReady' event in fo-markdown-note that we can 
        // use to definitively determine that the markdown note is visible.

        setTimeout(() => { 
            this.resizeElements()
        }, 600) // 600 because fo-markdown-note waits 500 before making itself visible.
        
        // console.info('fo-sticky-note.es6.js: mounted(): End')
    },

    methods: {

        initializeColors() {
            // console.info('fo-sticky-note.js: initializeColors(): this.backgroundColor = ' + this.backgroundColor)

            // We need to get a color that is an object, not a string. Do this by setting the color of an element,
            // then getting its computed style.

            let mds = this.markdownDiv.style
            mds.backgroundColor = this.backgroundColor
            let computedColor = getComputedStyle(this.markdownDiv).backgroundColor
            // console.info('fo-sticky-note.js: initializeColors(): computedColor = ' + computedColor)

            let computedColorString = this.rgb2hex(computedColor)
            // shadeColor takes a string that has EXACTLY seven characters, e.g. "#FF00FF".
            this.titleBackgroundColor = this.shadeColor(computedColorString, -0.1)

            // TODO: Compute button colors, hover colors, etc.
            // TODO: If a text color is not provided, compute it based on darkness of background color.
        },

        initializeResizeObserver() {

            // console.info('fo-sticky-note.es6.js: initializeResizeObservers(): this.vueOuterDiv = ')
            // console.info(this.vueOuterDiv)

            let resizeObserver = document.getElementById('outer-div-resize-observer')
            resizeObserver.style.position = 'relative'

        },

        initializeMarkdownStyles() {
            let mds = this.markdownDiv.style
                mds.backgroundColor = 'transparent'
                mds.top = this.titleDiv.style.height
                // mds.top = this.titleInput.offsetHeight
                mds.position = 'absolute'
                mds.height = '100%'
                mds.width = '100%'
                mds.zIndex = 0

            let fmns = this.foMarkdownNote.style
                fmns.position = 'absolute'
                fmns.width = '100%'
                fmns.zIndex = 0

            // console.info('fo-sticky-note: initializeMarkdownStyles(): this.foMarkdownNote =')
            // console.info(this.foMarkdownNote)

        },

        initializeTitleStyles() {
            let tds = this.titleDiv.style
                tds.width = '100%'
                tds.position = 'absolute'
                tds.fontSize = this.fontSize
                tds.fontFamily = this.fontFamily
                tds.padding = '6px 10px 6px 10px' // top right bottom left
                tds.backgroundColor = this.titleBackgroundColor
                tds.color = this.color
                tds.cursor = 'default'
                tds.boxSizing = 'border-box'
                tds.zIndex = 20

            let tis = this.titleInput.style
                tis.position = 'absolute'
                tis.top = '0'
                tis.fontSize = this.fontSize
                tis.fontFamily = this.fontFamily
                tis.backgroundColor = this.titleBackgroundColor
                tis.color = this.color
                tis.border = 'none'
                tis.borderWidth = '0'
                tis.height = this.titleDiv.offsetHeight + 'px'
                tis.minHeight = this.titleDiv.offsetHeight + 'px'
                tis.minWidth = this.titleDiv.offsetWidth + 'px'
                tis.maxWidth = this.titleDiv.offsetWidth + 'px'
                tis.padding = '5px 10px 0px 10px' // top right bottom left
                tis.width = '100%'
                tis.verticalAlign = 'top'
                tis.resize = 'none'
                tis.boxSizing = 'border-box'
                tis.zIndex = 10

            $(this.titleInput).autogrow()
        },

        initializeVueOuterDivStyles() {
            // console.info('fo-sticky-note: initializeVueOuterDivStyles(): Start')

            let ods = this.vueOuterDiv.style
                ods.width = '100%'

            // console.info('fo-sticky-note: initializeVueOuterDivStyles(): End')
        },

        outerDivOnResize() {
            // console.info('fo-sticky-note: outerDivOnResize(): Fired!')

            this.resizeElements()
        },

        resizeElements() {
            // Get the dimensions from which others will be derived.

            // console.info('fo-sticky-note: resizeElements(): this.markdownDiv = ')
            // console.info(this.markdownDiv)

            // let titleHeight = this.titleDiv.offsetHeight
            // let markdownDivHeight = this.markdownDiv.offsetHeight
            // let markdownDivWidth = this.markdownDiv.offsetWidth

            let titleHeight = this.$refs.titleDiv.offsetHeight
            let markdownDivHeight = this.$refs.markdownDiv.offsetHeight
            let markdownDivWidth = this.$refs.markdownDiv.offsetWidth

            console.info('fo-sticky-note: resizeElements(): titleHeight = ' + titleHeight)
            // console.info('fo-sticky-note: resizeElements(): markdownDivHeight = ' + markdownDivHeight)
            // console.info('fo-sticky-note: resizeElements(): markdownDivWidth = ' + markdownDivWidth)

            // Derived dimensions.

            let markdownNoteTop = titleHeight
            let markdownNoteHeight = markdownDivHeight - titleHeight

            // Set the dimensions.

            let fmns = this.foMarkdownNote.style
                fmns.top = markdownNoteTop + 'px'
                fmns.height = markdownNoteHeight + 'px'

            // this.setTextareaHeight(this.titleInput, titleHeight)

            this.titleInput.style.height = titleHeight

        },

        setTextareaHeight(ta, height) {
            // Sets the outer height of a textarea control, taking into consideration its padding.

            // console.info('fo-sticky-note.js: setTextareaSize(): height = ' + height)
            // console.info('fo-sticky-note.js: setTextareaSize(): width = ' + width)

            // let taPaddingTop = parseInt(ta.style.paddingTop)
            // console.info('fo-sticky-note.js: setTextareaSize(): taPaddingTop = ' + taPaddingTop)
            // let taPaddingBottom = parseInt(ta.style.paddingBottom)
            // console.info('fo-sticky-note.js: setTextareaSize(): taPaddingBottom = ' + taPaddingBottom)
            // let taPaddingLeft = parseInt(ta.style.paddingLeft)
            // console.info('fo-sticky-note.js: setTextareaSize(): taPaddingLeft = ' + taPaddingLeft)
            // let taPaddingRight = parseInt(ta.style.paddingRight)
            // console.info('fo-sticky-note.js: setTextareaSize(): taPaddingRight = ' + taPaddingRight)

            // let desiredHeight = height - taPaddingTop  - taPaddingBottom
            // let desiredWidth  = width  - taPaddingLeft - taPaddingRight

            // console.info('fo-sticky-note.js: setTextareaSize(): desiredHeight = ' + desiredHeight)

            // ta.style.height   = desiredHeight + 'px'
            // ta.style.minWidth = desiredWidth + 'px'
            // ta.style.maxWidth = desiredWidth + 'px'
            // ta.style.width    = desiredWidth + 'px'

            // // TODO: CONTINUE HERE
        },

        stickyNoteOnBlur(e) {
            if (this.blurHandlerEnabled) {
                // console.info('fo-sticky-note: stickyNoteOnBlur(): Start; e = ')
                // console.info(e)

            } else {
                // console.info('fo-sticky-note: stickyNoteOnBlur(): Blur handler is not enabled; nothing to to')   

                // Re-enable blur handling. If it needs to be disabled again, onMouseDown will take care of that.

                this.blurHandlerEnabled = true                 
            }
        },

        stickyNoteOnKeyDown(e) {
            // console.info('fo-sticky-note: stickyNoteOnKeyDown: e.keyCode =')
            // console.info(e.keyCode)
            if (e.keyCode === 27) {
                // ESC
            }
        },

        stickyNoteOnMouseDown(e) {
            // console.info('fo-sticky-note: stickyNoteOnMouseDown(): Fired!')
        },

        stickyNoteOnMouseUp(e) {
            // console.info('fo-sticky-note: stickyNoteOnMouseUp(): Fired!')
        },

        titleDivOnClick(e) {
            console.info('fo-sticky-note: titleDivOnClick(): Fired!') 

            let titleDivHeight = this.titleDiv.offsetHeight

            let tds = this.titleDiv.style
            let tis = this.titleInput.style

            tds.visibility = 'hidden'
            tds.zIndex = 10

            tis.offsetHeight = titleDivHeight
            tis.visibility = 'visible'
            tis.zIndex = 20

            // Place the cursor at the end of the text by clearing and setting the value.
            // Save old value as we need to clear it
            let val = this.titleInput.value;
  
            // Focus the textarea, clear value, re-apply
            this.titleInput.focus()
            this.titleInput.value = ''
            this.titleInput.value = val
        },

        titleInputOnBlur(e) {
            console.info('fo-sticky-note: titleInputOnBlur(): Fired!') 

            let tds = this.titleDiv.style
            let tis = this.titleInput.style

            tds.visibility = 'visible'
            tds.zIndex = 20

            tis.visibility = 'hidden'
            tis.zIndex = 10

            this.resizeElements()

        },

        titleInputOnKeyDown(e) {
            if ((e.keyCode === 13) || (e.keyCode === 27)) {
                e.preventDefault()
                this.titleInputOnBlur(e)
            }
        },

        // Color utility methods

        hex(x) {
            var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
            return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
        },

        // Function to convert rgb color to hex format
        rgb2hex(rgb) {
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return "#" + this.hex(rgb[1]) + this.hex(rgb[2]) + this.hex(rgb[3]);
        },
        
        rgbStringToRgbValues(rgbString) {
            let colorPartStrings = rgbString.substring(rgbString.indexOf('(') + 1, rgbString.lastIndexOf(')')).split(/,\s*/)
            let red     = parseInt(colorPartStrings[0])
            let green   = parseInt(colorPartStrings[1])
            let blue    = parseInt(colorPartStrings[2])
            let opacity = parseInt(colorPartStrings[3])
    
            return [red, green, blue, opacity]
        },
    
        shadeColor(color, percent) {
            var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
            return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
        },
    
    }
}

// console.info("fo-sticky-note.es6.js: End")
