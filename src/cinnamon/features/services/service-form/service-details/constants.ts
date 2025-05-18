export type Props = {
  handleChange: any;
  setValue: any;
  serviceTitle: string;
  serviceSlug: string;
  meetingDuration: number;
  meetingRecurring: boolean;
  noBack: boolean;
  serviceDescription: string;
  meetingAttendees: number;
  meetingType: string[];
  serviceType: string;
  isPrivate: boolean;
  searchTags: string[];
  errors: any;
  dueDate: any;
  move: (action: any, update: any) => Promise<void>;
  step: number;
  mode: string | string[] | undefined;
  editOrgServiceLoading?: any;
  editServiceLoading?: any;
  createServiceLoading?: any;
  submitEditService?: () => void;
};

export const TranslationTexts = {
  MEETING: {
    step_one_title: 'meeting_step_one_title',
    step_one_desc: 'meeting_step_one_desc',
    title_input_placeholder: 'meeting_title_input_placeholder',
    title_input_one: 'meeting_title_input_one',
    title_input_two: 'meeting_title_input_two',
  },
  FREELANCING_WORK: {
    step_one_title: 'freelance_step_one_title',
    step_one_desc: 'freelance_step_one_desc',
    title_input_placeholder: 'freelance_title_input_placeholder',
    title_input_one: 'freelance_title_input_one',
  },
  FULL_TIME_JOB: {
    step_one_title: 'full_time_job_step_one_title',
    step_one_desc: 'full_time_job_step_one_desc',
    title_input_placeholder: 'full_time_job_title_input_placeholder',
    title_input_one: 'full_time_job_title_input_one',
  },
  PART_TIME_JOB: {
    step_one_title: 'part_time_job_step_one_title',
    step_one_desc: 'part_time_job_step_one_desc',
    title_input_placeholder: 'part_time_job_title_input_placeholder',
    title_input_one: 'part_time_job_title_input_one',
  },
  EVENT: {
    step_one_title: 'event_step_one_title',
    step_one_desc: 'event_step_one_desc',
    title_input_placeholder: 'meeting_title_input_placeholder',
    title_input_one: 'meeting_title_input_one',
    title_input_two: 'meeting_title_input_two',
  },
};
