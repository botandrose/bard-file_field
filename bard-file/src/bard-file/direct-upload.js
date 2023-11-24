const DirectUpload = superClass => class extends superClass {
  constructor() {
    super()

    this.addEventListener("direct-upload:initialize", event => this.init(event))
    this.addEventListener("direct-upload:start", event => this.start(event))
    this.addEventListener("direct-upload:progress", event => this.progress(event))
    this.addEventListener("direct-upload:error", event => this.error(event))
    this.addEventListener("direct-upload:end", event => this.end(event))
  }

  init(event) {
    const { id, file } = event.detail
    const bardFile = this.files.find(bf => bf.file === file)
    bardFile.state = "pending"
    bardFile.percent = 0
    this.requestUpdate()
    this.formController.init(event)
  }

  start(event) {
    const { id, file } = event.detail
    const bardFile = this.files.find(bf => bf.file === file)
    bardFile.state = "pending"
    this.requestUpdate()
    this.formController.start(event)
  }

  progress(event) {
    const { id, file, progress } = event.detail
    const bardFile = this.files.find(bf => bf.file === file)
    bardFile.percent = progress
    this.requestUpdate()
    this.formController.progress(event)
  }

  error(event) {
    event.preventDefault()
    const { id, file, error } = event.detail
    const bardFile = this.files.find(bf => bf.file === file)
    bardFile.state = "error"
    bardFile.error = error
    this.requestUpdate()
    this.formController.error(event)
  }

  end(event) {
    const { id, file } = event.detail
    const bardFile = this.files.find(bf => bf.file === file)
    bardFile.state = "complete"
    bardFile.percent = 100
    this.requestUpdate()
    this.formController.end(event)
  }
}

export default DirectUpload
