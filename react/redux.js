/**
 * @param {any} obj 判断参数是否为普通对象
 * @returns {boolean} True if the argument appears to be a plain object.
 */
const _isPlainObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}

const randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)
    .split('')
    .join('.')

const _ActionTypes = {
  INIT: `@@redux/INIT${randomString()}`,
  REPLACE: `@@redux/REPLACE${randomString()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
}

export const createStore = (reducer, preloadedState, enhancer) => {
  console.log(reducer, reducer.length, 'lzxlzx')

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function(函数).')
    }

    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function(函数).')
  }

  let currentReducer = reducer;
  let currentState = preloadedState;
  let CurrentListeners = [];

  var isDispactching = false;

  const getState = () => currentState

  const dispatch = action => {
    if (!_isPlainObject(action)) {
      throw new Error(
        'Actions must be 普通对象. ' +
          'Use custom middleware for async actions.'
      )
    }
    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
          'Have you misspelled a constant?'
      )
    }
    if(isDispactching) {
      throw new Error('不能在reducer中调用dispatch');
    }
    try {
      isDispactching = true;
      currentState = currentReducer(currentState, action)
    } finally {
      isDispactching = false;
    }

    CurrentListeners.forEach(fn => fn())

  }

  const subscribe = (fn) => {
    if (typeof fn !== 'function') {
      throw new Error('Expected the subscribe(fn) fn to be a function.')
    }
    CurrentListeners.push(fn);

    return () => {
      const index = CurrentListeners.indexOf(fn);
      CurrentListeners.splice(index, 1)
    }
  }

  dispatch({ type: _ActionTypes.INIT })
  
  

  

  return {
    getState,
    dispatch,
    subscribe,
  }
}

export const combineReducers = reducers => {
  const finalReducers = {};
  // 此for循环主要是判断reducers [value] 不为undefined和是function
  for(let key in reducers) {
    const reducer = reducers[key];

    if(typeof reducer === 'undefined') {
      console.error(`reducer ${key} 的值是undefined`)
    }

    if(typeof reducer === 'function') {
      finalReducers[key] = reducer;
    }
  }
  // 此for循环判断每个reducer里的  [value] 是否为undefined
  for(let key in finalReducers) {
    const reducer = finalReducers[key];
    const state = reducer(undefined, {type: _ActionTypes.INIT});

    if(typeof state === 'undefined') {
      throw new Error(`Reducer ${key} 的返回值为undefined，该reducer非法`);
    }
  }

  console.log('combineReducers', reducers)
  
  return (state={}, action) => {
    const nextState = {}
    console.log(action.type, '???')
    for(let key in finalReducers) {
      const reducer = finalReducers[key];
      const newState = reducer(state[key], action);
      nextState[key] = newState;
    }
    return nextState;

    // let hasChanged = false
    // const nextState = {}
    // const finalReducerKeys = Object.keys(finalReducers)
    // for (let i = 0; i < finalReducerKeys.length; i++) {
    //   const key = finalReducerKeys[i]
    //   const reducer = finalReducers[key]
    //   const previousStateForKey = state[key]
    //   const nextStateForKey = reducer(previousStateForKey, action)
    //   nextState[key] = nextStateForKey
    //   hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    // }
    // return hasChanged ? nextState : state
  }
}

// export const bindActionCreators = (actions, dispatch) => {
//   const boundActionCreators = {}

// }

function bindActionCreator(actionCreator, dispatch) {
  return function() {
    return dispatch(actionCreator.apply(this, arguments))
  }
}
export const bindActionCreators = (actionCreators, dispatch) => {
  // console.error('bindActionCreators', typeof actionCreators, actionCreators)
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
    // return (actionCreators, dispatch) = () => dispatch(actionCreators.apply(this, arguments))
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreator 第一个参数期望是object or a function')
  }

  // 这里创建一个新的对象用来保存所有的actionCreator
  const boundActionCreators = {}
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      // boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
      boundActionCreators[key] = function() {
        console.log(`%c ${arguments}`, 'color: blue')
        console.error(arguments, 'args ---- 参数值...???')
        return dispatch(actionCreator.apply(this, arguments))
      }
      // boundActionCreators[key] = (...args) => {
      //   console.error(args, 'args ---- 参数值...???')
      //   return dispatch(actionCreator(...args))
      // }
    }
  }
  return boundActionCreators
}


// export const bindActionCreators = (actions, dispatch) => {
//   const boundAction = {};

//   if(typeof actions !== 'object' || actions === null) {
//     throw new Error('actions必须是一个对象且不能为null');
//   }

//   for(let key in actions) {
//     const actionCreator = actions[key];

//     if(typeof actionCreator === 'function') {
//       boundAction[key] = (...args) => dispatch(actionCreator(...args))
//     }
//   }

//   return boundAction;
// }