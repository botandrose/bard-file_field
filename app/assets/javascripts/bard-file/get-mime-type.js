import { fileTypeFromBuffer } from "file-type"

export default async function(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file.slice(0, 16))
    reader.onload = function(event) {
      fileTypeFromBuffer(event.target.result).then(result => {
        const mimeType = result ? result.mime : "unknown/unknown"
        resolve(mimeType)
      })
    }
  })
}

