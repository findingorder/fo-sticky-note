# fo-sticky-note Component for Vue.js

THIS COMPONENT IS UNDER CONSTRUCTION. PLEASE DO NOT USE.

**fo-sticky-note** is a **Vue.js** component that provides a full-featured sticky note control.

fo-sticky-note is written in **ECMAScript 6th Edition** (a.k.a. **ECMAScript 2015**, a.k.a. **ES6**) and is intended for inclusion in an ES6 application.  No provision has been made for supporting earlier JavaScript editions.

fo-sticky-note is provided as an **ES6 module**. No provision has been made for older idiosyncratic module formats such as CommonJS or AMD.

fo-sticky-note is packaged into a single file using **rollup.js**.  Currently the bundle is not minified or uglified; we intend to do this in a later release.

## Using fo-sticky-note

To include fo-sticky-note in your project, simply import it using the ES6 *import* statement:

```JavaScript
import FoStickyNote from 'fo-sticky-note-bundle.js'
```

Then include it as a component in your Vue.js model:

```JavaScript
var vueModel = new Vue({
    el: '#app',
    components: {
        FoStickyNote
    }
})
```

This will make the *\<fo-sticky-note\>* tag available for use within your project's HTML. 

### Attributes

The following attributes can be included in an *\<fo-sticky-note\>* tag:

- *id*&nbsp;&nbsp;&nbsp;Required; every *\<fo-sticky-note\>* instance must have a unique *id* value
- *note*&nbsp;&nbsp;&nbsp;The initial contents of the note

Values for the following attributes are expressed using **CSS** syntax:

- *bgcolor*&nbsp;&nbsp;&nbsp;The markdown note's background color
- *color*&nbsp;&nbsp;&nbsp;The note's text color
- *fontFamily*&nbsp;&nbsp;&nbsp;The typeface to use
- *fontSize*&nbsp;&nbsp;&nbsp;How big you want the type to be

### Events

*on-change* ...

### Example

```html
<fo-sticky-note 
    id="note1"                    
    note="Remember to do what I forgot to do."
    bgcolor="LemonChiffon"
    v-on:change="noteOnChange()">
</fo-sticky-note>
```

## Building fo-sticky-note

The source code for fo-sticky-note can be found in the **src** directory. The build process uses the file **fo-sticky-note.js** plus files from the **src/lib** directory and the **src/node_modules** directory.

When you clone or download the **git** repo, you don't get the **src/node_modules** directory. Since this directory can be easily re-generated using **npm**, there's no reason to include it in the git repo.  The **src/package.json** contains all of the information needed to re-generate the **src/node_modules** directory.  To do this, *cd* to the **src** directory and enter the command:

```bash
npm install
```

npm will fetch and install all of the node modules listed in **package.json**.

fo-sticky-note is built into a rollup.js bundle using the **build.sh** script found in the **src** directory.  At this writing, **build.sh** contains only the command *rollup -c*. We have the habit of creating a **build.sh** script no matter how simple its contents so that we never have to remember which command(s) to use for different kinds of projects.

To build the bundle, *cd* to the **src** directory and enter the command

```bash
./build.sh
```

After a successful build, you should see the following results:

```
fo-sticky-note.js → ../dist/fo-sticky-note-bundle.js...
created ../dist/fo-sticky-note-bundle.js in 1.8s
```

## Running the Test Application

The included test application can be run from the **test** directory.

As you did with the **src** directory, you must run *npm install* to re-generate the **node_modules** directory used by the test application.

The test application can be run using the *http-server* npm module.  To run it, *cd* to the **test** directory and enter the command

```bash
http-server
```

This will open a simple web server that serves its content on *http://localhost:8080*.

## Dependencies

fo-sticky-note's dependencies fall into two categories, those that are bundled into **fo-sticky-note-bundle-js** and those that are expected to be present in the project in which fo-sticky-note is used.

The latter category includes widely-used libraries such as JQuery, Lodash, and Vue.js.

Bundled into **fo-sticky-note-bundle-js** are libraries that are unique or specific to fo-sticky-note.

You can change which libraries you want to bundle or keep external by editing the **src/package.json** file and moving them between the *dependencies* and *devDependencies* sections, or through use of the *external* option in **src/rollup.config.js**.  You need to re-build the bundle after making any such changes.

## Getting fo-sticky-note from NPM

If you want to use the **dist/fo-sticky-note-bundle.js** in your project and don't think you'll ever need to re-build it, you can obtain it from NPM using the command

```bash
npm install fo-sticky-note
```

This will place a copy of **fo-sticky-note-bundle.js** in your project's **node_modules** directory along with its dependencies.  You can then import it into your ES6 JavaScript using the command

```JavaScript
import FoMarkdownNote from 'node_modules/fo-sticky-note/fo-sticky-note-bundle.js'
```

In this scenario, **fo-sticky-note-bundle.js** will contain all of the bundled dependencies, and the external dependencies will be made known to NPM in the **npm/package.json** file.  This **package.json** file is different from the one found in the **src** directory, and is used only for publishing on NPM.  
