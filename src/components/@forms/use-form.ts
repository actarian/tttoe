import { DependencyList, useCallback, useRef } from "react";
import { map } from "rxjs/operators";
import { useObservable$ } from "../@hooks/observable/observable";
import { FormAbstract } from "./forms/form-abstract";
import { FormState } from "./forms/types";
import { mapErrors_ } from "./helpers/helpers";

export function useForm<T extends FormAbstract>(group: T, deps: DependencyList = []): [FormState<T>, (value: any) => void, () => void, T] {
  const ref = useRef(group);
  const setValue = useCallback((value: any) => {
    ref.current.patch(value);
  }, [group, ...deps]);
  const setTouched = useCallback(() => {
    ref.current.touched = true;
  }, [group, ...deps]);
  const [state] = useObservable$<FormState<T>>(() => group.changes$.pipe(
    map(value => ({ value: value, flags: group.flags, errors: mapErrors_(group.errors) })),
  ), { value: group.value, flags: group.flags, errors: mapErrors_(group.errors) });
  return [state, setValue, setTouched, ref.current];
}
