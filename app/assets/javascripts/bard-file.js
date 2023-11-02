import { html, css, LitElement } from 'lit'
import { render } from "lit-html"
import styles from "bard-file/css"
import formatBytes from "bard-file/format-bytes"
import isConstructor from "bard-file/is-constructor"
import FormController from "bard-file/form-controller"
import Mime from "mime"
import { get } from "rails-request-json"

class BardFile {
  static fromProperties(props) {
    const bardFile = new BardFile()
    bardFile.src = props.src
    bardFile.mimetype = props.mimetype
    bardFile.name = props.name
    bardFile.size = 0 // HACK always pass max file check
    return bardFile
  }

  static fromFile(file) {
    const bardFile = new BardFile()
    bardFile.src = URL.createObjectURL(file)
    bardFile.name = file.name
    const extension = file.name.split(".").at(-1)
    bardFile.mimetype = Mime.getType(extension)
    bardFile.size = file.size
    return bardFile
  }
}

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

    state: { state: true },
    title: { state: true },
    percent: { state: true },
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
        this.files = [BardFile.fromProperties({
          name: blob.filename,
        })]
      })
    }
  }

  fileTargetChanged(event) {
    const files = Array.from(this.fileTarget.files).map(f => BardFile.fromFile(f))
    if(this.validate(files)) {
      this.title = files[0]?.name
      this.files = files
      this.textTarget.setCustomValidity("")
      this.formController.inputChanged(event, this.textTarget)
    } else {
      this.title = this.errors.map(e => `${e}. `).join("")
      this.files = []
      this.textTarget.value = ""
      this.textTarget.setCustomValidity(this.title)
      this.fileTarget.value = ""
    }
    this.textTarget.reportValidity()
  }

  validate(files) {
    this.errors = []
    const label = document.querySelector(`label[for='${this.originalId}']`).innerText

    files.forEach(file => {
      if(this.accepts) {
        if(!new RegExp(this.acceptsRegex).test(file.mimetype)) {
          this.errors.push(`${label} must be a ${this.accepts}`)
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
    this.state = "pending"
    this.previewfilename = file.name
    this.percent = 0
    this.formController.init(event)
  }

  start(event) {
    this.state = "uploading"
    this.formController.start(event)
  }

  progress(event) {
    const { id, progress } = event.detail
    this.percent = progress
    this.formController.progress(event)
  }

  error(event) {
    event.preventDefault()
    const { id, error } = event.detail
    this.state = "error"
    this.error = error
    this.formController.error(event)
  }

  end(event) {
    this.state = "complete"
    this.formController.end(event)
  }

  removeFile(index) {
    this.files.splice(index, 1)
    this.textTarget.value = ""
    this.fileTarget.value = ""
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

        <!-- HACK extra target for queue submissions -->
        <div class="media-preview -stacked"></div>

        <p>${this.title}</p>

        <div class="media-preview ${this.multiple ? "-stacked" : ''}" data-file-preview-target="previews">
          ${this.files.map((file, index) => this.renderPreview(file, index))}
        </div>
      </label>
    `;
  }

  renderPreview(file, index) {
    let klass, media
    if(["image/jpeg", "image/png"].includes(file.mimetype)) {
      const url = file.src || URL.createObjectURL(file)
      klass = "image-preview"
      media = html`<img src='${url}'>`
    } else if(file.mimetype === "video/mp4") {
      const url = file.src || URL.createObjectURL(file)
      klass = "video-preview"
      media = html`<video src='${url}' onclick='this.paused ? this.play() : this.pause(); return false'>`
    } else {
      klass = "missing-preview"
      media = "This media does not offer a preview"
    }

    return html`
      <figure class="${klass}">
        <div class="direct-upload separate-upload direct-upload--${this.state}">
          <div class="direct-upload__progress" style="width: ${this.percent}%"></div>
          <span class="direct-upload__filename">${file.name}</span>
        </div>
        <a class="remove-media" @click="${{ handleEvent: e => { this.removeFile(index); e.stopPropagation() } }}" href="#">
          <span>Remove media</span>
        </a>
        ${media}
      </figure>
    `
  }
}

customElements.define("bard-file", BardFileField)