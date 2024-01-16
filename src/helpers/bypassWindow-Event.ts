export function bypassWindowEventForKeys(key: string): string {
  if (key.toLowerCase() === "b") {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "b" }))
    return key
  }
  if (key.toLowerCase() === "n") {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "n" }))
    return key
  }
  return ""
}
