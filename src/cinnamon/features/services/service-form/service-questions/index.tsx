import {PencilSquareIcon, QuestionMarkCircleIcon, XCircleIcon} from '@heroicons/react/24/outline';
import StepHeader from '@features/services/service-form/step-header';
import useTranslation from 'next-translate/useTranslation';
import Error from '@root/components/forms/error';
import {PlusIcon} from '@heroicons/react/20/solid';
import Button from '@root/components/button';
import classNames from 'classnames';
import {useState} from 'react';
import {array} from 'yup';

import {activation, options, QuestionType} from './constants';
import QuestionForm from './question-form';
import BinaryRadio from '../binary-radio';
import {questionSchema} from '../schema';
// import {questionSchema} from '../schema';

type Props = {
  handleChange: any;
  errors: any;
  serviceQuestions: string;
  serviceQuestionsList: QuestionType[];
  setErrors: any;
  move: (action: any, update: any) => Promise<void>;
  serviceType?: any;
};

export default function ServiceQuestions({
  handleChange,
  errors,
  serviceQuestions,
  serviceQuestionsList,
  setErrors,
  move,
  serviceType,
}: Props) {
  const {t} = useTranslation('common');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isMaxQuestionLimit, setIsMaxQuestionLimit] = useState(false);
  const [mouseEnter, setmouseEnter] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType>({
    questionType: '',
    question: '',
    required: false,
    options: [],
  });

  const validationQ = array()
    .required('questions_required')
    .test('unique', 'unique', function (list) {
      const Options: Array<any> = [];
      list?.forEach((element, idx) => {
        if (list?.includes(element)) {
          if (element.trim() === '') {
            Options[idx] = 'option_required';
          } else {
            const mapper = x => x === element;
            const set = list.filter(mapper);
            const isUnique = set.length > 1;
            if (isUnique) {
              Options[idx] = 'this_choice_exists';
            } else {
              Options[idx] = undefined;
            }
          }
        }
      });
      return this.createError({
        path: `options`,
        params: {errors: Options},
      });
    });

  const HandleCancel = () => {
    setAdding(false);
    setEditing(null);
  };

  const changeAdding = val => {
    if (serviceQuestionsList && serviceQuestionsList?.length < 3) {
      setIsMaxQuestionLimit(false);
      setAdding(val);
      setCurrentQuestion({
        questionType: '',
        question: '',
        required: false,
        options: [],
      });
    } else {
      setIsMaxQuestionLimit(true);
    }
  };

  // Insert data into question state
  const changeQuestion = async (field, value) => {
    setCurrentQuestion({
      ...currentQuestion,
      [field]: value,
    });
  };

  // Create option into question.options
  const addOption = async () => {
    const questionsLength = currentQuestion?.options?.length;
    if (questionsLength !== undefined && questionsLength < 5) {
      setCurrentQuestion({
        ...currentQuestion,
        options: currentQuestion.options?.concat(''),
      });
    }
  };

  // Populate data into question.options
  const populateOption = async (idx, value) => {
    const ops = currentQuestion.options;
    ops![idx] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: ops,
    });
  };

  // Remove data from question.options
  const removeOption = idx => {
    setErrors(`options[${idx}]`, undefined);
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options?.filter((_ele, i) => i !== idx),
    });
  };

  // Remove question form questions list
  const removeQuestion = idx => {
    setIsMaxQuestionLimit(false);
    handleChange(
      'serviceQuestionsList',
      serviceQuestionsList.filter((_q, i) => idx !== i)
    );
  };

  // Remove question form questions list
  const editQuestion = idx => {
    setCurrentQuestion(serviceQuestionsList[idx]);
    setAdding(true);
    setEditing(idx);
  };

  // check choices validation
  const checkValidation = async CurrentQuestion => {
    let res: any = false;
    try {
      setErrors('options', undefined);
      await validationQ.validate(CurrentQuestion?.options);
      return true;
    } catch (err) {
      const filter = x => x !== undefined;
      Object.values(err).map((el: any) => {
        if (el?.path === 'options') {
          res = el?.errors.filter(filter).length === 0;
          if (el?.errors.filter(filter).length > 0) {
            el?.errors.map((ell, idx) => setErrors(`options[${idx}]`, ell));
          }
        }
        return null;
      });
      return res;
    }
  };

  // Save data to formik values
  const saveQuestion = async () => {
    try {
      if ((await checkValidation(currentQuestion)) && !errors?.question) {
        await questionSchema.validate(currentQuestion, {abortEarly: false});
        if (adding && editing === null) {
          handleChange('serviceQuestionsList', [...serviceQuestionsList, currentQuestion]);
          setCurrentQuestion({
            questionType: '',
            question: '',
            required: false,
            options: [],
          });
        }
        if (adding && editing !== null) {
          const srQL = serviceQuestionsList;
          srQL[editing] = currentQuestion;
          handleChange('serviceQuestionsList', srQL);
          setCurrentQuestion({
            questionType: '',
            question: '',
            required: false,
            options: [],
          });
        }
        setAdding(false);
        setEditing(null);
      }
    } catch (err) {
      err.inner.forEach(er => {
        setErrors(er.path, er.message);
      });
    }
  };

  const title = serviceType === 'EVENT' ? 'event_questions_question' : 'booking_questions_question';
  const description =
    serviceType === 'EVENT' ? 'event_questions_description' : 'booking_questions_description';

  return (
    <>
      <BinaryRadio
        question={t(title)}
        description={t(description)}
        icon={<QuestionMarkCircleIcon className='w-6 h-6' />}
        errors={errors.serviceQuestions}
        collapsed={serviceQuestions === 'yes'}
        value={serviceQuestions}
        field='serviceQuestions'
        handleChange={handleChange}
        options={activation}
        move={move}
      />
      {serviceQuestions === 'yes' && (
        <>
          <StepHeader
            question={t('booking_questions_setup_question')}
            description={t('booking_questions_setup_description')}
            icon={<QuestionMarkCircleIcon className='w-6 h-6' />}
          />

          {errors.serviceQuestionsList && (
            <Error message={errors.serviceQuestionsList} styles='mb-4' />
          )}
          {adding && (
            <QuestionForm
              setCurrentQuestion={setCurrentQuestion}
              checkValidation={checkValidation}
              currentQuestion={currentQuestion}
              changeQuestion={changeQuestion}
              populateOption={populateOption}
              saveQuestion={saveQuestion}
              // changeAdding={changeAdding}
              handleCancel={HandleCancel}
              removeOption={removeOption}
              setErrors={setErrors}
              addOption={addOption}
              errors={errors}
            />
          )}

          {!adding && (
            <>
              <div className='flex flex-col'>
                {serviceQuestionsList && serviceQuestionsList.length === 0 && (
                  <div className='flex border border-gray-300 rounded-md mb-3 last:mb-0 justify-between p-6 text-gray-500'>
                    {t('no_questions')}
                  </div>
                )}
                {serviceQuestionsList &&
                  serviceQuestionsList.length > 0 &&
                  serviceQuestionsList.map((question, index) => (
                    <div
                      key={index}
                      className='flex border border-gray-300 rounded-md mb-3 last:mb-0 justify-between'
                    >
                      <div className='flex'>
                        <span className='p-4 border-r border-gray-300'>
                          {options.find(o => o.code === question.questionType)?.label}
                        </span>
                        <span className='p-4'>{question.question}</span>
                      </div>
                      <div className='flex space-x-2 p-4 border-l border-gray-300'>
                        <PencilSquareIcon
                          onClick={() => editQuestion(index)}
                          className='w-6 h-6 text-mainBlue cursor-pointer shadow-sm'
                        />
                        <XCircleIcon
                          onClick={() => removeQuestion(index)}
                          className='w-6 h-6 text-red-500 cursor-pointer shadow-sm'
                        />
                      </div>
                    </div>
                  ))}
              </div>
              {serviceQuestionsList?.length < 3 && (
                <div className='flex mt-6'>
                  <Button
                    variant='solid'
                    onMouseEnter={() => {
                      setmouseEnter(true);
                    }}
                    onMouseLeave={() => {
                      setmouseEnter(false);
                    }}
                    onClick={() => changeAdding(true)}
                  >
                    <PlusIcon
                      className={classNames([
                        'mr-4 h-5 w-5 ',
                        mouseEnter ? 'text-mainBlue' : 'text-white',
                      ])}
                      aria-hidden='true'
                    />
                    {t('booking_questions_add_question')}
                  </Button>
                </div>
              )}
              {isMaxQuestionLimit && (
                <div
                  className={
                    'bg-red-50 flex space-x-2 px-2 text-sm text-red-500 font-medium items-center rounded-md border my-2 p-2 border-red-200'
                  }
                >
                  {t('max_questions_allowed')}
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
