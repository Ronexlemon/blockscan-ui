function copy(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

export {copy}