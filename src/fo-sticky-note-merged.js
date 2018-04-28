// console.info("fo-sticky-note.es6.js: Start")

import FoMarkdownNote from 'fo-markdown-note'

// https://github.com/Akryum/vue-resize
import './node_modules/vue-resize/dist/vue-resize.css'
import { ResizeObserver } from 'vue-resize'
import './lib/jquery-autogrow-textarea.js'

import menuIconBlack   from './img/ic_menu_black_48px.svg'
import menuIconWhite   from './img/ic_menu_white_48px.svg'
import closeIconBlack  from './img/ic_close_black_256px.svg'
import closeIconWhite  from './img/ic_close_white_256px.svg'
import colorIconBlack  from './img/ic_color_lens_black_48px.svg'
import colorIconWhite  from './img/ic_color_lens_white_48px.svg'


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
        // color: {
        //     type: String,
        //     default: '#000'
        // },
        fontFamily: {
            // Corresponding attribute: font-family
            type: String,
            default: 'Arial, Helvetica, "DejaVu Sans", sans-serif'
        },
        fontSize: {
            // Corresponding attribute: font-size
            type: String,
            default: '1.0rem'
        },
        lineHeight: {
            type: String,
            default: '1.2'
        },
        menuIsPinned: {
            type: Boolean,
            default: false
        },
        note: String,
        noteTitle: {
            type: String,
            default: 'Title'
        }
    },

    data() { return {
        blurHandlerEnabled:     true,
        buttonFontRatio:        0.9,
        buttonHeightRatio:      2.3,
        buttonWidthRatio:       2.5,
        buttonPaddingRatio:     0.55,
        buttonHoverColor:       this.backgroundColor,
        color:                  '#000',
        colorButtonIconId:      this.id + '-color-button-icon',
        colorButtonId:          this.id + '-color-button',
        colorIcon:              colorIconBlack,
        closeButtonIconId:      this.id + '-close-button-icon',
        closeButtonId:          this.id + '-close-button',
        closeIcon:              closeIconBlack,
        foMarkdownNote:         null,
        foMarkdownNoteId:       this.id + '-markdown-note',
        iconOpacityActive:      0.54,
        iconOpacityInactive:    0.26,
        menuButtonId:           this.id + '-menu-button',
        menuButtonIconId:       this.id + '-menu-button-icon',
        menuDivId:              this.id + '-menu-div',
        menuOuterDivId:         this.id + '-menu-outer-div',
        menuIcon:               menuIconBlack,
        markdownDiv:            null,
        markdownDivId:          this.id + '-markdown-div',
        titleBackgroundColor:   this.backgroundColor,
        titleDiv:               null,
        titleDivId:             this.id + '-title-div',
        titleInput:             null,
        titleInputId:           this.id + '-title-input',
        titleMinHeightRatio:    2.3,
        vueOuterDiv:            null

    }},

    // In the template we set the id of the outer div to be the same as the id of the vue component.
    // Code inside the component should see this as unique and should not confuse it with the vue component itself.


    template: `
        <div :id='id' 
    class='outer-div' 
    ref='outerDiv'>

    <div 
        :id='titleDivId' 
        ref='titleDiv'
        class='title-div' 
        :title='noteTitle' 
        v-on:click='titleDivOnClick'
        >{{noteTitle}}</div>

    <div :id='menuOuterDivId'
        ref='menuOuterDiv'
        v-on:mouseenter='menuOnMouseEnter'
        v-on:mouseleave='menuOnMouseLeave'>

        <div :id='menuDivId' 
            ref='menuDiv'
            style='background-color: "red";'>

            <div :id='colorButtonId' ref='colorButton'                        
                v-on:mouseenter='colorOnMouseEnter'
                v-on:mouseleave='colorOnMouseLeave'
                v-on:click='colorButtonOnClick'>

                <img :id='colorButtonIconId' ref='colorButtonIcon'/>
            </div>
            <div :id='closeButtonId' ref='closeButton'
                v-on:mouseenter='closeOnMouseEnter'
                v-on:mouseleave='closeOnMouseLeave'
                v-on:click='closeButtonOnClick'>

                <img :id='closeButtonIconId' ref='closeButtonIcon'/>
            </div>
        </div>

        <div :id='menuButtonId' 
            ref='menuButton'
            v-on:click='menuButtonOnClick'>
        
            <img :id='menuButtonIconId' ref='menuButtonIcon'/>
        </div>
        
    </div>

    <div :id='markdownDivId' class='markdown-div' ref='markdownDiv'>
        <fo-markdown-note 
            :id='foMarkdownNoteId'
            v-bind:note='note' 
            v-bind:background-color='backgroundColor'
            v-bind:color='color'
            v-bind:line-height='lineHeight'
            v-bind:font-family='fontFamily'
            v-bind:font-size='fontSize'
            v-on:click='noteOnClick($event)'
            v-on:note-change='noteOnChange($event)'>
        </fo-markdown-note>
    </div>

    <textarea 
        :id='titleInputId' 
        :title='noteTitle' 

        class='title-textarea' 
        placeholder='Title' 
        ref='titleTextarea' 
        rows='1'

        v-on:blur='titleInputOnBlur'
        v-on:keydown='titleInputOnKeyDown'
        v-model='noteTitle' 
        style='visibility: hidden;'
        ref='titleInput'>
    ></textarea>

    <resize-observer id='outer-div-resize-observer' @notify='outerDivOnResize' />
</div>

    `,

    mounted() {
        // console.info('fo-sticky-note.es6.js: mounted(): Start')

        // Initialize convenience references.
        // We prefer tu use Vue's built-in $refs feature but in some instances we have to make our own references.

        // console.info('fo-sticky-note.es6.js: mounted(): this.foMarkdownNoteId = ' + this.foMarkdownNoteId)

        this.foMarkdownNote = document.getElementById(this.foMarkdownNoteId)

        // console.info('fo-sticky-note.es6.js: mounted(): this.foMarkdownNote = ')
        // console.info(this.foMarkdownNote)

        // TODO: Use Vue's built-in $refs for all of these.

        // console.info('fo-sticky-note.es6.js: mounted(): this.markdownDivId = ' + this.markdownDivId)
    
        this.titleDiv        = document.getElementById(this.titleDivId)
        this.markdownDiv     = document.getElementById(this.markdownDivId)
        this.vueOuterDiv     = document.getElementById(this.id)

        // console.info('fo-sticky-note.es6.js: mounted(): this.markdownDiv = ')
        // console.info(this.markdownDiv)

        this.setColors()
        this.initializeResizeObserver()
        this.initializeTitleStyles()
        this.initializeMenuStyles()
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

    watch: {
        backgroundColor: function(newValue, oldValue) {
            // console.info('fo-sticky-note.js: watch: backgroundColor: Fired! newValue = ' + newValue)
            // console.info('fo-sticky-note.js: watch: backgroundColor: this.backgroundColor = ' + this.backgroundColor)
            this.setColors()
        },

        menuIsPinned: function (newValue, oldValue) {
            // console.info('fo-sticky-note.js: watch: menuIsPinned: Fired! newValue = ' + newValue)
            if (this.menuIsPinned == true) {
                this.$refs.colorButtonIcon.style.opacity = this.iconOpacityActive
            } else {
                this.$refs.colorButtonIcon.style.opacity = this.iconOpacityInactive 
                this.$refs.menuButton.style.backgroundColor = this.titleBackgroundColor
                this.$refs.menuButtonIcon.style.opacity = this.iconOpacityInactive
                this.fadeOut(this.$refs.menuDiv)    
            }
        },

        noteTitle: function (newNoteTitle, oldNoteTitle) {
            // console.info('fo-sticky-note.js: watch: noteTitle: Fired! newNoteTitle = ' + newNoteTitle)
            this.$emit('title-change', newNoteTitle)
        }
    },

    methods: {
        closeButtonOnClick() {
            this.$emit('close-button-click', this.id)
            this.$refs.closeButton.style.backgroundColor = this.backgroundColor
            setTimeout(() => { 
                this.$refs.closeButton.style.backgroundColor = this.buttonHoverColor
            }, 100)
        },

        closeOnMouseEnter() {
            this.$refs.closeButtonIcon.style.opacity = this.iconOpacityActive
        },

        colorButtonOnClick(e) {
            // We always want to send the button element, not the image, to any event handler.

            var targetElement = e.target

            if (targetElement.tagName.toUpperCase() === 'IMG') {
                targetElement = targetElement.parentElement
            }

            targetElement.noteId = this.id

            if (this.menuIsPinned) {
                this.dismissColorButton(targetElement)
            } else {
                this.pinColorButton(targetElement)
            }

            this.$refs.colorButton.style.backgroundColor = this.backgroundColor
            setTimeout(() => { 
                this.$refs.colorButton.style.backgroundColor = this.buttonHoverColor
            }, 100)
        },

        closeOnMouseLeave() {
            this.$refs.closeButtonIcon.style.opacity = this.iconOpacityInactive
        },

        colorOnMouseEnter() {
            this.$refs.colorButtonIcon.style.opacity = this.iconOpacityActive
        },

        colorOnMouseLeave() {
            if (!this.menuIsPinned) {
                this.$refs.colorButtonIcon.style.opacity = this.iconOpacityInactive
            }
        },

        dismissColorButton(targetElement) {
            this.$emit('color-button-unclick', targetElement)
            this.menuIsPinned = false
        },

        fadeOut(el) {
            el.style.opacity = 1;
            (function fade() {
                if ((el.style.opacity -= .1) < 0) {
                    el.style.display = "none";
                } else {
                    requestAnimationFrame(fade);
                }
            })();
        },
          
        fadeIn(el, display) {
            el.style.opacity = 0;
            el.style.display = display || "block";          
            (function fade() {
                var val = parseFloat(el.style.opacity);
                if (!((val += .1) > 1)) {
                    el.style.opacity = val;
                    requestAnimationFrame(fade);
                }
            })();
        },

        initializeMenuStyles() {
            // Buttons are sized proportionally to the actual font size seen in the title.
            
            let propertyValue = window.getComputedStyle(this.titleDiv).getPropertyValue('font-size')
            // console.info('fo-sticky-note.js: initializeButtonStyles(): propertyValue = ' + propertyValue)

            let actualFontSize = parseFloat(propertyValue)
            // console.info('fo-sticky-note.js: initializeButtonStyles(): actualFontSize = ' + actualFontSize)

            // OK to use px here since we're computing a height.

            var buttonFontSize  = actualFontSize * this.buttonFontRatio
            var buttonHeight    = actualFontSize * this.buttonHeightRatio
            var buttonWidth     = actualFontSize * this.buttonWidthRatio
            var buttonPadding   = actualFontSize * this.buttonPaddingRatio
            var menuWidth       = buttonWidth * 2

            var roundButtonMargin = actualFontSize * this.buttonPaddingRatio * 0.3
            var roundButtonPadding = 0
            var roundButtonHeight = buttonHeight - (roundButtonMargin * 2) - (roundButtonPadding * 2)
            var roundButtonWidth  = buttonWidth - (roundButtonMargin * 2) - (roundButtonPadding * 2)
            var roundButtonBorderRadius = roundButtonWidth * 0.5

            var closeButtonOffset = roundButtonPadding + roundButtonMargin
            var colorButtonRight = buttonWidth + closeButtonOffset
            menuWidth = menuWidth + (closeButtonOffset * 2)

            // console.info('fo-sticky-note.js: initializeMenuStyles(): buttonWidth = ' + buttonWidth)
            // console.info('fo-sticky-note.js: initializeMenuStyles(): menuWidth = ' + menuWidth)

            var imageHeight = buttonHeight - (2 * buttonPadding)
            var imageWidth  = buttonWidth  - (2 * buttonPadding)

            // console.info('fo-sticky-note.js: initializeButtonStyles(): imageHeight = ' + imageHeight)
            // console.info('fo-sticky-note.js: initializeButtonStyles(): imageWidth = ' + imageWidth)

            buttonFontSize  = buttonFontSize.toString() + 'px'
            buttonHeight    = buttonHeight.toString() + 'px'
            buttonWidth     = buttonWidth.toString() + 'px'
            buttonPadding   = buttonPadding.toString() + 'px'
            imageHeight     = imageHeight.toString() + 'px'
            imageWidth      = imageWidth.toString() + 'px'
            menuWidth       = menuWidth.toString() + 'px'

            roundButtonMargin  = roundButtonMargin.toString() + 'px'
            roundButtonPadding = roundButtonPadding.toString() + 'px'
            roundButtonHeight  = roundButtonHeight.toString() + 'px'
            roundButtonWidth   = roundButtonWidth.toString() + 'px'
            roundButtonBorderRadius = roundButtonBorderRadius.toString() + 'px'

            closeButtonOffset = closeButtonOffset.toString() + 'px'
            colorButtonRight = colorButtonRight.toString() + 'px'

            // console.info('fo-sticky-note.js: initializeButtonStyles(): this.menuIcon = ')
            // console.info(this.menuIcon)

            this.$refs.menuButtonIcon.src = this.menuIcon
            
            let mbs = this.$refs.menuButton.style
                mbs.position        = 'absolute'
                mbs.height          = buttonHeight
                mbs.width           = buttonWidth
                mbs.top             = '0'
                mbs.right           = '0'
                mbs.border          = '0'
                mbs.outline         = 'none'
                mbs.padding         = '0'
                mbs.textAlign       = 'center'
                mbs.verticalAlign   = 'middle'
                mbs.zIndex          = 30

            let cbis = this.$refs.menuButtonIcon.style
                cbis.position   = 'absolute'
                cbis.height     = imageHeight
                cbis.width      = imageWidth
                cbis.top        = buttonPadding
                cbis.right      = buttonPadding
                cbis.opacity    = this.iconOpacityInactive  // Google material icons guideline

            this.titleDiv.style.paddingRight = buttonWidth
            this.$refs.titleInput.style.paddingRight = buttonWidth

            // console.info('fo-sticky-note.js: initializeMenuStyles(): menuWidth = ' + menuWidth)

            let muds = this.$refs.menuDiv.style
                muds.backgroundColor = this.titleBackgroundColor
                // muds.backgroundColor = 'red'
                muds.position = 'absolute'
                muds.top = '0'
                muds.right = buttonWidth
                muds.height = buttonHeight
                muds.width = menuWidth
                muds.border = '0'
                muds.opacity = 0
                muds.outline = 'none'
                muds.display = 'flex'
                muds.justifyContent = 'right'
                muds.zIndex = 30

            this.$refs.colorButtonIcon.src = this.colorIcon

            let crbs = this.$refs.colorButton.style
                crbs.backgroundColor = this.buttonHoverColor
                crbs.position        = 'absolute'
                crbs.height          = roundButtonHeight
                crbs.width           = roundButtonWidth
                crbs.top             = '0'
                crbs.right           = colorButtonRight
                crbs.border          = '0'
                crbs.outline         = 'none'
                crbs.padding         = roundButtonPadding
                crbs.margin          = roundButtonMargin
                crbs.borderRadius    = roundButtonBorderRadius
                crbs.display         = 'flex'
                crbs.justifyContent = 'center'
                crbs.alignItems     = 'center'

            let crbis = this.$refs.colorButtonIcon.style
                // crbis.position   = 'relative'
                crbis.height     = imageHeight
                crbis.width      = imageWidth
                crbis.opacity    = this.iconOpacityInactive  // Google material icons guideline


            this.$refs.closeButtonIcon.src = this.closeIcon

            let clbs = this.$refs.closeButton.style
                clbs.backgroundColor = this.buttonHoverColor
                clbs.position        = 'absolute'
                clbs.height          = roundButtonHeight
                clbs.width           = roundButtonWidth
                clbs.top             = '0'
                clbs.right           = closeButtonOffset
                clbs.border          = '0'
                clbs.outline         = 'none'
                clbs.padding         = roundButtonPadding
                clbs.margin          = roundButtonMargin
                clbs.borderRadius    = roundButtonBorderRadius
                clbs.display         = 'flex'
                clbs.justifyContent = 'center'
                clbs.alignItems     = 'center'

            let clbis = this.$refs.closeButtonIcon.style
                // clbis.position   = 'relative'
                clbis.height     = imageHeight
                clbis.width      = imageWidth
                clbis.opacity    = this.iconOpacityInactive  // Google material icons guideline

        },

        initializeMarkdownStyles() {
            let markdownTop = (this.titleDiv.style.height - 1).toString() + 'px'

            let mds = this.markdownDiv.style
                mds.backgroundColor = this.backgroundColor
                mds.top = this.markdownTop
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

        initializeResizeObserver() {

            // console.info('fo-sticky-note.es6.js: initializeResizeObservers(): this.vueOuterDiv = ')
            // console.info(this.vueOuterDiv)

            let resizeObserver = document.getElementById('outer-div-resize-observer')
            resizeObserver.style.position = 'relative'

        },

        initializeStyles() {
            let html = document.getElementsByTagName('html')[0]
            let htmlStyle = html.style
            html.fontSize = '62.5%'
        },

        initializeTitleStyles() {
            let tds = this.titleDiv.style
                tds.width = '100%'
                tds.position = 'absolute'
                tds.fontSize = this.fontSize
                tds.fontFamily = this.fontFamily
                tds.padding = '0.6rem 1.0rem 0.6rem 1.0rem' // top right bottom left
                tds.backgroundColor = this.titleBackgroundColor
                tds.color = this.color
                tds.cursor = 'default'
                tds.boxSizing = 'border-box'
                tds.zIndex = 20

            // For some unknown reason, the textarea's font-family has to be set this way.
            this.$refs.titleInput.setAttribute('style','font-family: ' + this.fontFamily + ';')

            let tis = this.$refs.titleInput.style
                tis.position = 'absolute'
                tis.top = '0'
                tis.fontSize = this.fontSize
                tis.backgroundColor = this.titleBackgroundColor
                tis.color = this.color
                tis.border = 'none'
                tis.borderWidth = '0'
                tis.padding = '0.5rem 1.0rem 0 1.0rem' // top right bottom left
                tis.overflow = 'hidden'
                tis.width = '100%'
                tis.verticalAlign = 'top'
                tis.resize = 'none'
                tis.boxSizing = 'border-box'
                tis.zIndex = 10

            $(this.$refs.titleInput).autogrow()
        },

        initializeVueOuterDivStyles() {
            // console.info('fo-sticky-note: initializeVueOuterDivStyles(): Start')

            let ods = this.vueOuterDiv.style
                ods.width = '100%'
                ods.backgroundColor = "#FF0000"

            // console.info('fo-sticky-note: initializeVueOuterDivStyles(): End')
        },

        menuButtonOnClick() {
            this.fadeIn(this.$refs.menuDiv)            
        },

        pinColorButton(targetElement) {
            this.$emit('color-button-click', targetElement)
            this.menuIsPinned = true
        },

        menuOnMouseEnter() {
            // console.info('fo-sticky-note.js: menuOnMouseEnter(): Fired')
            this.$refs.menuButton.style.backgroundColor = this.buttonHoverColor
            this.$refs.menuButtonIcon.style.opacity = this.iconOpacityActive
            this.fadeIn(this.$refs.menuDiv)
        },

        menuOnMouseLeave(e) {
            // console.info('fo-sticky-note.js: menuOnMouseLeave(): Fired; this.menuIsPinned = ' + this.menuIsPinned)
            if (this.menuIsPinned) {
                // console.info('fo-sticky-note.js: menuOnMouseLeave(): Menu is pinned')
            } else {                
                this.$refs.menuButton.style.backgroundColor = this.titleBackgroundColor
                this.$refs.menuButtonIcon.style.opacity = this.iconOpacityInactive
                setTimeout(() => {
                    this.fadeOut(this.$refs.menuDiv)
                }, 100)
                this.$emit('menu-mouse-leave', e)    
            }
        },

        noteOnChange(newNote) {
            this.note = newNote

            this.$emit('note-change', this.note)
        },

        noteOnClick(e) {
            // console.info('fo-sticky-note: noteOnClick(): Fired!')
            this.dismissColorButton(this.colorButton)
        },

        outerDivOnResize() {
            // console.info('fo-sticky-note: outerDivOnResize(): Fired!')

            this.resizeElements()
        },

        resizeElements() {
            // Get the dimensions from which others will be derived.

            // console.info('fo-sticky-note: resizeElements(): Fired!')

            let fontSize          = window.getComputedStyle(this.$refs.titleInput).getPropertyValue('font-size')
            let titleHeight       = window.getComputedStyle(this.titleDiv).getPropertyValue('height')
            let titleWidth        = window.getComputedStyle(this.titleDiv).getPropertyValue('width')
            let markdownDivHeight = window.getComputedStyle(this.$refs.markdownDiv).getPropertyValue('height')
            let markdownDivWidth  = window.getComputedStyle(this.$refs.markdownDiv).getPropertyValue('width')

            // Derived dimensions.

            let markdownNoteTop = titleHeight
            let markdownNoteHeight = (parseFloat(markdownDivHeight) - parseFloat(titleHeight)).toString() + 'px'
            let titleMinHeight = (parseFloat(fontSize) * this.titleMinHeightRatio).toString() + 'px'

            // Set the dimensions.

            let tds = this.titleDiv.style
                tds.minHeight = titleMinHeight

            let fmns = this.foMarkdownNote.style
                fmns.top = markdownNoteTop
                fmns.height = markdownNoteHeight

            let tis = this.$refs.titleInput.style
                tis.height    = titleHeight
                tis.minHeight = titleMinHeight
                tis.width     = titleWidth
                tis.minWidth  = titleWidth
                tis.maxWidth  = titleWidth


            // this.setTextareaHeight(this.$refs.titleInput, titleHeight)

            this.$refs.titleInput.style.height = titleHeight

        },

        setColors() {
            // console.info('fo-sticky-note.js: setColors(): this.backgroundColor = ' + this.backgroundColor)

            // We need to get a color that is an object, not a string. Do this by setting the color of an element,
            // then getting its computed style.

            let mds = this.markdownDiv.style
                mds.backgroundColor = this.backgroundColor

            let computedColor = getComputedStyle(this.markdownDiv).backgroundColor

            let computedColorString = this.rgb2hex(computedColor)
            this.titleBackgroundColor = this.shadeColor(computedColorString, -0.1)
            this.buttonHoverColor = this.shadeColor(computedColorString, -0.3)

            // Determine whether to use black or white icons based on how dark the background is.

            let howLight = this.howLight(computedColor)
            // console.info('fo-sticky-note.js: setColors(): howLight = ' + howLight)

            // Icon opacities are based on Google Material Icons guidelines.
            if (howLight > 80) {
                this.menuIcon = menuIconBlack
                this.colorIcon = colorIconBlack
                this.closeIcon = closeIconBlack
                this.iconOpacityActive = 0.54
                this.iconOpacityInactive = 0.26
                this.color = 'black'
            } else {
                this.menuIcon = menuIconWhite
                this.colorIcon = colorIconWhite
                this.closeIcon = closeIconWhite
                this.iconOpacityActive = 1.0
                this.iconOpacityInactive = 0.30
                this.color = 'white'
            }

            let crbs = this.$refs.colorButton.style
                crbs.backgroundColor = this.buttonHoverColor

            let clbs = this.$refs.closeButton.style
                clbs.backgroundColor = this.buttonHoverColor

            let muds = this.$refs.menuDiv.style
                muds.backgroundColor = this.titleBackgroundColor

            let tds = this.titleDiv.style
                tds.backgroundColor = this.titleBackgroundColor
                tds.color = this.color

            let tis = this.$refs.titleInput.style
                tis.backgroundColor = this.titleBackgroundColor
                tis.color = this.color

            this.$refs.colorButtonIcon.src = this.colorIcon
            this.$refs.closeButtonIcon.src = this.closeIcon
            this.$refs.menuButtonIcon.src = this.menuIcon            
        },

        stickyNoteOnBlur(e) {
            // console.info('fo-sticky-note: stickyNoteOnBlur(): Start')
            if (this.blurHandlerEnabled) {
                // console.info('fo-sticky-note: stickyNoteOnBlur(): Blur handler is enabled; e = ')
                // console.info(e)

                this.$emit('blur', e)

            } else {
                // Re-enable blur handling. If it needs to be disabled again, onMouseDown will take care of that.

                // console.info('fo-sticky-note: stickyNoteOnBlur(): Blur handler is NOT enabled')
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
            // console.info('fo-sticky-note: titleDivOnClick(): Fired!') 
            this.dismissColorButton(this.colorButton)

            let titleDivHeight = window.getComputedStyle(this.titleDiv).getPropertyValue('height')

            let tds = this.titleDiv.style
            let tis = this.$refs.titleInput.style

            tds.visibility = 'hidden'
            tds.zIndex = 10

            tis.height = titleDivHeight
            tis.top = '0'
            tis.visibility = 'visible'
            tis.zIndex = 20

            // Place the cursor at the end of the text by clearing and setting the value.
            // Save old value as we need to clear it
            let val = this.$refs.titleInput.value;
  
            // Focus the textarea, clear value, re-apply
            this.$refs.titleInput.focus()
            this.$refs.titleInput.value = ''
            this.$refs.titleInput.value = val
        },

        titleInputOnBlur(e) {
            // console.info('fo-sticky-note: titleInputOnBlur(): Fired!') 

            let tds = this.titleDiv.style
            let tis = this.$refs.titleInput.style

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

        // Color utility methods, borrowed from tinycolor
        // https://github.com/bgrins/TinyColor

        hex(x) {
            var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
            return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
        },

        howLight(rgbString) {
            let rgb = this.rgbStringToRgbValues(rgbString)
    
            var howLight = Math.round(
                (
                    (parseInt(rgb[0]) * 299) +
                    (parseInt(rgb[1]) * 587) +
                    (parseInt(rgb[2]) * 114)
                ) / 1000)
    
            return howLight
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
