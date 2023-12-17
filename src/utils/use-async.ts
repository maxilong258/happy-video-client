import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

const useMountedRef = () => {
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  })

  return mountedRef
}

interface State<D> {
  error: Error | null
  data: D | null
  stat: 'idle' | 'loading' | 'error' | 'success' //异步状态 idle 没有发生
}

const defaultInitialState: State<null> = {
  stat: 'idle',
  data: null,
  error: null
}

const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef()
  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  )
}

export const useAsync = <D>(initialState?: State<null>) => {
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitialState,
      ...initialState
    }
  )

  const safeDispatch = useSafeDispatch(dispatch)

  const [retry, setRetry] = useState(() => () => {})

  const setData = useCallback(
    (data: D) =>
      safeDispatch({
        data,
        stat: 'success',
        error: null
      }),
    [safeDispatch]
  )

  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        error,
        stat: 'error',
        data: null
      }),
    [safeDispatch]
  )

  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) throw new Error('请传入Promise类型的数据')
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig)
        }
      })
      safeDispatch({ stat: 'loading' })
      return promise
        .then((data) => {
          setData(data)
          return data
        })
        .catch((error) => {
          setError(error)
          return Promise.reject(error)
        })
    },
    [setData, setError, safeDispatch]
  )

  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    retry,
    ...state
  }
}
