import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/24/outline';
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import {getIn} from 'formik';
import {useEffect, useState} from 'react';
import {IFormProps} from '../../../constants';

export default function DropDownQ({
  options,
  question,
  required,
  errors,
  setFieldValue,
  setFieldError,
  values,
  index,
  questionType,
}: {
  options: string[];
  question: string;
  index: number;
  questionType: 'RADIO' | 'CHECKBOX' | 'DROPDOWN' | 'FREE_TEXT';
  required: boolean;
} & IFormProps) {
  const [X, setX] = useState(true);

  useEffect(() => {
    if (X) {
      let val;

      setFieldValue(
        'values.bookingData.answeredQuestions',
        ((val = values.bookingData.answeredQuestions || []),
        (val[index] = {
          selectedOptions: values.bookingData.answeredQuestions![index]?.selectedOptions || [
            options[0],
          ],
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
    <div className='w-full flex flex-col'>
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
        <Listbox
          value={
            values.bookingData.answeredQuestions![index]?.selectedOptions?.length! > 0
              ? values.bookingData.answeredQuestions![index]?.selectedOptions![0]!
              : []
          }
          onChange={e => {
            setFieldError(`bookingData.answeredQuestions[${index}].selectedOptions`, undefined);
            setFieldValue(
              'values.bookingData.answeredQuestions',
              values.bookingData.answeredQuestions?.map((el, idx) =>
                index === idx ? ((el.selectedOptions = [e.toString()]), el) : el
              )
            );
          }}
        >
          <div className='relative mt-1 w-full'>
            <Listbox.Button className='relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-mainBlue sm:text-sm'>
              <span className='block truncate'>
                {values.bookingData.answeredQuestions![index]?.selectedOptions}
              </span>
              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </span>
            </Listbox.Button>
            <Transition
              className={'z-[5000] relative'}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                {options.map((item, i) => (
                  <Listbox.Option
                    key={i}
                    className={({active}) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-200 text-mainText' : 'text-gray-900'
                      }`
                    }
                    value={item}
                  >
                    {({selected}) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                        >
                          {item}
                        </span>
                        {selected ? (
                          <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-mainBlue'>
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </Field>
    </div>
  );
}
