
import * as React from 'react';
import { animated, AnimatedValue, useSpring } from 'react-spring';
import { FormArray, FormControl, FormGroup, useForm, Validators } from '../@forms/forms';
import { className } from '../@hooks/class-name/class-name';
import { LeaderboardProps } from '../types';
import { FieldGroup } from './field-group';
import './leaderboard.scss';
import { Submit } from './submit';

const calc = (x: number, y: number) => [(y - window.innerHeight / 2) / 50, -(x - window.innerWidth / 2) / 50, 1.05]
const trans: any = (x: number, y: number, s: number) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

export function Leaderboard(_: LeaderboardProps) {

  const [form, setValue, setTouched, formGroup] = useForm<FormGroup>(() => new FormGroup({
    hidden: new FormControl('hidden', [], { hidden: true }), // Validators.PatternValidator(/^\d+$/),
    disabled: new FormControl('disabled', [], { disabled: true }), // Validators.PatternValidator(/^\d+$/),
    readonly: new FormControl('readonly', [], { readonly: true }), // Validators.PatternValidator(/^[a-zA-Z0-9]{3}$/),
    required: new FormControl(null, [Validators.RequiredValidator()]),
    group: new FormGroup({
      a: null,
      b: null,
    }),
    array: new FormArray([null, null]),
  }));

  console.log('Leaderboard', form.value, form.flags, form.errors);

  // formGroup.get('name').disabled = true;

  if (false) {
    setValue({
      group: {
        a: 'A',
        b: 'B'
      }
    });
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setTouched(); // !!!
    console.log('Leaderboard.onSubmit', formGroup.value);
    if (form.flags.valid) {
      console.log('Leaderboard.onSubmit.valid!');
    }
  }

  const [style, set] = useSpring((): AnimatedValue<{ opacity: number, xys: number[] }> => ({
    from: {
      opacity: 0,
      xys: [-45, 0, 1],
    },
    to: {
      opacity: 1,
      xys: [0, 0, 1],
    },
    config: { mass: 1, tension: 180, friction: 12 },
  }) as any);

  return (
    <div className="tttoe__leaderboard">
      <animated.div className="tttoe__modal"
        onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
        onMouseLeave={() => set({ xys: [0, 0, 1] })}
        style={{ transform: style.xys.interpolate(trans) }}>
        <div className="tttoe__title">Leaderboard</div>
        <form className={className('tttoe__form', form.flags)} onSubmit={onSubmit}>
          <FieldGroup group={formGroup} />
          <Submit label="Submit" />
        </form>
      </animated.div>
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
