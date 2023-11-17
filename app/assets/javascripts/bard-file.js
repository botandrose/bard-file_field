import { html, css, LitElement } from 'lit'
import { render } from "lit-html"
import styles from "bard-file/css"
import BardFile from "bard-file/file"
import formatBytes from "bard-file/format-bytes"
import isConstructor from "bard-file/is-constructor"
import FormController from "bard-file/form-controller"
import { get } from "rails-request-json"

class BardFileField extends LitElement {
  static styles = styles

  static properties = {
    name: { type: String },
    directupload: { type: String },
    multiple: { type: Boolean },

    previewsrc: { type: String },
    previewfilename: { type: String },
    previewmimetype: { type: String },

    required: { type: Boolean },
    accepts: { type: String },
    max: { type: Number },

    files: { state: true },
    highlighted: { state: true },
  }

  constructor() {
    super()

    this.files = []
    this.highlighted = false

    this.originalId = this.id
    this.removeAttribute("id")
  }

  connectedCallback() {
    super.connectedCallback()
    this.formController = FormController.forForm(this.closest("form"))

    if(this.previewsrc) {
      this.files = [
        BardFile.fromProperties({
          src: this.previewsrc,
          mimetype: this.previewmimetype,
          name: this.previewfilename,
        })
      ]
    }
  }

  openFilePicker() {
    this.fileTarget.click()
  }

  textTargetChanged(event) {
    const signedId = event.target.value
    if(signedId.length > 0) {
      get(`/previews/${signedId}`).then(blob => {
        this.files = [
          BardFile.fromProperties({
            name: blob.filename,
            mimetype: blob.content_type,
            size: blob.byte_size,
          })
        ]
      })
    }
  }

  fileTargetChanged(event) {
    const files = Array.from(this.fileTarget.files).map(f => BardFile.fromFile(f))
    if(this.validate(files)) {
      this.files = files
      this.textTarget.setCustomValidity("")
      this.formController.uploadFiles(this)
    } else {
      this.files = []
      this.textTarget.value = null
      this.textTarget.setCustomValidity(this.errors.join(" "))
      this.fileTarget.value = null
    }
    this.textTarget.reportValidity()
  }

  validate(files) {
    this.errors = []
    const label = document.querySelector(`label[for='${this.originalId}']`).innerText

    files.forEach(file => {
      if(this.accepts) {
        if(!new RegExp(this.acceptsRegex).test(file.mimetype)) {
          this.errors.push(`${label} must be a ${this.accepts}.`)
        }
      }

      if(this.max) {
        if(file.size > this.max) {
          this.errors.push(`${label} must be smaller than ${formatBytes(this.max)}, and "${file.name}" is ${formatBytes(file.size)}. Please attach a smaller file.`)
        }
      }
    })

    return this.errors.length == 0
  }

  get acceptsRegex() {
    switch(this.accepts) {
      case "image": return "^image/.+$"
      case "video": return "^video/.+$"
      case "pdf": return "^application/pdf$"
      default: console.error(`Unknown accepts type: ${this.accepts}`)
    }
  }

  drop(event) {
    this.unhighlight(event)

    const droppedFiles = event.dataTransfer.files

    if(isConstructor(DataTransfer)) { // Modern browsers can use this trick to append files
      const list = new DataTransfer()
      Array.from(this.fileTarget.files).forEach(file => list.items.add(file))
      Array.from(droppedFiles).forEach(file => list.items.add(file))
      this.fileTarget.files = list.files
    } else {
      // Safari can't append files, so just replace
      this.fileTarget.files = droppedFiles
    }

    this.fileTarget.dispatchEvent(new Event("change"))
  }

  highlight(event) {
    this.halt(event)
    this.highlighted = true
  }

  unhighlight(event) {
    this.halt(event)
    this.highlighted = false
  }

  halt(event) {
    event.preventDefault()
    event.stopPropagation()
  }

  init(event) {
    const { id, file } = event.detail
    const bardFile = this.files[0] // FIXME
    bardFile.state = "pending"
    bardFile.percent = 0
    this.requestUpdate()
    this.formController.init(event)
  }

  start(event) {
    const bardFile = this.files[0] // FIXME
    bardFile.state = "pending"
    this.requestUpdate()
    this.formController.start(event)
  }

  progress(event) {
    const { id, progress } = event.detail
    const bardFile = this.files[0] // FIXME
    bardFile.percent = progress
    this.requestUpdate()
    this.formController.progress(event)
  }

  error(event) {
    event.preventDefault()
    const { id, error } = event.detail
    const bardFile = this.files[0] // FIXME
    bardFile.state = "error"
    bardFile.error = error
    this.requestUpdate()
    this.formController.error(event)
  }

  end(event) {
    const bardFile = this.files[0] // FIXME
    bardFile.state = "complete"
    bardFile.percent = 100
    this.requestUpdate()
    this.formController.end(event)
  }

  removeFile(index) {
    this.files.splice(index, 1)
    this.textTarget.value = null
    this.fileTarget.value = null
    this.fileTarget.dispatchEvent(new Event("change"))
  }

  firstUpdated() { // Light DOM
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


    // override textTarget.value= setter to fire change event to catch mutation via form-persistence NPM package
    var descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")
    var inputSetter = descriptor.set

    //Then modify the "setter" of the value to notify when the value is changed:
    descriptor.set = function(val) {
      // changing to native setter to prevent the loop while setting the value
      Object.defineProperty(this, "value", { set: inputSetter })
      this.value = val

      // Custom code triggered when $input.value is set
      this.dispatchEvent(new Event("change"))

      //changing back to custom setter
      Object.defineProperty(this, "value", descriptor)
    }

    //Last add the new "value" descriptor to the input element
    Object.defineProperty(this.textTarget, "value", descriptor);
  }

  render() { // Shadow DOM
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
  }

  writeSignedIds() {
    this.files.forEach((file, index) => {
      Array.from(this.querySelectorAll("input[type=hidden]")).forEach(e => e.parentNode.removeChild(e))
      if(index === 0) {
        // don't use .value= setter because its modified to trigger change event
        // this.textTarget.value = file.signedId
        this.textTarget.setAttribute("value", file.signedId)
      } else {
        const hiddenInput = document.createElement("input")
        hiddenInput.type = "hidden"
        hiddenInput.name = this.name
        hiddenInput.value = file.signedId
        this.insertAdjacentElement("beforeend", hiddenInput)
      }
    })
  }
}

customElements.define("bard-file", BardFileField)
