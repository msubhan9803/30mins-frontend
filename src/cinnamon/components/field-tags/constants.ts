import {array, object, string} from 'yup';

export type IProps = {
  value: Array<string>;
  title?: string;
  onChange: (value: Array<string>) => void;
};

export const schema = object({
  newTag: string().max(50, 'tag_must_be_at_most_50_characters').trim(),
  value: array()
    .of(string())
    .max(9, 'no_more_tags')
    .default([])
    .test(
      'newTag',
      'tag_already_exists',
      (value: Array<string>, {parent}) => !value.includes(parent.newTag)
    ),
});
