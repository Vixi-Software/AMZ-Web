const loadingMiddleware = store => next => action => {
  if (action.type === 'loading/startLoading') {
    setTimeout(() => {
      store.dispatch({ type: 'loading/stopLoading' });
    }, 500);
  }
  return next(action);
};

export default loadingMiddleware;