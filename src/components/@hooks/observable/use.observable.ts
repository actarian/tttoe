import { useCallback, useEffect, useRef, useState } from 'react';
import { isObservable, Observable, of, Subject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { deepCopy } from '../utils/utils';

export type ObservableAction = { key: string; args: any[]; }
export type ObservableReducer<T> = (state: T, ...args: any[]) => Observable<T> | T;
export type ObservableReducers<T> = { [key: string]: ObservableReducer<T> };
export type ObservableFactoryResult<T> = (action$: Subject<ObservableAction>) => Observable<T>;
export type ObservableFactory<T> = (defaultState: T) => ObservableFactoryResult<T>;
export type ObservableHook<T> = [T, (key: string, ...args: any[]) => void];

export function useSharedReducer$<T>(actionsFactory: () => { [key:string]: (state:T, ...args:any[]) => Observable<T> | T }, defaultState: T): ObservableHook<T> {
  let subject: Subject<ObservableAction> = (actionsFactory as any).subject;
  if (!subject) {
    subject = (actionsFactory as any).subject = new Subject<ObservableAction>();
  }
  return useReducer$(actionsFactory, defaultState, subject);
}

export function useReducer$<T>(actionsFactory: () => { [key:string]: (state:T, ...args:any[]) => Observable<T> | T }, defaultState: T, subject?: Subject<ObservableAction>): ObservableHook<T> {
  subject = subject || new Subject<ObservableAction>();
  const action$ = useRef(subject).current;
  const next = useCallback((key: string, ...args: any[]) => action$.next({ key, args }), [action$]);
  const reducerFactory = useRef(actionsFactory).current;
  const [state, setState] = useState<T>(defaultState);
  useEffect(() => {
    const actions = reducerFactory();
    const state$ = of(defaultState).pipe(
      switchMap(state => {
        return action$.pipe(
          filter(action => typeof actions[action.key] === 'function'),
          switchMap(action => {
            const reducer = actions[action.key](deepCopy(state) as T, ...action.args);
            const reducer$ = isObservable(reducer) ? reducer : of(reducer);
            return reducer$.pipe(
              tap(next => state = next),
              // tap(next => console.log(action.key, next)),
            );
          }),
        )
      }),
    )
    const subscription = state$.subscribe(setState);
    return () => subscription.unsubscribe();
  }, [reducerFactory, action$]);
  return [state, next];
}

export function useSharedStore$<T>(observableFactory: ObservableFactory<T>, defaultState: T): ObservableHook<T> {
  let subject: Subject<ObservableAction> = (observableFactory as any).subject;
  if (!subject) {
    subject = (observableFactory as any).subject = new Subject<ObservableAction>();
  }
  return useStore$(observableFactory, defaultState, subject);
}

export function useStore$<T>(observableFactory: ObservableFactory<T>, defaultState: T, subject?: Subject<ObservableAction>): ObservableHook<T> {
  // create the action$ observable only 1 time
  subject = subject || new Subject<ObservableAction>();
  const action$ = useRef(subject).current;
  // the dipatch function is memoized with useCallback()
  const next = useCallback((key: string, ...args: any[]) => action$.next({ key, args }), [action$]);
  // store the observableFactory on a ref, ignoring any new observableFactory values
  const reducerFactory = useRef(observableFactory).current;
  const [state, setState] = useState<T>(defaultState);
  useEffect(() => {
    // use the observableFactory to create the new state$ observable
    const stateFactory = reducerFactory(defaultState);
    const state$ = stateFactory(action$);
    const subscription = state$.subscribe(setState);
    return () => subscription.unsubscribe();
  }, [reducerFactory, action$]);
  return [state, next];
};

export function useReducer$__<T>(actions: any, defaultState?: T): (action$: Subject<ObservableAction>) => Observable<T> {
  return (action$: Subject<ObservableAction>) => {
    const state$ = of(defaultState).pipe(
      switchMap(state => {
        return action$.pipe(
          filter(action => typeof actions[action.key] === 'function'),
          switchMap(action => {
            const reducer = actions[action.key](deepCopy(state) as T, ...action.args);
            const reducer$ = isObservable(reducer) ? reducer : of(reducer);
            return reducer$.pipe(
              tap(next => state = next),
              // tap(next => console.log(action.key, next)),
            );
          }),
        )
      }),
    )
    return state$;
    /*
    const state$ = action$.pipe(
      scan((state: T, action: ObservableAction) => {
        return actions[action.key](deepCopy(state) as T, ...action.args);
      }, defaultState),
      startWith(defaultState),
    );
    return state$;
    */
  }
}

/*
export function useReducer_<T>(defaultState: T, actions: any): (action$: Subject<ObservableAction>) => Observable<T> {
  return (action$: Subject<ObservableAction>) => {
    const state$ = action$.pipe(
      scan((state: T, action: ObservableAction) => {
        return actions[action.key](deepCopy(state) as T, ...action.args);
      }, defaultState),
      startWith(defaultState),
    );
    return state$;
  }
}

export function useStore__<T>(observableFactory: (action$: Subject<ObservableAction>, defaultState: T) => Observable<T>, defaultState: T): [T, (key: string, ...args: any[]) => void] {
  // create the action$ observable only 1 time
  const action$ = useRef(new Subject<ObservableAction>()).current;
  // the dipatch function is memoized with useCallback()
  const next = useCallback((key: string, ...args: any[]) => action$.next({ key, args }), [action$]);
  // store the observableFactory on a ref, ignoring any new observableFactory values
  const factory = useRef(observableFactory).current;
  const [state, setState] = useState<T>(defaultState);
  useEffect(() => {
    // use the observableFactory to create the new state$ observable
    const state$ = factory(action$, defaultState);
    const subscription = state$.subscribe(setState);
    return () => subscription.unsubscribe();
  }, [factory, action$]);
  return [state, next];
};

export function useReducer__<T>(action$: Subject<ObservableAction>, defaultState: T, actions: any): Observable<T> {
  const state$ = action$.pipe(
    scan((state: T, action: ObservableAction) => {
      return actions[action.key](deepCopy(state) as T, ...action.args);
    }, defaultState),
    startWith(defaultState),
  );
  return state$;
}
*/
// Creating a custom hook !!!
/*
export function useStoreSimple<T>(observable: Observable<T>) {
    const [state, setState] = useState<T>();
    useEffect(() => {
        const sub = observable.subscribe(setState);
        return () => sub.unsubscribe();
    }, [observable]);
    return state;
}
*/
