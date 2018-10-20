function actionCreator<T extends string, P>(type: T, payload: P): ({
  type: T,
  payload: P,
})
function actionCreator<T extends string, P>(type: T, payload: P) {
  return {
    type,
    payload,
  }
}

export default actionCreator;
