import { DirectUploadController } from "@rails/activestorage"

class MyDirectUploadController extends DirectUploadController {
  constructor(input, bardFile) {
    super(input, bardFile.file)
    this.bardFile = bardFile
  }

  start(callback) {
    this.dispatch("start")
    this.directUpload.create(((error, attributes) => {
      if (error) {
        this.bardFileInput.textTarget.value = null
        this.dispatchError(error)
      } else {
        this.bardFile.value = attributes.signed_id
      }
      this.dispatch("end")
      callback(error)
    }))
  }
}

export default class FormController {
  static forForm(form, dialog) {
    return form.bardFileFormController ||= new FormController(form, dialog)
  }

  constructor(form, dialog) {
    this.element = form
    this.dialog = dialog
    this.progressTargetMap = {}
    this.controllers = []
    this.processing = false
    this.errors = false

    this.progressContainerTarget = this.dialog.querySelector("#progress-container")

    this.element.addEventListener("submit", event => this.submit(event))
    window.addEventListener("beforeunload", event => this.beforeUnload(event))
  }

  beforeUnload(event) {
    if(this.processing) {
      event.preventDefault()
      return (event.returnValue = "")
    }
  }

  uploadFiles(bardFileInput) {
    Array.from(bardFileInput.files).forEach(bardFile => {
      if(bardFile.state === "pending") {
        const controller = new MyDirectUploadController(bardFileInput.fileTarget, bardFile)
        controller.bardFileInput = bardFileInput
        this.controllers.push(controller)
        this.startNextController()
      }
    })
  }

  submit(event) {
    event.preventDefault()
    this.submitted = true
    this.startNextController()
    if(this.processing) {
      this.dialog.showModal()
    }
  }

  startNextController() {
    if(this.processing) return

    const controller = this.controllers.shift()
    if(controller) {
      this.processing = true
      controller.start(error => {
        if(error) {
          Array.from(this.element.querySelectorAll("input[type=file]"))
            .forEach(e => e.disabled = false)
          this.errors = true
        } else {
          this.processing = false
          this.startNextController()
        }
      })
    } else {
      this.submitForm()
    }
  }

  submitForm() {
    if(this.submitted && !this.errors) {
      Array.from(this.element.querySelectorAll("input[type=file]"))
        .forEach(e => e.disabled = true)
      this.element.submit()
    }
  }

  init(event) {
    const { id, file } = event.detail

    this.progressContainerTarget.insertAdjacentHTML("beforebegin", `
      <div id="direct-upload-${id}" class="direct-upload direct-upload--pending">
        <div id="direct-upload-progress-${id}" class="direct-upload__progress" style="width: 0%"></div>
        <span class="direct-upload__filename">${file.name}</span>
      </div>
    `)
    const progressTarget = document.getElementById(`direct-upload-${id}`)
    this.progressTargetMap[id] = progressTarget
  }

  start(event) {
    this.progressTargetMap[event.detail.id].classList.remove("direct-upload--pending")
  }

  progress(event) {
    const { id, progress } = event.detail
    const progressElement = document.getElementById(`direct-upload-progress-${id}`)
    progressElement.style.width = `${progress}%`
  }

  error(event) {
    event.preventDefault()
    const { id, error } = event.detail
    const target = this.progressTargetMap[id]
    target.classList.add("direct-upload--error")
    target.setAttribute("title", error)
  }

  end(event) {
    this.progressTargetMap[event.detail.id].classList.add("direct-upload--complete")
  }
}

