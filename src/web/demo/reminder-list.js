// LitElement and html are the basic required imports
import { LitElement, html, css } from "lit-element";

class ReminderList extends LitElement {

    static get properties() {
        return {
            reminders: { type: Array }
        };
    }

    constructor() {
        super();
        this.reminders = [];
    }

    render() {
        return html`<ul class="style-me">
        ${this.reminders.map(
            reminder => html`
            <li>${reminder}</li>
          `
        )}</ul>
    `;
    }
}

customElements.define("reminder-list", ReminderList);
