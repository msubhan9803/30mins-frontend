export const activation = [
  {code: 'yes', title: 'Yes, add  questions'},
  {code: 'no', title: 'No questions'},
];

export const options = [
  {code: 'FREE_TEXT', label: 'Free Text'},
  {code: 'DROPDOWN', label: 'Dropdown'},
  {code: 'CHECKBOX', label: 'Checkbox'},
  {code: 'RADIO', label: 'Radio'},
];

export type QuestionType = {
  questionType: string;
  question: string;
  required: boolean;
  options?: string[];
};
