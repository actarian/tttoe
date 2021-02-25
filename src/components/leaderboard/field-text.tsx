
import * as React from 'react';
import { FormControl } from '../@forms/forms';
import { useControl } from '../@forms/use-control';
import { className } from '../@hooks/class-name/class-name';
import './field-text.scss';

type FieldTextProps = {
  control: FormControl;
  name: string;
}

export function FieldText(props: FieldTextProps) {

  const [control, setValue, setTouched] = useControl<string>(props.control);
  // console.log('FieldText', control, props.control.flags, props.control);
  // const [changes] = useObservable$<any>(() => props.control.changes$, props.control.value);
  // console.log('FieldText', 'changes', changes, props.control);

  const onDidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('FieldText', event.target.value);
    setValue(event.target.value);
    // props.control.value = event.target.value;
  }

  const onDidBlur = (_: React.FocusEvent<HTMLInputElement>) => {
    setTouched();
  }

  return (
    <div className={className('tttoe__field', control.flags)}>
      <div className="tttoe__field__head"></div>
      <div className="tttoe__field__control">
        <input placeholder={props.name} value={control.value || ''} onChange={onDidChange} onBlur={onDidBlur} disabled={control.flags.disabled} readOnly={control.flags.readonly} />
      </div>
      {control.flags.touched && control.errors.map(error => (
        <div key={error.key} className="tttoe__error">{error.key}</div>
      ))}
      <div className="tttoe__field__head"></div>
    </div>
  );
}

// {JSON.stringify(props.control.errors[key])}
