import { html } from 'lit'
import Mime from "mime"

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

export default class BardFile {
  static fromProperties(props) {
    return Object.assign(new BardFile(), props, {
      size: 0, // HACK always pass max file check
      state: "complete",
      percent: 100,
      file: null,
    })
  }

  static fromFile(file) {
    const extension = file.name.split(".").at(-1)
    return Object.assign(new BardFile(), {
      src: URL.createObjectURL(file),
      name: file.name,
      mimetype: Mime.getType(extension),
      size: file.size,
      state: "pending",
      percent: 0,
      file: file,
    })
  }

  static fromSignedId(signedId) {
    return get(`/rails/active_storage/blobs/info/${signedId}`).then(blob => {
      return BardFile.fromProperties({
        name: blob.filename,
        mimetype: blob.content_type,
        size: blob.byte_size,
        signedId: signedId,
      })
    })
  }

  render(removeCallback) {
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
      <figure class="${klass}">
        <div class="direct-upload separate-upload direct-upload--${this.state}">
          <div class="direct-upload__progress" style="width: ${this.percent}%"></div>
          <span class="direct-upload__filename">${this.name}</span>
        </div>
        <a class="remove-media" @click="${{ handleEvent: e => { e.stopPropagation(); e.preventDefault(); removeCallback(); } }}" href="#">
          <span>Remove media</span>
        </a>
        <p>${media}</p>
      </figure>
    `
  }
}
