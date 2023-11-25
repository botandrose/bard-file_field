const Validations = superClass => class extends superClass {
  checkValidity() {
    let errors = []
    const label = document.querySelector(`label[for='${this.originalId}']`).innerText

    this.files.forEach(file => {
      errors.push(...new Accepts(file, label, this.accepts).errors)
      errors.push(...new Max(file, label, this.max).errors)
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

class Accepts {
  constructor(file, label, acceptsString) {
    this.errors = []

    const accepts = acceptsString ? acceptsString.split(/,\s*/) : []
    const regexes = accepts.map(accept => {
      const regex = this.regexMap[accept]
      if(!regex) console.error(`Unknown accepts type: ${accept}`)
      return regex
    }).filter(r => !!r) // discard not found

    if(regexes.length > 0 && !regexes.some(regex => regex.test(file.mimetype))) {
      this.errors.push(`${label} must be a ${this.joinWords(accepts)}.`)
    }
  }

  get regexMap() {
    return {
      image: new RegExp("^image/.+$"),
      video: new RegExp("^video/.+$"),
      pdf: new RegExp("^application/pdf$"),
    }
  }

  joinWords(words) {
    if(words.length >= 3) {
      return (words.slice(0, -1) + [`or ${words.at(-1)}`]).join(", ")
    } else {
      return words.join(" or ")
    }
  }
}

class Max {
  constructor(file, label, max) {
    this.file = file
    this.label = label
    this.max = max
    this.errors = []

    if(this.max && this.file.size > this.max) {
      this.errors.push(this.errorMessage)
    }
  }

  get errorMessage() {
    return [
      `${this.label} must be smaller than ${this.formatBytes(this.max)},`,
      `and "${this.file.filename}" is ${this.formatBytes(this.file.size)}.`,
      `Please attach a smaller file.`,
    ].join(" ")
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
  }
}

export default Validations
