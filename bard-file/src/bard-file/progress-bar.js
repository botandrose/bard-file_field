import { LitElement, html } from "lit"
import styles from 'progress-bar-css'

export default class ProgressBar extends LitElement {
  static styles = styles

  static properties = {
    percent: { type: Number },
    title: { type: String },
  }

  render() {
    return html`
      <div class="bar" style="width: ${this.percent}%"></div>
      <span>${this.title}</span>
    `
  }
}

customElements.define('progress-bar', ProgressBar)
