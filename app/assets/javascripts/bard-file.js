import { html, css, LitElement } from 'lit'
import { render } from "lit-html"
import styles from "bard-file/css"
import BardFile from "bard-file/file"
import FormController from "bard-file/form-controller"
import DragAndDrop from "bard-file/drag-and-drop"
import Validations from "bard-file/validations"
//import { get } from "rails-request-json"

import { FetchRequest } from '@rails/request.js'

const request = (verb, url, payload) => {
  const req = new FetchRequest(verb, url, {
    headers: { Accept: "application/json" },
    body: payload,
  })
  return req.perform().then(response => {
    // FIXME doesn't deal with 304s. push upstream?
    // if(response.response.headers.get('Content-Length') > 0) {
    if(response.response.ok) {
      return response.json
    }
  })
}

const get = (url, payload) => request('get', url, payload)

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
      get(`/rails/active_storage/blobs/info/${signedId}`).then(blob => {
        this.files = [
          BardFile.fromProperties({
            name: blob.filename,
            mimetype: blob.content_type,
            size: blob.byte_size,
          })
        ]
        this.dispatchEvent(new Event("change"))
      })
    }
  }

  fileTargetChanged(event) {
    this.files = Array.from(this.fileTarget.files).map(f => BardFile.fromFile(f))
    if(this.checkValidity()) {
      this.formController.uploadFiles(this)
    } else {
      this.files = []
      this.textTarget.value = null
      this.fileTarget.value = null
    }
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
    this.files.forEach((bardFile, index) => {
      Array.from(this.querySelectorAll("input[type=hidden]")).forEach(e => e.parentNode.removeChild(e))
      if(index === 0) {
        this.textTarget.value = bardFile.signedId
      } else {
        this.insertAdjacentHTML("beforeend",
          `<input type="hidden" name="${this.name}" value="${bardFile.signedId}">`
        )
      }
    })
  }
}

Object.assign(BardFileField.prototype,
  Validations,
  DragAndDrop,
)

customElements.define("bard-file", BardFileField)
