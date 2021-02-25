
import * as React from 'react';
import { FormControl, FormGroup, useForm, Validators } from '../@forms/forms';
import { className } from '../@hooks/class-name/class-name';
import { LeaderboardProps } from '../types';
import { FieldGroup } from './field-group';
import './leaderboard.scss';
import { Submit } from './submit';

export function Leaderboard(props: LeaderboardProps) {

  const [form, setValue, setTouched, formGroup] = useForm<FormGroup>(new FormGroup({
    name: new FormControl(1, [Validators.RequiredValidator()], { readonly: true }), // Validators.PatternValidator(/^[a-zA-Z0-9]{3}$/),
    score: new FormControl(null, [Validators.RequiredValidator()], { disabled: true }), // Validators.PatternValidator(/^\d+$/),
    sub: new FormGroup({
      name: new FormControl(null, [Validators.RequiredValidator()]),
      score: new FormControl(null, [Validators.RequiredValidator()]),
    })
  }));

  console.log('Leaderboard', form.value, form.flags, form.errors);

  // formGroup.get('name').disabled = true;

  if (false) {
    setValue({
      name: 'PIP',
      score: 10000
    });
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched();
    console.log('Leaderboard.onSubmit', formGroup.value);
    if (form.flags.valid) {
      console.log('Leaderboard.onSubmit.valid!');
    }
  }

  return (
    <div className="tttoe__leaderboard">
      <div className="tttoe__modal">
        <div>leaderboard</div>
        <form className={className('tttoe__form', form.flags)} onSubmit={onSubmit}>
          <FieldGroup group={formGroup} />
          <Submit label="Submit" />
        </form>
      </div>
    </div>
  );
}

/*
if (false) {
  const [changes] = useObservable$<any>(() => formGroup.changes$, formGroup.value);
  console.log('Leaderboard', 'changes', changes);
}
*/

/*
if (false) {
  React.useEffect(() => {
    formGroup.patch({
      name: 'PIP',
      score: 10000
    });
  }, []);
}
*/

/*
const [now] = useObservable$<string>(
  () => interval(1000).pipe(
    map(() => new Date().toLocaleString())
  ),
  '',
)
console.log('Leaderboard', 'now', now);
*/
