import { html } from "lit"
import { render } from "lit-html"
import FormController from "bard-file/form-controller"
import DragAndDrop from "bard-file/drag-and-drop"

const Rendering = {
  firstUpdated: function() { // Light DOM
    render(html`
      <input type="file"
        style="opacity: 0.01; position: absolute; z-index: -999"
        id="${this.originalId}"
        .multiple="${this.multiple}"
        data-direct-upload-url="${this.directupload}"

        @direct-upload:initialize="${this.init}"
        @direct-upload:start="${this.start}"
        @direct-upload:progress="${this.progress}"
        @direct-upload:error="${this.error}"
        @direct-upload:end="${this.end}"

        @change="${this.fileTargetChanged}"
      >
      <dialog>
        <div class="direct-upload-wrapper">
          <div class="direct-upload-content">
            <h3>Uploading your media</h3>
            <div id="progress-container"></div>
          </div>
        </div>
      </dialog>
      <input type="text"
        style="opacity: 0.01; position: absolute; z-index: -999"
        .required="${this.required}"
        name="${this.name}"
        @change="${this.textTargetChanged}"
      >
    `, this, { host: this })

    this.fileTarget = this.firstElementChild
    this.dialogTarget = this.querySelector("dialog")
    this.textTarget = this.lastElementChild

    this.formController = FormController.forForm(this.closest("form"), this.dialogTarget)
  },

  render: function() { // Shadow DOM
    return html`
      <slot></slot>

      <drag-and-drop target="${this.originalId}">
        <i class="drag-icon"></i>
        <strong>Choose ${this.multiple ? "files" : "file"} </strong>
        <span>or drag ${this.multiple ? "them" : "it"} here.</span>

        <div class="media-preview ${this.multiple ? "-stacked" : ''}">
          ${this.files.map((file, index) => file.render(() => this.removeFile(index)))}
        </div>
      </drag-and-drop>
    `;
  },

  writeSignedIds: function() {
    this.textTarget.value = null
    Array.from(this.querySelectorAll("input[type=hidden]")).forEach(e => e.parentNode.removeChild(e))

    this.files.forEach((bardFile, index) => {
      if(index === 0) {
        this.textTarget.value = bardFile.signedId
      } else {
        this.insertAdjacentHTML("beforeend",
          `<input type="hidden" name="${this.name}" value="${bardFile.signedId}">`
        )
      }
    })
  },
}

export default Rendering
