import { html } from 'lit'
import Mime from "mime"

export default class BardFile {
  static fromProperties(props) {
    return Object.assign(new BardFile(), {
      src: props.src,
      mimetype: props.mimetype,
      name: props.name,
      size: 0, // HACK always pass max file check
      state: "complete",
      percent: 100,
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
        <a class="remove-media" @click="${{ handleEvent: e => { removeCallback(); e.stopPropagation() } }}" href="#">
          <span>Remove media</span>
        </a>
        <p>${media}</p>
      </figure>
    `
  }
}
