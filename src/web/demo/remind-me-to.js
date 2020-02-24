// LitElement and html are the basic required imports
import { LitElement, html, css } from "lit-element";

class RemindMeTo extends LitElement {

    static get styles() {
        return css`
      button {
        font-size: 14px;
      }

      input {
        background: #e5e5e5;
        border: none;
        height: 38px;
        padding-left: 10px;
        margin-right: 5px;
        font-size: 100%;
        border-radius: 5px;
        grid-column: 1;
        grid-row: 1;
      }
    `;
    }

    get remindMeInput() {
        return this.shadowRoot.getElementById('remind-me-input');
    }

    handleClick() {
        console.log("Remind me to", this.remindMeInput.value);
        this.dispatchEvent(new CustomEvent('remind-me', { detail: this.remindMeInput.value, bubbles: true }));
        this.remindMeInput.value = '';
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
