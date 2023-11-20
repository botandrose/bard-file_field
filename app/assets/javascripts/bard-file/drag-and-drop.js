import { LitElement } from "lit"

class DragAndDrop extends LitElement {
  static properties = {
    target: { type: String },
  }

  createRenderRoot() {
    return this
  }

  get fileTarget() {
    return document.getElementById(this.target)
  }

  constructor() {
    super()

    this.addEventListener("dragover", event => this.highlight(event))
    this.addEventListener("dragleave", event => this.unhighlight(event))
    this.addEventListener("drop", event => this.drop(event))

    this.addEventListener("click", event => this.fileTarget.click(event))
  }

  drop(event) {
    this.unhighlight(event)
    this.fileTarget.files = event.dataTransfer.files
    this.fileTarget.dispatchEvent(new Event("change"))
  }

  highlight(event) {
    this.halt(event)
    this.classList.add("-dragover")
  }

  unhighlight(event) {
    this.halt(event)
    this.classList.remove("-dragover")
  }

  halt(event) {
    event.preventDefault()
    event.stopPropagation()
  }
}

customElements.define("drag-and-drop", DragAndDrop)

export default DragAndDrop

