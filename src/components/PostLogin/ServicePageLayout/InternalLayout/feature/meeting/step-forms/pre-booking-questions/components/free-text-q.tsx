// eslint-disable
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import {getIn} from 'formik';
import React, {useEffect, useState} from 'react';
import {IFormProps} from '../../../constants';

export default function FreeTextQ({
  question,
  required,
  errors,
  setFieldValue,
  values,
  questionType,
  setFieldError,
  index,
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
        ((val = values.bookingData.answeredQuestions),
        (val[index] = {
          answer: values.bookingData.answeredQuestions![index]?.answer || '',
          required,
          question,
          questionType,
        }),
        val)
      );
    }
    setX(false);
  });

  return (
    <div className='w-full flex flex-col'>
      <Field
        className='w-full'
        error={
          getIn(errors, `bookingData.answeredQuestions[${index}].answer`) && (
            <FieldError
              message={getIn(errors, `bookingData.answeredQuestions[${index}].answer`)}
              position='bottom'
            />
          )
        }
        label={`${question} :`}
        required={required}
      >
        <textarea
          value={values.bookingData.answeredQuestions![index]?.answer}
          onChange={e => {
            setFieldError(`bookingData.answeredQuestions[${index}].answer`, undefined);
            setFieldValue(
              'values.bookingData.answeredQuestions',
              values.bookingData.answeredQuestions?.map((el, idx) =>
                index === idx ? (el.answer = e.target.value) : el
              )
            );
          }}
          className='rounded-md border border-gray-300 w-full'
        />
      </Field>
    </div>
  );
}
// eslint-enable
