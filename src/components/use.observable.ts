import { useCallback, useEffect, useRef, useState } from 'react';
import { Observable, Subject } from 'rxjs';

export type ObservableAction = {
    key: string;
    args: any[];
}

export type ObservableReducer = <T>(state: T, ...args: any[]) => T;

export type ObservableReducers = { [key: string]: ObservableReducer };

export function useObservable<T>(observableFactory: (action$: Subject<ObservableAction>, defaultState: T) => Observable<T>, defaultState: T): [T, (key: string, ...args: any[]) => void] {
    // create the action$ observable only 1 time
    const action$ = useRef(new Subject<ObservableAction>()).current;
    // the dipatch function is memoized with useCallback()
    const dispatch = useCallback((key: string, ...args: any[]) => action$.next({ key, args }), [action$]);
    // store the observableFactory on a ref, ignoring any new observableFactory values
    const factory = useRef(observableFactory).current;
    const [state, setState] = useState<T>(defaultState);
    useEffect(() => {
        // use the observableFactory to create the new state$ observable
        const state$ = factory(action$, defaultState);
        const subscription = state$.subscribe(setState);
        return () => subscription.unsubscribe();
    }, [factory, action$]);
    return [state, dispatch];
};

export function deepCopy(source: any[] | { [key: string]: any } | number | string | boolean | null | undefined): (any[] | { [key: string]: any } | number | string | boolean | null | undefined) {
    if (Array.isArray(source)) {
        return source.map(x => deepCopy(x));
    } else if (source && typeof source === 'object') {
        const copy: { [key: string]: any } = {};
        Object.keys(source).forEach(key => {
            copy[key] = deepCopy(source[key]);
        });
        return copy;
    } else {
        return source;
    }
}

// Creating a custom hook !!!
/*
export function useObservableSimple<T>(observable: Observable<T>) {
    const [state, setState] = useState<T>();
    useEffect(() => {
        const sub = observable.subscribe(setState);
        return () => sub.unsubscribe();
    }, [observable]);
    return state;
}
*/
