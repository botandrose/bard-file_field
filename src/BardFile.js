import { html, css, LitElement } from 'lit'
import { render } from "lit-html"
import styles from "./css.js"
import getMimeType from "./get_mime_type"
import isConstructor from "./is_constructor"

export class BardFile extends LitElement {
  static styles = styles

  static properties = {
    name: { type: String },
    multiple: { type: Boolean },
    required: { type: Boolean },
    previewfilename: { type: String },
    previewsrc: { type: String },
    accept: { type: String },
    directupload: { type: String },

    files: { state: true },
    highlighted: { state: true },
  }

  constructor() {
    super()

    this.files = []
    this.highlighted = false

    this.originalId = this.id
    this.removeAttribute("id")

    /*
    if options[:require_type].present?
      if options[:require_type] == "image"
        regex = "^image/"
        message = options[:multiple] ? "must all be images" : "must be an image"
      elsif options[:require_type] == "pdf"
        regex = "^application/pdf$"
        message = options[:multiple] ? "must all be PDFs" : "must be a PDF"
      else
        regex = "^(image|video)/"
        message = options[:multiple] ? "files must be images and/or videos" : "must be an image or a video"
      end

      file_field_data_options.merge!({
        controller: "validate-mime-type",
        validate_mime_type_regex_value: regex,
        validate_mime_type_message_value: message,
      })
    end

    preview_data_options = {}
    if options[:require_some]
      file_field_data_options.merge!(require_some_target: "field")
      preview_data_options.merge!(require_some_target: "preview")
    end
    */
  }

  openFilePicker() {
    this.fileTarget.click()
  }

  firstUpdated() {
    render(html`
      <input
        id="${this.originalId}"
        name="${this.name}"
        type="file"
        multiple="${this.multiple}"
        required="${this.required}"
      >
      <input
        DISABLED-name="${this.name}"
        type="text"
      >
    `, this)

    this.fileTarget = this.firstElementChild
    this.fileTarget.addEventListener("change", event => this.fileTargetChanged(event))

    this.textInput = this.lastElementChild
  }

  fileTargetChanged(event) {
    Promise.all(Array.from(this.fileTarget.files).map(file => {
      return getMimeType(file).then(mimetype => {
        file.mimetype = mimetype
        file.src = URL.createObjectURL(file)
        return file
      })
    })).then(files => this.files = files)
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

  render() {
    return html`
      <label class="drag-media ${this.class} ${this.highlighted ? "-dragover" : ''}" data-controller="direct-upload-progress"
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

        <div class="media-preview ${this.multiple ? "-stacked" : ''}" data-file-preview-target="previews">
          ${this.files.map(this.renderPreview)}
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
        <a class="remove-media" href="#" style="opacity: 1" data-action="file-preview#remove" data-file-preview-index-param="${index}"><span>Remove media</span></a>
        <figcaption>${file.name}</figcaption>
        ${media}
      </figure>
    `
  }
}
