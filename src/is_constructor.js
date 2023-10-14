export default function(f) {
  try {
    Reflect.construct(String, [], f)
  } catch {
    return false
  }
  return true
}

