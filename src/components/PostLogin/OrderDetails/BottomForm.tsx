import useTranslation from 'next-translate/useTranslation';
import Field from '@root/components/forms/field';
import {toast} from 'react-hot-toast';
import Files from 'react-files';
import {ORDER_FORM_TYPES} from 'constants/enums';

const BottomForm = ({
  loading,
  reason,
  setReason,
  onCancelHandler,
  ManagementHandler,
  meetingDetails,
  txtMessage,
  txtButton,
  formType,
  attachment,
  setAttachment,
}) => {
  const {t} = useTranslation('common');

  return (
    <>
      <div className='flex flex-col py-4 w-full gap-8'>
        <div className='mt-10 sm:mt-0'>
          <div className='md:grid md:grid-cols-1 md:gap-6'>
            <div className='mt-5 md:mt-0 md:col-span-2'>
              <div className='overflow-hidden sm:rounded-md'>
                <div className='px-4 py-5 bg-white sm:p-6'>
                  <div className=''>
                    <div className=''>
                      <label
                        htmlFor='description'
                        className='block text-md font-medium text-gray-700'
                      >
                        {t(`${txtMessage}`)}
                        <span className='text-red-400 font-extrabold m-1'>*</span>
                      </label>
                      <div className='mt-0'>
                        <textarea
                          rows={8}
                          name='text'
                          id='text'
                          onChange={e => {
                            setReason(e.target.value);
                          }}
                          value={reason}
                          className='shadow-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
                        />
                        {formType === ORDER_FORM_TYPES.COMPLETE && (
                          <Field label={t('common:attachment')} className={'pt-4'}>
                            <Files
                              id='attachment'
                              className='border rounded-md h-32 flex justify-center items-center w-full group-in-range:bg-slate-600'
                              accepts={['image/*', 'video/mp4', 'audio/*', '.pdf']}
                              onChange={e => {
                                if (e && e[0]) {
                                  setAttachment(e[0]);
                                }
                              }}
                              onError={el => {
                                toast.error(el.message);
                              }}
                              multiple={false}
                              maxFileSize={2000000}
                              minFileSize={0}
                              clickable
                            >
                              {attachment
                                ? attachment?.name
                                : t('common:drop_files_here_or_click_to_upload')}
                            </Files>
                          </Field>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='px-4 mt-5 sm:mb-4 text-right sm:px-6'>
          <button
            type='button'
            onClick={onCancelHandler}
            className='bg-white shadow-md mr-2 rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-red-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue'
          >
            {t('common:btn_cancel')}
          </button>
          <button
            type='submit'
            onClick={() => {
              ManagementHandler(meetingDetails, reason);
            }}
            disabled={loading || reason === ''}
            className={
              !(loading || reason === '')
                ? 'bg-mainBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-mainBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainBlue w-40'
                : 'bg-slate-400 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2  w-40'
            }
          >
            {loading ? t('common:txt_loading1') : t(`${txtButton}`)}
          </button>
        </div>
      </div>
    </>
  );
};

export default BottomForm;
