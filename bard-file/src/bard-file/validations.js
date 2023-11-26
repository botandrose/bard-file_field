const Validations = superClass => class extends superClass {
  checkValidity() {
    let errors = []

    this.files.forEach(uploadedFile => {
      if(!uploadedFile.checkValidity()) {
        errors.push(uploadedFile.validationMessage)
      }
    })

    this.setCustomValidity(errors.join(" "))
    this.reportValidity()
    return errors.length === 0
  }

  setCustomValidity(msg) {
    this.fileTarget.setCustomValidity(msg)
  }

  reportValidity() {
    this.fileTarget.reportValidity()
  }

  get validationMessage() {
    return this.fileTarget.validationMessage
  }
}

export default Validations
