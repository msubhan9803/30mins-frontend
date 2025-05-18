import classNames from 'classnames';
import React, {useEffect} from 'react';
import {Range as Rr, getTrackBackground} from 'react-range';

export default function Range({
  value,
  onChange,
  className = '',
  disabled = false,
  step = 0.1,
  min = 1,
  max = 10,
}) {
  useEffect(() => {}, [value, onChange, className, disabled, step, min, max]);

  return (
    <div className={classNames(['w-full', className])}>
      <Rr
        values={[value]}
        step={step}
        min={min}
        max={max}
        onChange={onChange}
        disabled={disabled}
        renderTrack={({props, children}) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
            }}
          >
            <div
              ref={props.ref}
              className={classNames(disabled && 'bg-slate-200')}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values: [value],
                  colors: ['#00a3fe', '#ccc'],
                  min: min,
                  max: max,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({props, isDragged}) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '28px',
              width: '28px',
              borderRadius: '8px',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 1px 5px #ccc',
            }}
          >
            <div
              style={{
                height: '12px',
                width: '4px',
                backgroundColor: isDragged ? '#00a3fe' : '#CCC',
              }}
            />
          </div>
        )}
      />
    </div>
  );
}
