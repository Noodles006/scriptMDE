const str2obj = str => {
  return str
    .split(',')
    .map(keyVal => {
      return keyVal
        .split(':')
        .map(_ => _.trim())
    })
    .reduce((accumulator, currentValue) => {
      accumulator[currentValue[0]] = currentValue[1]
      return accumulator
    }, {})
};

export default { str2obj };
