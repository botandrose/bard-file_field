import { html } from "lit"
import { render } from "lit-html"

const Rendering = {
  firstUpdated: function() { // Light DOM
    render(html`
      <input
        style="opacity: 0.01; position: absolute; z-index: -999"
        id="${this.originalId}"
        type="file"
        .multiple="${this.multiple}"
        data-direct-upload-url="${this.directupload}"

        @direct-upload:initialize="${this.init}"
        @direct-upload:start="${this.start}"
        @direct-upload:progress="${this.progress}"
        @direct-upload:error="${this.error}"
        @direct-upload:end="${this.end}"

        @change="${this.fileTargetChanged}"
      >
      <input
        style="opacity: 0.01; position: absolute; z-index: -999"
        .required="${this.required}"
        name="${this.name}"
        type="text"
        @change="${this.textTargetChanged}"
      >
    `, this, { host: this })

    this.fileTarget = this.firstElementChild
    this.textTarget = this.lastElementChild
  },

  render: function() { // Shadow DOM
    return html`
      <slot></slot>
      <label class="drag-media ${this.class} ${this.highlighted ? "-dragover" : ''}"
        @click="${this.openFilePicker}"

        @drag="${this.halt}"
        @dragstart="${this.halt}"
        @dragover="${this.highlight}"
        @dragenter="${this.highlight}"
        @dragleave="${this.unhighlight}"
        @dragend="${this.unhighlight}"
        @drop="${this.drop}"
      >
        <i class="drag-icon"></i>
        <strong>Choose ${this.multiple ? "files" : "file"} </strong>
        <span>or drag ${this.multiple ? "them" : "it"} here.</span>

        <div class="media-preview ${this.multiple ? "-stacked" : ''}">
          ${this.files.map((file, index) => file.render(() => this.removeFile(index)))}
        </div>
      </label>
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
