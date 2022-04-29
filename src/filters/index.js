export const filters = {
  // 文字超出截断
  wordSlice(word, length) {
    if (!word || typeof value !== 'string') return word
    return word.length > length ? word.slice(0, length - 1) + '...' : word
  }
}

export default Vue => {
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })
}
