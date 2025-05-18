/* eslint-disable import/prefer-default-export */
import {array, boolean, number, object, string, mixed} from 'yup';

export const schema = {
  EVENT: [
    {
      index: 'contact-info',
      required: true,
      fields: ['bookingData.bookerName', 'bookingData.bookerPhone', 'bookingData.bookerEmail'],
      schema: object({
        bookingData: object().shape({
          bookerName: string().required().label('Name'),
          bookerPhone: string().label('Phone Number'),
          bookerEmail: string().email().required().label('Email address'),
        }),
      }),
    },
    {
      index: 'pre-booking-questions',
      required: true,
      fields: ['bookingData.answeredQuestions'],
      schema: object().shape({
        bookingData: object().shape({
          answeredQuestions: array().of(
            object().shape({
              questionType: string(),
              question: string(),
              answer: string().when(['required', 'questionType'], {
                is: (required, questionType) => required && questionType === 'FREE_TEXT',
                then: string().required('Required').label('Answer'),
              }),
              required: boolean(),
              selectedOptions: array().when(['required', 'questionType'], {
                is: (required, questionType) => required && questionType !== 'FREE_TEXT',
                then: array().min(1, 'Min one option required').required().label('Answer'),
              }),
            })
          ),
        }),
      }),
    },
    {
      index: 'any-additional-information',
      required: true,
      fields: [
        'bookingData.subject',
        'bookingData.additionalNotes',
        'bookingData.ccRecipients',
        'bookingData.attachment',
        'bookingData.recurring',
      ],
      schema: object({
        bookingData: object().shape({
          subject: string().required('Required').label('Subject'),
          additionalNotes: string().label('Additional Notes'),
          recurring: number().label('Recurring').min(0).max(3).default(0),
          attachment: mixed()
            .nullable()
            .notRequired()
            .test(
              'FILE_SIZE',
              'File size should be less than 4 MB',
              value => !value || (value && value[0].size <= 4194304)
            ),
          ccRecipients: array()
            .transform(function (value, originalValue) {
              if (this.isType(value) && value !== null) {
                return value;
              }
              return originalValue ? originalValue.split(';') : [];
            })
            .of(string().email(({value}) => ` *${value}* is not a valid email`)),
        }),
      }),
    },
  ],
};
