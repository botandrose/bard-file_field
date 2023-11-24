import { LitElement, html } from "lit"
import { render } from "lit-html"
import styles from 'uploaded-file-css'
import Mime from "mime-lite"

//import { get } from "rails-request-json"
import { FetchRequest } from '@rails/request.js'
async function get(url, payload) {
  const request = new FetchRequest("get", url, {
    headers: { Accept: "application/json" },
    body: payload,
  })
  const response = await request.perform()
  // FIXME doesn't deal with 304s. push upstream?
  if(response.response.ok) {
    return response.json
  }
}

export default class UploadedFile extends LitElement {
  static styles = styles

  static properties = {
    name: { type: String, reflect: true },
    value: { type: String, reflect: true },
    filename: { type: String, reflect: true },
    src: { type: String, reflect: true },
    mimetype: { type: String, reflect: true },
    size: { type: Number, reflect: true },

    state: { state: true },
    percent: { state: true },
    file: { state: true },
  }

  static fromProperties(props) {
    return Object.assign(new UploadedFile(), {
      ...props,
      size: 0, // HACK always pass max file check
      state: "complete",
      percent: 100,
      file: null,
    })
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
      return UploadedFile.fromProperties({
        ...props,
        filename: blob.filename,
        mimetype: blob.content_type,
        size: blob.byte_size,
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
        <div class="direct-upload separate-upload direct-upload--${this.state}">
          <div class="direct-upload__progress" style="width: ${this.percent}%"></div>
          <span class="direct-upload__filename">${this.filename}</span>
        </div>
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
}

customElements.define('uploaded-file', UploadedFile)

