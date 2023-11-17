const Validations = {
  checkValidity: function() {
    const errors = []
    const label = document.querySelector(`label[for='${this.originalId}']`).innerText

    this.files.forEach(file => {
      if(this.accepts) {
        if(!new RegExp(this.acceptsRegex()).test(file.mimetype)) {
          errors.push(`${label} must be a ${this.accepts}.`)
        }
      }

      if(this.max) {
        if(file.size > this.max) {
          errors.push(`${label} must be smaller than ${formatBytes(this.max)}, and "${file.name}" is ${formatBytes(file.size)}. Please attach a smaller file.`)
        }
      }
    })

    this.setCustomValidity(errors.join(" "))
    this.reportValidity()
    return errors.length === 0
  },

  setCustomValidity: function(msg) {
    this.textTarget.setCustomValidity(msg)
  },

  reportValidity: function() {
    this.textTarget.reportValidity()
  },

  acceptsRegex: function() {
    switch(this.accepts) {
      case "image": return "^image/.+$"
      case "video": return "^video/.+$"
      case "pdf": return "^application/pdf$"
      default: console.error(`Unknown accepts type: ${this.accepts}`)
    }
  },
}

export default Validations
