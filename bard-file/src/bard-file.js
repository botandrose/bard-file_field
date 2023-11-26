import { LitElement } from "lit"
import styles from "bard-file/css"
import DirectUpload from "bard-file/direct-upload"
import Validations from "bard-file/validations"
import Rendering from "bard-file/rendering"
import UploadedFile from "bard-file/uploaded-file"
import FormController from "form-controller"

class BardFileField extends DirectUpload(Validations(Rendering(LitElement))) {
  static styles = styles

  static properties = {
    name: { type: String },
    directupload: { type: String },
    multiple: { type: Boolean },

    required: { type: Boolean },
    accepts: { type: String },
    max: { type: Number },

    files: { state: true },
  }

  constructor() {
    super()

    this.files = []
    this.originalId = this.id
    this.removeAttribute("id")
  }

  connectedCallback() {
    super.connectedCallback()
    this.formController = FormController.forForm(this.closest("form"))
  }

  get value() {
    return this.files.map(uploadedFile => uploadedFile.value)
  }

  set value(val) {
    this.files = []
    const signedIds = this.signedIdsFromValue(val)
    const promises = signedIds.map(signedId => {
      return UploadedFile.fromSignedId(signedId, { name: this.name })
    })
    Promise.all(promises).then(uploadedFiles => {
      this.assignFiles(uploadedFiles)
    })
  }

  signedIdsFromValue(value) {
    let signedIds = []
    if(typeof value == "string" && value.length > 0) {
      signedIds = value.split(",")
    }
    if(Array.isArray(value)) {
      signedIds = value
    }
    return signedIds.filter(signedId => {
      return signedId.toString().length > 0
    })
  }

  fileTargetChanged(event) {
    const uploadedFiles = Array.from(this.fileTarget.files).map(file => {
      return UploadedFile.fromFile(file, { name: this.name, accepts: this.accepts, max: this.max })
    })
    this.fileTarget.value = null
    this.assignFiles(uploadedFiles)
    if(this.checkValidity()) {
      this.formController.uploadFiles(this)
    } else {
      this.files = []
    }
  }

  assignFiles(bardFiles) {
    if(this.multiple) {
      this.files.push(...bardFiles)
    } else {
      this.files = bardFiles.slice(-1)
    }
    this.requestUpdate()
    this.dispatchEvent(new Event("change"))
  }

  removeFile(file) {
    const index = this.files.indexOf(file)
    this.files.splice(index, 1)
    this.requestUpdate()
    this.dispatchEvent(new Event("change"))
  }
}

customElements.define("bard-file", BardFileField)
