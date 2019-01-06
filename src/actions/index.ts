import { isError } from 'lodash-es'

interface ActionCreator extends Function {
  (payload?: any): {
    type: string
    payload?: any
    error?: boolean
  }
  type?: string
}

export function createAction(type: string) {
  const actionCreator: ActionCreator = (payload) => {
    const action: {
      type: string
      payload?: any
      error?: boolean
    } = { type }

    if (isError(payload)) {
      action.error = true
    } else if (payload !== undefined) {
      action.payload = payload
    }

    return action
  }

  actionCreator.prototype.type = type

  return actionCreator
}
