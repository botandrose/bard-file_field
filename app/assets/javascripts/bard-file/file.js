export default class BardFile {
  static fromProperties(props) {
    const bardFile = new BardFile()
    bardFile.src = props.src
    bardFile.mimetype = props.mimetype
    bardFile.name = props.name
    bardFile.size = 0 // HACK always pass max file check
    bardFile.state = "complete"
    bardFile.percent = 100
    return bardFile
  }

  static fromFile(file) {
    const bardFile = new BardFile()
    bardFile.src = URL.createObjectURL(file)
    bardFile.name = file.name
    const extension = file.name.split(".").at(-1)
    bardFile.mimetype = Mime.getType(extension)
    bardFile.size = file.size
    bardFile.state = "pending"
    bardFile.percent = 0
    return bardFile
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
        ${media}
      </figure>
    `
  }
}


