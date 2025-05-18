import {RadioGroup} from '@headlessui/react';
import React, {useEffect, useState} from 'react';
import {CheckCircleIcon} from '@heroicons/react/20/solid';
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import classNames from 'classnames';
import {IFormProps} from '../../../constants';
import {getIn} from 'formik';

export default function RadioQ({
  options,
  question,
  required,
  index,
  errors,
  setFieldValue,
  setFieldError,
  questionType,
  values,
}: {
  options: string[];
  question: string;
  questionType: 'RADIO' | 'CHECKBOX' | 'DROPDOWN' | 'FREE_TEXT';
  required: boolean;
  index: number;
} & IFormProps) {
  const [X, setX] = useState(true);

  useEffect(() => {
    if (X) {
      let val;
      setFieldValue(
        'values.bookingData.answeredQuestions',
        ((val = values.bookingData.answeredQuestions || []),
        (val[index] = {
          selectedOptions: values.bookingData.answeredQuestions![index]?.selectedOptions || [],
          required,
          question,
          questionType,
        }),
        val)
      );
      setX(false);
    }
  });

  return (
    <div className='w-full'>
      <Field
        label={`${question} :`}
        required={required}
        error={
          getIn(errors, `bookingData.answeredQuestions[${index}].selectedOptions`) && (
            <FieldError
              message={getIn(errors, `bookingData.answeredQuestions[${index}].selectedOptions`)}
              position='center'
            />
          )
        }
        className='w-full'
      >
        <RadioGroup
          value={values.bookingData.answeredQuestions![index]?.selectedOptions}
          onChange={e => {
            setFieldError(`bookingData.answeredQuestions[${index}].selectedOptions`, undefined);
            setFieldValue(
              'values.bookingData.answeredQuestions',
              values.bookingData.answeredQuestions?.map((el, idx) => {
                if (index === idx) {
                  if (el.selectedOptions?.includes(e)) {
                    return (el.selectedOptions = el.selectedOptions.filter(ell => ell !== e));
                  } else {
                    return (el.selectedOptions = [e]);
                  }
                } else {
                  return el;
                }
              })
            );
          }}
          className='flex w-full flex-col gap-2 justify-evenly'
        >
          {options.map((item, i) => (
            <RadioGroup.Option
              key={i}
              value={item}
              className={classNames([
                'p-2 border rounded-md border-gray-400 flex gap-1 flex-row w-full h-max justify-start items-center',
              ])}
              title={item}
            >
              {() => (
                <>
                  <span title={item} className={classNames(['w-8 h-8'])}>
                    {values.bookingData.answeredQuestions![index]?.selectedOptions?.includes(
                      item
                    ) && <CheckCircleIcon className='w-8 ml-auto text-mainBlue' />}
                  </span>
                  <RadioGroup.Label className='break-all'>{item}</RadioGroup.Label>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </Field>
    </div>
  );
}

// eslint-enable
