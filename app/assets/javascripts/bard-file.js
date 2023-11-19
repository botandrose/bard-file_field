import { LitElement } from "lit"
import styles from "bard-file/css"
import BardFile from "bard-file/file"
import DirectUpload from "bard-file/direct-upload"
import DragAndDrop from "bard-file/drag-and-drop"
import Validations from "bard-file/validations"
import Rendering from "bard-file/rendering"

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

  textTargetChanged(event) {
    this.files = []
    this.append(event.target.value)
  }

  append(value) {
    const signedIds = this.signedIdsFromValue(value)
    const promises = signedIds.map(signedId => BardFile.fromSignedId(signedId))
    Promise.all(promises).then(bardFiles => {
      this.assignFiles(bardFiles)
    })
  }

  fileTargetChanged(event) {
    const newFiles = Array.from(this.fileTarget.files).map(f => BardFile.fromFile(f))
    this.fileTarget.value = null
    this.assignFiles(newFiles)
    if(this.checkValidity()) {
      this.formController.uploadFiles(this)
    } else {
      this.files = []
      this.textTarget.value = null
    }
  }

  signedIdsFromValue(value) {
    let signedIds = []
    if(typeof value == "string" && value.length > 0) {
      signedIds = value.split(",")
    }
    if(Array.isArray(value)) {
      signedIds = value
    }
    return signedIds
  }

  assignFiles(bardFiles) {
    if(this.multiple) {
      this.files.push(...bardFiles)
    } else {
      this.files = bardFiles.slice(-1)
    }
    this.requestUpdate()
    this.writeSignedIds()
    this.dispatchEvent(new Event("change"))
  }

  removeFile(index) {
    this.files.splice(index, 1)
    this.requestUpdate()
    this.writeSignedIds()
  }

  openFilePicker() {
    this.fileTarget.click()
  }
}

Object.assign(BardFileField.prototype,
  Validations,
  DragAndDrop,
  DirectUpload,
  Rendering,
)

customElements.define("bard-file", BardFileField)
