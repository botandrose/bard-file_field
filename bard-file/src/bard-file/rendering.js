import { html } from "lit"
import { render } from "lit-html"
import DragAndDrop from "drag-and-drop"

const Rendering = superClass => class extends superClass {
  firstUpdated() {
    this.fileTarget = this.querySelector("input[type=file]")
  }

  renderLightDOM() {
    render(html`
      <input type="file"
        style="opacity: 0.01; position: absolute; z-index: -999"
        id="${this.originalId}"
        .multiple="${this.multiple}"
        data-direct-upload-url="${this.directupload}"
        @change="${this.fileTargetChanged}"
        ?required=${this.files.length === 0 && this.required}
      >
      ${this.files.length > 0
        ? this.files
        : html`<input type="hidden" name=${this.name}>`
      }
    `, this, { host: this })
  }

  render() { // Shadow DOM
    this.renderLightDOM()

    return html`
      <drag-and-drop target="${this.originalId}">
        <i class="drag-icon"></i>
        <strong>Choose ${this.multiple ? "files" : "file"} </strong>
        <span>or drag ${this.multiple ? "them" : "it"} here.</span>

        <div class="media-preview ${this.multiple ? "-stacked" : ''}">
          <slot>
          </slot>
        </div>
      </drag-and-drop>
    `
  }
}

export default Rendering
