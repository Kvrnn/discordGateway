const checkVariable = (variables: string[], body: any) => {
  for (const variable of variables) {
    if (!(variable in body)) {
      return false
    }
  }
  return true
}