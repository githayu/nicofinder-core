import { connectRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import {
  isArray,
  isFunction,
  isPlainObject,
  mergeWith,
  pickBy,
  transform,
} from 'lodash-es'
import {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore,
  Dispatch as ReduxDispatch,
  Middleware as ReduxMiddleware,
  Store as ReduxStore,
} from 'redux'
import loggerMiddleware from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

export const history = createBrowserHistory()

/**
 * Object 内の Function に bindActionCreators をバインドする
 * @param actions
 * @param dispatch
 */
export function createReduxActions(
  actions: { [key: string]: () => void | {} },
  dispatch: ReduxDispatch
) {
  const functions = pickBy(actions, isFunction)
  const objects = pickBy(actions, isPlainObject)
  const nestedActions = transform(
    objects,
    (result, value, key) => {
      if (isPlainObject(value)) {
        result[key] = createReduxActions(value, dispatch)
      }
    },
    {}
  )

  return {
    ...bindActionCreators(functions, dispatch),
    ...nestedActions,
  }
}

interface CreateReduxStoreOptions {
  reducers?: {}
  middlewares?: ReduxMiddleware[]
  saga?: () => Iterator<any>
}

/**
 * Redux Store を作成
 */
export class CreateReduxStore {
  static defaultOptions: CreateReduxStoreOptions = {
    reducers: {},
    middlewares:
      process.env.NODE_ENV === 'development' ? [loggerMiddleware] : [],
    saga: null,
  }

  store: ReduxStore
  options: CreateReduxStoreOptions

  constructor(options: CreateReduxStoreOptions = {}) {
    this.options = mergeWith(
      {},
      CreateReduxStore.defaultOptions,
      options,
      (a, b) => {
        if (isArray(a) && isArray(b)) {
          return a.concat(b)
        }
      }
    )

    this.create()
  }

  create() {
    let sagaMiddleware

    const reduxMiddleware = this.options.middlewares.concat()

    if (this.options.saga) {
      sagaMiddleware = createSagaMiddleware()
      reduxMiddleware.push(sagaMiddleware)
    }

    const composeEnhancers =
      process.env.NODE_ENV === 'development' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose

    const store = createStore(
      combineReducers({
        ...this.options.reducers,
        router: connectRouter(history),
      }),
      composeEnhancers(applyMiddleware(...reduxMiddleware))
    )

    if (isFunction(sagaMiddleware)) {
      sagaMiddleware.run(this.options.saga)
    }

    this.store = store
  }
}
