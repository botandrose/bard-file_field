import { html } from "lit"
import { render } from "lit-html"
import FormController from "form-controller"
import DragAndDrop from "drag-and-drop"

const Rendering = superClass => class extends superClass {
  firstUpdated() {
    this.renderLightDOM()

    this.fileTarget = this.querySelector("input[type=file]")
    this.dialogTarget = this.querySelector("dialog")

    this.formController = FormController.forForm(this.closest("form"), this.dialogTarget)
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
      <dialog>
        <div class="direct-upload-wrapper">
          <div class="direct-upload-content">
            <h3>Uploading your media</h3>
            <div id="progress-container"></div>
          </div>
        </div>
      </dialog>
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
