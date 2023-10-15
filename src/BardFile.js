import { html, css, LitElement } from 'lit'
import { render } from "lit-html"
import styles from "./css.js"
import getMimeType from "./get_mime_type"
import formatBytes from "./format_bytes"
import isConstructor from "./is_constructor"
import FormController from "./form-controller"

export class BardFile extends LitElement {
  static styles = styles

  static properties = {
    name: { type: String },
    directupload: { type: String },
    multiple: { type: Boolean },

    previewfilename: { type: String },
    previewsrc: { type: String },

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
  }

  openFilePicker() {
    this.fileTarget.click()
  }

  fileTargetChanged(event) {
    // if(this.inputTarget.signedId) {
    //   get(`/previews/${this.inputTarget.signedId}`).then(r=>r.json).then(blob => {
    //     this.renderPreview({ mimetype: "unavailable", name: blob.filename })
    //   })
    // } else {
      Promise.all(Array.from(this.fileTarget.files).map(file => {
        return getMimeType(file).then(mimetype => {
          file.mimetype = mimetype
          file.src = URL.createObjectURL(file)
          return file
        })
      })).then(files => {
        if(this.validate(files)) {
          this.files = files
          this.formController.inputChanged(event, this.textTarget)
        } else {
          this.title = this.errors.map(e => `${e}. `)
          this.textTarget.value = ""
          this.fileTarget.value = ""
          this.fileTarget.dispatchEvent(new Event("change"))
        }
      })
    // }
  }

  validate(files) {
    this.errors = []
    const label = document.querySelector(`label[for='${this.originalId}']`).innerText

    files.forEach(file => {
      if(!new RegExp(this.acceptsRegex).test(file.mimetype)) {
        this.errors.push(`${label} must be a ${this.accepts}`)
      }

      if(file.size > this.max) {
        this.errors.push(`${label} must be smaller than ${formatBytes(this.max)}, and "${file.name}" is ${formatBytes(file.size)}. Please attach a smaller file.`)
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

  firstUpdated() { // Light DOM
    render(html`
      <input
        id="${this.originalId}"
        type="file"
        multiple="${this.multiple}"
        required="${this.required}"
        data-direct-upload-url="${this.directupload}"

        @direct-upload:initialize="${this.init}"
        @direct-upload:start="${this.start}"
        @direct-upload:progress="${this.progress}"
        @direct-upload:error="${this.error}"
        @direct-upload:end="${this.end}"

        @change="${this.fileTargetChanged}"
      >
      <input
        name="${this.name}"
        type="text"
      >
    `, this, { host: this })

    this.fileTarget = this.firstElementChild
    this.textTarget = this.lastElementChild
  }

  render() { // Shadow DOM
    return html`
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
      const blobUrl = URL.createObjectURL(file)
      klass = "image-preview"
      media = html`<img src='${blobUrl}'>`
    } else if(file.mimetype === "video/mp4") {
      const blobUrl = URL.createObjectURL(file)
      klass = "video-preview"
      media = html`<video src='${blobUrl}' onclick='this.paused ? this.play() : this.pause(); return false'>`
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
        <a class="remove-media" href="#" style="opacity: 1" data-action="file-preview#remove" data-file-preview-index-param="${index}"><span>Remove media</span></a>
        ${media}
      </figure>
    `
  }
}
