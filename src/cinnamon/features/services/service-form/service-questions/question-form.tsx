import {XCircleIcon} from '@heroicons/react/24/outline';
import {PlusIcon} from '@heroicons/react/20/solid';
import Button from '@root/components/button';
import CheckBox from '@root/components/forms/checkbox';
import {FieldError} from '@root/components/forms/error';
import Field from '@root/components/forms/field';
import Input from '@root/components/forms/input';
import Select from '@root/components/forms/select';
import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import {useState} from 'react';
import {toast} from 'react-hot-toast';

export default function QuestionForm({
  currentQuestion,
  changeQuestion,
  errors,
  setCurrentQuestion,
  populateOption,
  removeOption,
  saveQuestion,
  addOption,
  // changeAdding,
  handleCancel,
  checkValidation,
  setErrors,
}) {
  //
  const [mouseEnter, setmouseEnter] = useState(false);
  const {t} = useTranslation('common');
  const options = [
    {code: 'FREE_TEXT', label: t('FREE_TEXT')},
    {code: 'DROPDOWN', label: t('DROPDOWN')},
    {code: 'CHECKBOX', label: t('CHECKBOX')},
    {code: 'RADIO', label: t('RADIO')},
  ];

  return (
    <div className='flex flex-col border border-gray-300 shadow-md rounded-lg'>
      <div className='flex py-3 mb-2 px-6 border-b border-b-gray-300 justify-between'>
        <h3 className='font-medium text-gray-600'>{t('booking_questions_add_question')}</h3>
        <CheckBox
          code='question-required'
          style='space-x-2 py-0 px-0 flex-shrink-0 items-center'
          label={t('required')}
          handleChange={() => changeQuestion('required', !currentQuestion.required)}
          selected={currentQuestion.required}
        />
      </div>
      <div className='flex flex-col p-6 pb-8'>
        <Field label={t('question')} required>
          <div className='flex flex-col flex-grow'>
            <Input
              placeholder={t('question_placeholder')}
              type='text'
              handleChange={e => {
                changeQuestion('question', e.currentTarget.value);
                if (e.currentTarget.value.trim().length > 0) {
                  setErrors!('question', undefined);
                } else {
                  setErrors!('question', 'question_required');
                }
              }}
              value={currentQuestion.question}
            />
            {errors.question && <FieldError message={t(errors.question)} />}
          </div>
        </Field>
        <div className='flex flex-grow-0 mt-6 items-start space-x-6'>
          <div className='flex flex-col flex-grow justify-start'>
            <Select
              label={t('question_type')}
              options={options}
              onChange={e => {
                setCurrentQuestion({
                  ...currentQuestion,
                  questionType: e,
                  options: e !== 'FREE_TEXT' ? ['', ''] : [],
                });
                setErrors!('questionType', undefined);
              }}
              selectedOption={currentQuestion.questionType}
              type='question'
              selectedDisplay={options.find(o => o.code === currentQuestion.questionType)?.label}
            />

            <div className='mb-2'>
              {errors.questionType && <FieldError message={t(errors.questionType)} />}
            </div>
            {currentQuestion.questionType !== 'FREE_TEXT' &&
              currentQuestion.questionType.length > 0 && (
                <div className='flex flex-col space-y-3 p-6 rounded-b-lg shadow-md bg-gray-200 bg-opacity-60'>
                  {currentQuestion.options!.map((_op, i) => (
                    <div className='flex flex-col' key={i}>
                      <div key={i} className='relative group'>
                        <Input
                          type='text'
                          placeholder={`Add Option ${i + 1}`}
                          handleChange={e => {
                            populateOption(i, e.currentTarget.value);
                          }}
                          onBlur={async () => {
                            await checkValidation!(currentQuestion);
                          }}
                          value={currentQuestion.options![i]}
                        />
                        <XCircleIcon
                          className='w-6 h-6 text-red-500 absolute top-3.5 right-4 cursor-pointer '
                          onClick={() => removeOption(i)}
                        />
                      </div>
                      {typeof errors?.options === 'object' && errors?.options[i] !== undefined && (
                        <FieldError message={`${errors?.options}`?.split(',')[i]} />
                      )}
                    </div>
                  ))}
                  <div className='flex mt-3 justify-end'>
                    <Button
                      size='small'
                      variant='outline'
                      className='flex justify-center items-center w-full max-w-sm'
                      onClick={async () => {
                        if (currentQuestion.options.length >= 5) {
                          toast.dismiss();
                          toast.error(t('max_choices_allowed'));
                        }
                        await addOption();
                        await checkValidation!(currentQuestion);
                      }}
                      onMouseEnter={() => {
                        setmouseEnter(true);
                      }}
                      onMouseLeave={() => {
                        setmouseEnter(false);
                      }}
                    >
                      <PlusIcon
                        className={classNames([
                          'mr-2 h-4 w-4',
                          !mouseEnter ? 'text-mainBlue' : 'text-white',
                        ])}
                        aria-hidden='true'
                      />
                      {t('add_option')}
                    </Button>
                  </div>
                </div>
              )}
            {errors.options === 'add_two_or_more_options' && (
              <FieldError position='center' message={t('add_two_or_more_options')} />
            )}
          </div>
        </div>
      </div>
      <div className='flex border-t border-gray-300 py-4 px-6 justify-between'>
        <Button
          size=''
          variant='ghost'
          onClick={() => {
            handleCancel();
          }}
        >
          {t('cancel')}
        </Button>
        <Button size='' onClick={() => saveQuestion()} variant='solid'>
          {t('save')}
        </Button>
      </div>
    </div>
  );
}
