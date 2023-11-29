import { LitElement, html } from "lit"
import { render } from "lit-html"
import styles from 'uploaded-file-css'
import Mime from "mime-lite"
import { get } from "rails-request-json"
import "progress-bar"

export default class UploadedFile extends LitElement {
  static styles = styles

  static properties = {
    name: { type: String, reflect: true },
    value: { type: String, reflect: true },
    filename: { type: String, reflect: true },
    src: { type: String, reflect: true },
    mimetype: { type: String, reflect: true },
    size: { type: Number, reflect: true },

    accepts: { type: String },
    max: { type: Number },

    state: { state: true },
    percent: { state: true },
    file: { state: true },
  }

  static fromFile(file, props={}) {
    const extension = file.name.split(".").at(-1)
    return Object.assign(new UploadedFile(), {
      ...props,
      src: URL.createObjectURL(file),
      filename: file.name,
      mimetype: Mime.getType(extension),
      size: file.size,
      state: "pending",
      percent: 0,
      file: file,
    })
  }

  static fromSignedId(signedId, props={}) {
    return get(`/rails/active_storage/blobs/info/${signedId}`).then(blob => {
      return Object.assign(new UploadedFile(), {
        ...props,
        // src: FIXME
        filename: blob.filename,
        mimetype: blob.content_type,
        size: blob.byte_size,
        state: "complete",
        percent: 100,
        value: signedId,
      })
    })
  }

  render() {
    let klass, media
    if(["image/jpeg", "image/png"].includes(this.mimetype)) {
      klass = "image-preview"
      media = html`<img src='${this.src}'>`
    } else if(this.mimetype === "video/mp4") {
      klass = "video-preview"
      media = html`<video src='${this.src}' onclick='this.paused ? this.play() : this.pause(); return false'>`
    } else {
      klass = "missing-preview"
      media = "This media does not offer a preview"
    }

    return html`
      <slot>
      </slot>
      <figure class="${klass}">
        <progress-bar percent=${this.percent} title=${this.filename} class="separate-upload direct-upload--${this.state}"></progress-bar>
        <a class="remove-media" @click=${this.removeSelf} href="#">
          <span>Remove media</span>
        </a>
        <p>${media}</p>
      </figure>
    `
  }

  removeSelf(event) {
    event.stopPropagation()
    event.preventDefault()
    this.parentNode.removeFile(this)
  }

  updated(changedProperties) {
    render(html`
      <input type="hidden" name="${this.name}" value="${this.value}">
    `, this, { host: this })
  }

  checkValidity() {
    let errors = []
    errors.push(...new Accepts(this).errors)
    errors.push(...new Max(this).errors)
    this.setCustomValidity(errors.join(" "))
    // this.reportValidity() // fire invalid event?
    return errors.length === 0
  }

  setCustomValidity(msg) {
    this.validationMessage = msg
  }
}

class Accepts {
  constructor(uploadedFile) {
    this.errors = []

    const accepts = uploadedFile.accepts ? uploadedFile.accepts.split(/,\s*/) : []
    const regexes = accepts.map(accept => {
      const regex = this.regexMap[accept]
      if(!regex) console.error(`Unknown accepts type: ${accept}`)
      return regex
    }).filter(r => !!r) // discard not found

    if(regexes.length > 0 && !regexes.some(regex => regex.test(uploadedFile.mimetype))) {
      this.errors.push(`Must be a ${this.joinWords(accepts)}.`)
    }
  }

  get regexMap() {
    return {
      image: new RegExp("^image/.+$"),
      video: new RegExp("^video/.+$"),
      pdf: new RegExp("^application/pdf$"),
    }
  }

  joinWords(words) {
    if(words.length >= 3) {
      return (words.slice(0, -1) + [`or ${words.at(-1)}`]).join(", ")
    } else {
      return words.join(" or ")
    }
  }
}

class Max {
  constructor(uploadedFile) {
    this.uploadedFile = uploadedFile
  }

  get errors() {
    if(this._errors) return this._errors
    this._errors = []
    if(!this.checkValidity()) {
      this._errors.push(this.errorMessage)
    }
    return this._errors
  }

  checkValidity() {
    if(!this.uploadedFile.max) return true
    return this.uploadedFile.size <= this.uploadedFile.max
  }

  get errorMessage() {
    return [
      `Must be smaller than ${this.formatBytes(this.uploadedFile.max)},`,
      `and "${this.uploadedFile.filename}" is ${this.formatBytes(this.uploadedFile.size)}.`,
      `Please attach a smaller file.`,
    ].join(" ")
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
  }
}

customElements.define('uploaded-file', UploadedFile)

