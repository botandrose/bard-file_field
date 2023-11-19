const DirectUpload = {
  init: function(event) {
    const { id, file } = event.detail
    const bardFile = this.files.find(bf => bf.file === file)
    bardFile.state = "pending"
    bardFile.percent = 0
    this.requestUpdate()
    this.formController.init(event)
  },

  start: function(event) {
    const { id, file } = event.detail
    const bardFile = this.files.find(bf => bf.file === file)
    bardFile.state = "pending"
    this.requestUpdate()
    this.formController.start(event)
  },

  progress: function(event) {
    const { id, file, progress } = event.detail
    const bardFile = this.files.find(bf => bf.file === file)
    bardFile.percent = progress
    this.requestUpdate()
    this.formController.progress(event)
  },

  error: function(event) {
    event.preventDefault()
    const { id, file, error } = event.detail
    const bardFile = this.files.find(bf => bf.file === file)
    bardFile.state = "error"
    bardFile.error = error
    this.requestUpdate()
    this.formController.error(event)
  },

  end: function(event) {
    const { id, file } = event.detail
    const bardFile = this.files.find(bf => bf.file === file)
    bardFile.state = "complete"
    bardFile.percent = 100
    this.requestUpdate()
    this.formController.end(event)
  },
}

export default DirectUpload
