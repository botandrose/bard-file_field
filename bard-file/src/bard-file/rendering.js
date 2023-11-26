import { html } from "lit"
import { render } from "lit-html"
import FileDrop from "file-drop"

const Rendering = superClass => class extends superClass {
  firstUpdated() {
    this.fileTarget = this.querySelector("input[type=file]")
  }

  render() {
    // Light DOM
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

    // Shadow DOM
    return html`
      <file-drop target="${this.originalId}">
        <i class="drag-icon"></i>
        <strong>Choose ${this.multiple ? "files" : "file"} </strong>
        <span>or drag ${this.multiple ? "them" : "it"} here.</span>

        <div class="media-preview ${this.multiple ? "-stacked" : ''}">
          <slot>
          </slot>
        </div>
      </file-drop>
    `
  }
}

export default Rendering
