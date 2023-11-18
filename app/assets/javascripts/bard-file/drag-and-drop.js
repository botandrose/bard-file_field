const DragAndDrop = {
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
  },

  highlight(event) {
    this.halt(event)
    this.highlighted = true
  },

  unhighlight(event) {
    this.halt(event)
    this.highlighted = false
  },

  halt(event) {
    event.preventDefault()
    event.stopPropagation()
  },
}

function isConstructor(f) {
  try {
    Reflect.construct(String, [], f)
  } catch {
    return false
  }
  return true
}

export default DragAndDrop

