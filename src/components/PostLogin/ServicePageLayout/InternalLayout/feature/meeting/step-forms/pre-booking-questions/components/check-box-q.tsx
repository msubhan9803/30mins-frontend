//eslint-disable
import React, {useEffect, useState} from 'react';
import {RadioGroup} from '@headlessui/react';
import {CheckIcon} from '@heroicons/react/24/outline';
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import classNames from 'classnames';
import {IFormProps} from '../../../constants';
import {getIn} from 'formik';

export default function CheckBoxQ({
  options,
  question,
  required,
  errors,
  setFieldValue,
  index,
  questionType,
  setFieldError,
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
        className='w-full'
        error={
          getIn(errors, `bookingData.answeredQuestions[${index}].selectedOptions`) && (
            <FieldError
              message={getIn(errors, `bookingData.answeredQuestions[${index}].selectedOptions`)}
              position='center'
            />
          )
        }
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
                    return (el.selectedOptions = [...Object(el.selectedOptions), e]);
                  }
                } else {
                  return el;
                }
              })
            );
          }}
          className='flex flex-wrap gap-2 justify-evenly w-full'
        >
          {options.map((item, i) => (
            <RadioGroup.Option
              value={item}
              key={i}
              className={classNames([
                'p-2 border rounded-md flex flex-row w-full h-max justify-start gap-4 items-center',
                values.bookingData.answeredQuestions![index]?.selectedOptions?.includes(item)
                  ? ' border-mainBlue'
                  : 'border-gray-400',
              ])}
              title={item}
            >
              {() => (
                <>
                  <span
                    className={classNames([
                      'w-8 h-8 border rounded-md flex justify-center items-center',
                      values.bookingData.answeredQuestions![index]?.selectedOptions?.includes(
                        item
                      ) && 'border-mainBlue',
                    ])}
                  >
                    {values.bookingData.answeredQuestions![index]?.selectedOptions?.includes(
                      item
                    ) && <CheckIcon className='w-6 text-mainBlue' />}
                  </span>
                  <RadioGroup.Label>{item}</RadioGroup.Label>
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
