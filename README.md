# buildless-ui
Some examples of the fast evolving web components standards: Shadow DOM, HTML Templates, ES Modules.

The first example is very simple TODO list.

## Get Started

Check out this repo and then...
```
>$ npm install
>$ npx es-dev-server --watch --node-resolve --app-index src/web/index.html
```
Click on the link in the terminal and start editing / viewing code without building anything.
Or try [Open the Builderless UI TODO App](http://localhost:8000/src/web/)

## Introduction

When I first started writing web applications in the late '90s it generally involved running a local
webserver, editing a file using Vi and then viewing the result in a browser called Netscape.
There was no complex build process and the feedback loop was very quick.

## What's changed?

Apple shipped a new version of Apple Music, using web components and leveraging the Shadow DOM 
and Custom Elements. [Apple just shipped web components](https://dev.to/ionic/apple-just-shipped-web-components-to-production-and-you-probably-missed-it-57pf)
My colleague Scott Davis has also been evangelising about Web Components for years, one of his
recent talks was [It's time for Web Components](https://www.youtube.com/watch?v=oF3xErSS-x8)

Modern browsers now have great support for the Shadow DOM, ES Modules and HTML Templates.  The
specs and implementations have actually been around for quite a long time (started in 2012 at Google)
and are quite mature.  Other parts are still a little immature, HTML authoring and CSS templating, but 
they are rapidly improving.

[Open-WC.org](https://open-wc.org/about/) provide a curated set of tools to fill in the gaps.

## Why not keep using React?

React and the toolset around it is very mature but React was created to solve a specific problem: at the time of
it's inception, different browser vendors had very different DOM implementations requiring developers to perform
all kinds of wonderful tricks to make the web applications function correctly.  The React Virtual DOM was a 
guarantee that updates to the Virtual DOM will be rendered as intended in any of the supported browsers.

The current browser implementations are now so similar this problem no longer needs solving.  In fact React now
actively works against the browser specifications by providing a single global scoped virtual DOM instead of many
composable shadow DOMs providing better encapsulation, high cohesion and loose coupling between components.

## Current issues in User Interface Development

Learning all the different tools! Grunt, gulp, babel, node, webpack, rollup etc.  
How are all these tools changing code before it appears in the browser?

Can I get my IDE and my linter to work together on my React and JSX code.

Testing seems like magic.  Dependency injection seems like magic.  There's a whole lot of magic!

## Aims of this repository

Provide a step by step approach to building a complex web app, without a build process.

After implementing each change, take a look at the browser and see the immediate update.

# Building the TODO App

Create a custom element.  Here we leverage Google's lit-element library (which extends the basic Element class).
There's a good comparison of [lit-html vs React](https://codeburst.io/a-night-experimenting-with-lit-html-585a8c69892a) 
and the rendering speeds.

```javascript
import {html, LitElement, css} from "lit-element";

class ListCreator extends LitElement {
    static get styles() {
        return css`
      div { 
        border: 1px solid #dddddd; 
        padding: 5px 10px; 
      }
    `;
    }

    render() {
        return html`
            <div id="remind-me-wrapper">
            </div>`;
    }
}

customElements.define("list-creator", ListCreator);
```

The class we've just created is a first class element, it extends Element.

Start with a simple index.html page and a bit of style.  Not the script tag has a type: module.
This ensures the javascript is loaded as an ES module and it's encapsulation is respected.
```html
<main>
    <h1>Monday Knowledge Sharing</h1>
    <list-creator>
    </list-creator>
</main>
<script src="./demo/list-creator.js" type="module"></script>
```

Add a title.
```html
<list-creator>
    <h2>Dynamic List Creator</h2>
</list-creator>
```

## Slots

We can't see the title because the element doesn't know how or where to render it.  So there
is a special element called <slot> which can be named and allows custom components to be
composed.  Also, we'll add a general purpose slot as a catch-all for anything else.

```javascript
    render() {
        return html`
            <div id="remind-me-wrapper">
                <slot name="title"></slot>
                <slot></slot>
            </div>`;
    }
```

## CSS Encapsulation in the Shadow DOM

Lets add another custom component.
```javascript
import { LitElement, html, css } from "lit-element";

class RemindMeTo extends LitElement {

    static get styles() {
        return css`
      input {
        background: #e5e5e5;
        border: none;
      }
    `;
    }

    render() {
        return html`
      <input 
            type="text"
            id="remind-me-input"
            name="remind-me"
            placeholder="Remind me to..." />
      <button @click="${this.handleClick}">Remind Me</button>
    `;
    }
}

customElements.define("remind-me-to", RemindMeTo);
```

And now add it to our page.  Don't forgot the slot in list-creator.
```html
<h1>Monday Knowledge Sharing</h1>
<list-creator>
    <h2 slot="title">Dynamic List Creator</h2>
    <remind-me-to slot="list-item-generator"></remind-me-to>
</list-creator>
```

To see the CSS styling, not we created style for <input>, ordinarily this would apply to every
input tag on the page but if we add an input within our custom component...
```html
<h1>Monday Knowledge Sharing</h1>
<list-creator>
    <h2 slot="title">Dynamic List Creator</h2>
    <remind-me-to slot="list-item-generator"></remind-me-to>
    <input type="text" />
</list-creator>
```

## Custom Events

Adding an event listener is the general purpose way to capture events.  However, to make
it a little more declarative, the Open-WC.org people have provided a bit of syntactic sugar.

```javascript
import { LitElement, html, css } from "lit-element";
class RemindMeTo extends LitElement {
    render() {
        return html`
          <input 
                type="text"
                id="remind-me-input"
                name="remind-me"
                placeholder="Remind me to..." />
          <button @click="${this.handleClick}">Remind Me</button>
        `;}
    handleClick() {
        console.log("Remind me to", this.remindMeInput.value);
        this.dispatchEvent(new CustomEvent(
            'remind-me', 
            { detail: this.remindMeInput.value, bubbles: true }));
        this.remindMeInput.value = '';
    }
    get remindMeInput() {
        return this.shadowRoot.getElementById('remind-me-input');
    }
}
```

Now we need to capture the custom event.  We'll use the list creator as an orchestrator.
As a general rule, events are used to pass data from child to a parent and properties or
attributes are used to pass data from a parent to a child.

```javascript
    render() {
        return html`
            <div id="remind-me-wrapper" @remind-me="${this.handleReminder}">
              <slot name="title"></slot>
              <slot name="list-item-generator"></slot>
              <slot></slot>
            </div>`;
    }

    handleReminder({detail}) {
        console.log("List Creator says remind me to", detail);
    }
```

## Setting properties on a custom element

Let's create a customer element called <reminder-list>, and add it as a sibling to <remind-me-to>

```html
<h1>Monday Knowledge Sharing</h1>
<list-creator>
    <h2 slot="title">Dynamic List Creator</h2>
    <remind-me-to slot="list-item-generator"></remind-me-to>
    <reminder-list slot="reminder-list"></reminder-list>
    <input type="text" />
</list-creator>
```

We can't just append children to a custom element.  As we've seen you can only declaratively
add child elements using slots.  You can't access the shadow dom so there is no way to append
child elements.  But custom elements can expose properties or attributes which can be set.  So
our <reminder-list> element is as follows:

```javascript
// LitElement and html are the basic required imports
import { LitElement, html, css } from "lit-element";

class ReminderList extends LitElement {
    static get properties() {
        return { reminders: { type: Array }}; 
    }
    constructor() {
        super();
        this.reminders = [];
    }

    render() {
        return html`<ul class="style-me">
        ${this.reminders.map(
            reminder => html`<li>${reminder}</li>`)}
        </ul>`;
    }
}
customElements.define("reminder-list", ReminderList);
```

Now setting *reminders* will cause the element to re-render and output <li> elements.

## The orchestration

There's a first time for everything and orchestrating sibling components is a first for me.
In the <list-creator> we need to change the handleReminder() method.

```javascript
    handleReminder({detail}) {
        console.log("List Creator says remind me to", detail);
        const reminders = this.shadowRoot.querySelector("slot[name='reminder-list']").assignedNodes()[0];
        reminders.reminders = [...reminders.reminders, detail];
    }
```

It's a little complex but the parent <list-creator> handles it as follows:
* find the <slot> with a name of 'reminder-list'
* get the first node which has been assigned there
* then get the existing array of list items and append the new item.

# Summary

Changes to html and javascript files are instantly visible by reloading the browser page.  
To manage Node dependencies, es-dev-server provided by Open-WC manages the resolution
of Node libraries.

The encapsulation with ES Modules feels like real programming; when HTML modules and CSS modules arrive the encapsulation
journey will be more complete and UI development will feel like our server side sibling.

I hope you're intrigued to look at what modern browsers have to offer.
They're a little different from existing frameworks like Angular or React but these are the open standards, 
being adopted by everyone.  There is an increasing amount of tutorials and help on these topics.
If you're building applications for the future, I'd recommend starting with [Open-WC](https://open-wc.org).

## A couple of final notes

Node.js
It works and Open-WC's libraries are managed by node.  One issue
is that there are a number of libraries which don't support ES modules and that can be a
problem.  I encourage you all to raise issues on libraries which don't offer module support.

Testing
It's essential to test the apps in a browser, so a setup of Karma, Chrome-headless with
Mocha has proven reliable.

