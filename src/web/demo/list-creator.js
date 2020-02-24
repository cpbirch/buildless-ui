// LitElement and html are the basic required imports
import {html, LitElement, css} from "lit-element";

// Create a class definition for your component and extend the LitElement base class
class ListCreator extends LitElement {

    static get styles() {
        return css`
      div { 
        border: 1px solid #dddddd; 
        padding: 5px 10px; 
      }
    `;
    }

    // The render callback renders your element's template. This should be a pure function,
    // it should always return the same template given the same properties. It should not perform
    // any side effects such as setting properties or manipulating the DOM. See the updated
    // or first-updated examples if you need side effects.
    render() {
        // Return the template using the html template tag. lit-html will parse the template and
        // create the DOM elements
        return html`
            <div id="remind-me-wrapper" @remind-me="${this.handleReminder}">
              <slot name="title"></slot>
              <slot name="list-item-generator"></slot>
              <slot name="reminder-list"></slot>
              <slot></slot>
            </div>`;
    }

    handleReminder({detail}) {
        console.log("List Creator says remind me to", detail);
        const reminders = this.shadowRoot.querySelector("slot[name='reminder-list']").assignedNodes()[0];
        reminders.reminders = [...reminders.reminders, detail];
    }
}

// Register your element to custom elements registry, pass it a tag name and your class definition
// The element name must always contain at least one dash
customElements.define("list-creator", ListCreator);
