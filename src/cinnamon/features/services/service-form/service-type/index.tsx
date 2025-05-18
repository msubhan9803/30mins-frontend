import Image from 'next/image';
import classNames from 'classnames';
import {RadioGroup} from '@headlessui/react';
import {ComputerDesktopIcon} from '@heroicons/react/24/outline';

import StepHeader from '@features/services/service-form/step-header';
import Error, {FieldError} from '@root/components/forms/error';
import useTranslation from 'next-translate/useTranslation';
import queries from 'constants/GraphQL/Organizations/queries';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {useQuery} from '@apollo/client';
import Select from '@root/components/forms/select';
import serviceTypes, {IProps} from './constants';

export default function ServiceType({
  handleChange,
  serviceType,
  organizationName,
  organizationId,
  orgServiceCategory,
  otherServices,
  move,
  step,
  mode,
  errors,
  stype,
  editOrgServiceLoading,
  editServiceLoading,
  submitEditService,
}: IProps) {
  //

  const {data: session} = useSession();
  const {t} = useTranslation('common');
  const [org, setOrg] = useState<any[]>([]);
  const [orgServiceCats, setOrgServiceCats] = useState<any[]>([]);

  const {data: organizationsData} = useQuery(queries.getOrganizationsByUserId, {
    variables: {token: session?.accessToken},
  });

  const services =
    stype && stype === 'organization' ? [{code: 'MEETING', title: 'Meeting'}] : serviceTypes;

  useEffect(() => {
    if (
      organizationsData?.getOrganizationsByUserId.membershipData &&
      organizationsData.getOrganizationsByUserId.membershipData.length > 0
    ) {
      const orgs = organizationsData.getOrganizationsByUserId.membershipData;

      // eslint-disable-next-line @typescript-eslint/no-array-constructor
      const orgPrepareData = orgs
        .filter(o => o?.organizationId?.serviceCategories?.length)
        .map(el => ({
          code: el.organizationId._id,
          label: el.organizationId.title,
        }));
      setOrg(orgPrepareData);
    }
  }, [organizationsData]);

  useEffect(() => {
    if (org.length > 0) {
      if (
        organizationsData?.getOrganizationsByUserId.membershipData &&
        organizationsData.getOrganizationsByUserId.membershipData.length > 0
      ) {
        const o = organizationsData.getOrganizationsByUserId.membershipData.find(
          elem => elem.organizationId._id === organizationId
        );
        if (o && o?.organizationId?.serviceCategories?.length) {
          const scs: {}[] = [];
          o?.organizationId?.serviceCategories?.forEach(sc => {
            scs.push({code: sc, label: sc});
          });
          setOrgServiceCats(scs);
        }
      }
    }
  }, [organizationId]);
  return (
    <>
      {stype && stype === 'organization' && (
        <>
          <StepHeader
            question={t('service_organization_question')}
            description={t('service_organization_description')}
            icon={<ComputerDesktopIcon className='w-6 h-6' />}
            editOrgServiceLoading={editOrgServiceLoading}
            editServiceLoading={editServiceLoading}
            submitEditService={submitEditService}
            move={move}
            step={step}
            mode={mode}
          />
          <div className='w-full flex gap-x-6 gap-y-4 mb-16 flex-wrap'>
            <div className='flex flex-col flex-grow'>
              <Select
                label={t('organization')}
                options={org}
                onChange={e => {
                  handleChange('organizationId', e);
                  handleChange('organizationName', org.find(o => o.code === e).label);
                }}
                selectedOption={organizationId}
                type='question'
                selectedDisplay={organizationName}
              />
              {errors.organizationName && <FieldError message={errors.organizationName} />}
            </div>
            <div className='flex flex-col flex-grow md:mt-0'>
              <Select
                label={t('org_service_category')}
                options={orgServiceCats}
                onChange={e => {
                  handleChange('orgServiceCategory', e);
                }}
                selectedOption={orgServiceCategory}
                type='question'
                selectedDisplay={orgServiceCategory}
              />
              {errors.orgServiceCategory && <FieldError message={errors.orgServiceCategory} />}
            </div>
          </div>
        </>
      )}

      {!(stype && stype === 'organization') && (
        <StepHeader
          question={t('service_type_question')}
          description={t('service_type_description')}
          icon={<ComputerDesktopIcon className='w-6 h-6' />}
          editOrgServiceLoading={editOrgServiceLoading}
          editServiceLoading={editServiceLoading}
          submitEditService={submitEditService}
          {...(stype !== 'organization' && {move, step, mode})}
        />
      )}

      {errors.serviceType && <Error styles='mb-4' message={errors.serviceType} />}
      <div className='w-full'>
        <RadioGroup
          value={serviceType}
          onDoubleClick={() => {
            move('next', false);
          }}
          onChange={e => {
            handleChange('serviceType', e);
          }}
          name='serviceType'
        >
          <div className='flex flex-wrap gap-8'>
            {services
              .filter(el =>
                otherServices ? ['FULL_TIME_JOB', 'PART_TIME_JOB'].includes(el.code) : true
              )
              ?.map(type => (
                <RadioGroup.Option
                  key={type.code}
                  value={type.code}
                  className={({checked}) =>
                    classNames(
                      checked ? 'border-mainBlue' : 'bg-white',
                      'w-full md:w-1/3 select-none flex-grow flex-shrink-0 flex cursor-pointer rounded-lg p-8 border border-gray-300 shadow-md'
                    )
                  }
                >
                  {({checked}) => (
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex space-x-6 items-center'>
                        <Image
                          src={`/icons/services/${type.code}.svg`}
                          height={160}
                          width={160}
                          alt=''
                        />
                        <div className='text-sm flex flex-col'>
                          <RadioGroup.Label
                            className={classNames(
                              checked ? 'text-mainBlue' : 'text-mainText',
                              'text-lg font-medium '
                            )}
                          >
                            {t(`${type.code}`)}
                          </RadioGroup.Label>
                          <RadioGroup.Description as='span' className={`inline text-gray-500`}>
                            <span>{t(`${type.code}_DESCRIPTION`)}</span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
          </div>
        </RadioGroup>
      </div>
    </>
  );
}
