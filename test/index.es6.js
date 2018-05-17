// console.info('index.es6.js: Start')

// Uses a symlink to the ../dist directory.
import FoStickyNote from './dist/fo-sticky-note-bundle.js'
import foSwatchesWrapperMerged from './lib/fo-swatches-bundle.js'

let loremIpsum = new LoremIpsum()

let defaultProps = {
    hex: '#194d33',
    hsl: {
      h: 150,
      s: 0.5,
      l: 0.2,
      a: 1
    },
    hsv: {
      h: 150,
      s: 0.66,
      v: 0.30,
      a: 1
    },
    rgba: {
      r: 25,
      g: 77,
      b: 51,
      a: 1
    },
    a: 1
  }

let gridstackItemComponent = Vue.component('gridstackitem', {
    // Template could have been expressed as a string literal here, but by doing it in the HTML,
    // we get nice syntax highlighting.

    template: '#gsi-template',
    components: {
        'fo-sticky-note': FoStickyNote,
    },
    props: [
        'dataobject'
    ],
    created() {
        // console.info('index.es6.js: Created an instance of the grid-stack-item VueJS component.');
    },
    destroyed() {
        // console.info('gridstackitem component destroyed');

        // Obtain an up-to-date reference to the Gridstack, which is stored as a
        // data item that is associated with the element of class 'grid-stack'.

        var grid = $('.grid-stack').data('gridstack');
        // console.info(grid);

        // Obtain the element id associated with this VueJS component.

        // console.info($(this.$el).attr('id'));

        // Ask Gridstack to remove the widget that contains this component's element.

        grid.removeWidget(this.$el);
        //console.info(grid);
    },
    methods: {
        gsiContentOnKeyDown(e) {
            // console.info('index.es6.js: gsiContentOnKeyDown(): Fired!; e = ' + e)
        },
        stickyNoteOnKeyDown(e) {
            // console.info('index.es6.js: stickyNoteOnKeyDown(): Fired!; e = ' + e)
            // Doesn't work. Don't know where to catch the keystroke.
            // if ((e.keyCode === 27) && this.isColorPickerOpen) {
            //     this.hideColorPicker()
            // }
        },

        handleSnBlur(e) {
            // console.info('index.es6.js: gridstackitem: handleBlur(): Fired!')
            this.$emit('blur', e)
        },

        handleSnCloseButtonClick(noteId) {
            // console.info('index.es6.js: gridstackitem: handleClick(): Fired!')
            this.$emit('close-button-click', noteId)
        },

        handleSnColorButtonClick(clickedElement) {
            // console.info('index.es6.js: gridstackitem: handleSnColorButtonClick(): Fired!')
            this.$emit('color-button-click', clickedElement)
        },

        handleSnColorButtonUnclick(clickedElement) {
            this.$emit('color-button-unclick', clickedElement)
        },

        handleSnMenuMouseLeave(e) {
            this.$emit('menu-mouse-leave', e)
        },

        handleSnNoteChange(newNote) {
            this.$emit('note-change', newNote)
        },

        handleSnTitleChange(newTitle) {
            this.$emit('title-change', newTitle)
        },

        removeWidget() {
            // console.info('child remove: ' + $(this.$el).attr('id'));

            // Emit a 'remove' event to the parent. The parent is responsible 
            // for performing the remove action.
            
            this.$emit('remove');
        }

    },
});

// The VueJS application.

var vueModel = new Vue({
    el: '#app',
    components: {
        'fo-sticky-note': FoStickyNote,
        'grid-stack-item': gridstackItemComponent,
        'swatches': foSwatchesWrapperMerged
    },
    
    // Each data object in dataObjects[] represents a gridstack item + sticky note instance.
    data: {
        dataObjects: [],
        dataObjectsDict: {},

        colors: defaultProps,
        colorPicker: null,
        isColorPickerOpen: false,
        colorPickerNoteId: null

    },
    mounted() {
        // console.info('index.es6.js: mounted(): Start')
        
        // Initialize convenience references.

        this.colorPicker = document.getElementById('colorPicker')
        // console.info('index.es6.js: mounted(): this.colorPicker =')
        // console.info(this.colorPicker)

        this.hideColorPicker()

        this.enableGrid()  // Invokes Gridstack.
    },
    methods: {
        appOnKeyDown(e) {
            // console.info('index.es6.js: appOnKeyDown(): Fired!; e = ' + e)
        },
        colorPickerNoteOnKeyDown(e) {
            // console.info('index.es6.js: colorPickerOnKeyDown(): Fired!; e = ' + e)
        },
        gsiOnKeyDown(e) {
            // console.info('index.es6.js: gsiOnKeyDown(): Fired!; e = ' + e)
        },


        gridStackOnKeyDown(e) {
            // console.info('index.es6.js: gridStackOnKeyDown(): Fired!; e = ' + e)
        },

        addWidget(type) {

            // Instantiate a gridstack item that contains a sticky note.
            
            var newDataObject = getStickyNoteDataObject()

            // Add the component to the model; place it in the gridstackItems array that is a property
            // of the model object.

            this.dataObjects.push(newDataObject)
            this.dataObjectsDict[newDataObject.stickyNote.id] = newDataObject

            // Wait until vue has completely rendered the new component.

            Vue.nextTick(function () {
                // Obtain a reference to the Gridstack grid.

                var grid = $('.grid-stack').data('gridstack');
                
                // Add a widget to the Gridstack grid using the grid's makeWidget method.
                // The parameter is a jQuery element whose ID is thie ID of the data object,
                // which will be a GUID.

                let widgetElement = $('#' + newDataObject.id)

                grid.makeWidget(widgetElement)

                // Place the widget at a randomly-generated X location.

                let x = Math.floor(Math.random() * 8)

                grid.move(widgetElement, x, 0)

            });
        },
        enableGrid() {
            // Standard way of invoking Gridstack.  Set some options and call the
            // gridstack() method of a jQuery control.

            var options = {
                verticalMargin: 10,
                resizable: {handles: 'se, s, sw'}
            };

            $('.grid-stack').gridstack(options);
        },
        handleColorChange(e) {
            // console.info('index.es6.js: handleColorChange(): Fired!; e = ' + e)
            // console.info('index.es6.js: handleColorChange(): this.colorPickerNoteId = ' + this.colorPickerNoteId)

            // Apply the selected color to the sticky note.

            // The fo-sticky-note's backgroundColor prop is bound to dataobject.stickyNote.backgroundColor.
            // So if we change that value in our bound data, it will update the note's color.

            let dataObjectToUpdate = this.dataObjectsDict[this.colorPickerNoteId]

            // console.info('index.es6.js: handleColorChange(): Before: dataObjectToUpdate.stickyNote.backgroundColor = ')
            // console.info(dataObjectToUpdate.stickyNote.backgroundColor)

            dataObjectToUpdate.stickyNote.backgroundColor = e

            // console.info('index.es6.js: handleColorChange(): After: dataObjectToUpdate.stickyNote.backgroundColor = ')
            // console.info(dataObjectToUpdate.stickyNote.backgroundColor)

            this.hideColorPicker()

        },
        handleGiBlur(e) {
            if (this.isColorPickerOpen) {
                this.hideColorPicker()
            }
        },
        handleGiCloseButtonClick(noteId) {
            // console.info('index.es6.js: handleGiCloseButtonClick(): Heard a click from note with ID = ' + noteId)
            let elementToClose = document.getElementById(noteId)
            elementToClose.parentNode.parentNode.parentNode.removeChild(elementToClose.parentNode.parentNode)
        },
        handleGiColorButtonClick(clickedElement) {
            // console.info('index.es6.js: handleGiColorButtonClick(): Fired!')
            // console.info('index.es6.js: handleGiColorButtonClick(): Heard a click from this color button:')
            // console.info(clickedElement)

            this.colorPickerNoteId = clickedElement.noteId
            // console.info('index.es6.js: handleGiColorButtonClick(): colorPickerNoteId = ' + this.colorPickerNoteId)

            let buttonTop = $(clickedElement).offset().top - $(window).scrollTop()
            let buttonLeft = $(clickedElement).offset().left - $(window).scrollLeft()
            let buttonHeight = parseFloat(window.getComputedStyle(clickedElement).getPropertyValue('height'))
            let buttonMargin = parseFloat(window.getComputedStyle(clickedElement).getPropertyValue('margin-top'))

            let pickerTop = buttonTop + buttonHeight + buttonMargin

            // Display the color picker, aligning its upper-left corner with the lower-left corner of the button.

            let cps = this.colorPicker.style
                cps.position = 'absolute'
                cps.top = pickerTop + 'px'
                cps.left = buttonLeft + 'px'
                cps.visibility = 'visible'

            // Tell the note to pin its menu.

            this.isColorPickerOpen = true

        },
        handleGiColorButtonUnclick(clickedElement) {
            // console.info('index.es6.js: handleGiColorButtonUNClick(): Fired!')
            this.hideColorPicker()
        },
        handleGiMenuOnMouseLeave(e) {
            // console.info('index.es6.js: handleMenuOnMouseLeave(): Fired! e = ')
            // console.info(e)            
        },
        handleGiNoteChange(newNote) {
            // console.info('index.es6.js: handleNoteChange(): Fired! newNote = ')
            // console.info(newNote)
        },
        handleGiTitleChange(newTitle) {
            // console.info('index.es6.js: handleTitleChange(): Fired! newTitle = ')
            // console.info(newTitle)
        },
        hideColorPicker() {
            let cps = this.colorPicker.style
                cps.top = '-1000px'
                cps.left = '-1000px'
                cps.visibility = 'hidden'
            this.isColorPickerOpen = false
        },
        humanizeURL(url) {
            return url
                .replace(/^https?:\/\//, '')
                .replace(/\/$/, '')
        },
        removeWidget(widgetToRemove) {
            // console.info("parent remove: " + widgetToRemove.id);
            // console.info('removeWidget: ' + widgetToRemove.id);
            this.dataObjects = $.grep(this.dataObjects, function (e) {
                return e.id != widgetToRemove.id;
            });

        }
    }
})

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4()
}

// Factory function that instantiates and returns a object that contains the data for 
// a sticky note + gridstack item instance.

function getStickyNoteDataObject() {
    // let index = Math.floor(Math.random() * 4)
    // console.info('index.es6.js: getDataObjectByType: dataObjectToReturn.index = ' + index)
    
    let dataObjectToReturn = new StickyNoteDataObject()

    // Override some of the values retrieved from the array of sample daata.
    // Eventually we'll do away with the sample data altogether and 
    // just generate everything randomly.

    let numberOfWords = Math.floor(Math.random() * 50) + 50
    let numberOfTitleWords = Math.floor(Math.random() * 5) + 5

    dataObjectToReturn.stickyNote.id = guid()
    dataObjectToReturn.stickyNote.note = loremIpsum.generate(numberOfWords)
    dataObjectToReturn.stickyNote.noteTitle = loremIpsum.generate(numberOfTitleWords)
    dataObjectToReturn.stickyNote.backgroundColor = randomColor()


    // console.info('index.es6.js: getStickyNoteDataObject(): dataObjectToReturn.stickyNote =')
    // console.info(dataObjectToReturn.stickyNote)
    return dataObjectToReturn
}

// Object constructor for a data object.

function StickyNoteDataObject() {
    this.id = guid(),
    this.name = "StickyNoteDataObject",
    this.key = '',
    this.type = {
        key: "gridstackitem",
        name: "StickyNoteDataObject",
        requiresOptions: false
    },
    this.editMode = false,
    this.layout = {
        x: 0,
        y: 0,
        width: 12,
        minWidth: 2,
        maxWidth: 12,
        height: 1,
        minHeight: 1,
        maxHeight: 1
    },
    this.stickyNote = { 
        id: null,
        noteTitle: null,
        note: null,

        backgroundColor: null,
        color: null,
        fontFamily: null,
        fontSize: null,
        menuIsPinned: false,    
        lineHeight: null
    }
}
