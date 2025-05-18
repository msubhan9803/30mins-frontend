/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable import/prefer-default-export */
import React, {FC} from 'react';
import cn from 'classnames';
import toast from 'react-hot-toast';
import Files from 'react-files';
import useTranslation from 'next-translate/useTranslation';
import {UploadIcon} from '../icons/UploadIcon';
import {CropIcon} from '../icons/CropIcon';
import {HueIcon} from '../icons/HueIcon';
import {SaturationIcon} from '../icons/SaturationIcon';
import {ContrastIcon} from '../icons/ContrastIcon';
import {BrightnessIcon} from '../icons/BrightnessIcon';
import {Button} from './Button';
import {SaveIcon} from '../icons/SaveIcon';
import {CubeIcon} from '../icons/CubeIcon';
import {CircleIcon} from '../icons/CircleIcon';
import {IValues} from './constants';

interface Props {
  className?: string;
  mode?: string;
  onChange?: (mode: string) => void;
  onSelectFile: (el: any) => void;
  onUpload: () => void;
  setCircleStencil: any;
  uploading: boolean;
  circleStencil: boolean;
  values: IValues;
  maxFileSize?: number;
}

export const Navigation: FC<Props> = ({
  className,
  onChange,
  mode,
  onSelectFile,
  onUpload,
  circleStencil,
  setCircleStencil,
  values,
  uploading,
  maxFileSize,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const setMode = (mode: string) => () => {
    onChange?.(mode);
  };
  const {t} = useTranslation();

  return (
    <div
      className={cn(
        'image-editor-navigation justify-around flex overflow-y-auto w-full flex-col md:flex-row gap-2 h-max py-2',
        className
      )}
    >
      <Files
        id=''
        className='image-editor-navigation__button hidden md:flex'
        accepts={['.png', '.jpeg', '.jpg']}
        onChange={el => {
          try {
            if (el && el[0]) {
              onSelectFile(el);
            }
            // eslint-disable-next-line no-empty
          } catch (err) {}
        }}
        onError={() => {
          toast.error(t(`common:txt_valid_upload_image_${(maxFileSize || 2000000) / 1000000}mb`));
        }}
        multiple={false}
        maxFileSize={maxFileSize}
        minFileSize={0}
        clickable
      >
        <div className='flex flex-col items-center'>
          <Button onClick={() => {}}>
            <UploadIcon className='fill-white' />
          </Button>
          <span className='text-xs -mt-2'>{t('common:Select Image')}</span>
        </div>
      </Files>
      <div className='image-editor-navigation__buttons ml-4'>
        <Button
          className={'image-editor-navigation__button'}
          active={mode === 'crop'}
          onClick={setMode('crop')}
        >
          <CropIcon />
        </Button>

        <Button
          className={'image-editor-navigation__button image-editor-button--active bg-transparent'}
          active={true}
          onClick={() => {
            setCircleStencil();
          }}
        >
          {!circleStencil ? <CubeIcon /> : <CircleIcon />}
        </Button>

        <Button
          className={'image-editor-navigation__button'}
          active={mode === 'saturation'}
          onClick={setMode('saturation')}
        >
          <SaturationIcon />
        </Button>
        <Button
          className={'image-editor-navigation__button'}
          active={mode === 'brightness'}
          onClick={setMode('brightness')}
        >
          <BrightnessIcon />
        </Button>
        <Button
          className={'image-editor-navigation__button'}
          active={mode === 'contrast'}
          onClick={setMode('contrast')}
        >
          <ContrastIcon />
        </Button>
        <Button
          className={'image-editor-navigation__button'}
          active={mode === 'hue'}
          onClick={setMode('hue')}
        >
          <HueIcon />
        </Button>
      </div>
      <div className='hidden md:flex flex-col items-center'>
        <Button
          active={Boolean(values?.imgSrc)! && uploading !== true}
          className='image-editor-navigation__button'
          onClick={onUpload}
          disabled={!Boolean(values?.imgSrc)! || uploading}
        >
          <SaveIcon
            className={Boolean(values?.imgSrc)! && uploading !== true ? '' : 'text-white'}
          />
        </Button>
        <span className='text-xs -mt-2'>{t('common:Upload Image')}</span>
      </div>

      <div className='flex md:hidden gap-4'>
        <Files
          id=''
          className='image-editor-navigation__button'
          accepts={['.png', '.jpeg', '.jpg']}
          onChange={el => {
            try {
              if (el && el[0]) {
                onSelectFile(el);
              }
              // eslint-disable-next-line no-empty
            } catch (err) {}
          }}
          onError={() => {
            toast.error(t(`common:txt_valid_upload_image_${(maxFileSize || 2000000) / 1000000}mb`));
          }}
          multiple={false}
          maxFileSize={maxFileSize}
          minFileSize={0}
          clickable
        >
          <div className='flex flex-col items-center'>
            <Button onClick={() => {}}>
              <UploadIcon className='fill-white' />
            </Button>
            <span className='text-xs -mt-2'>{t('common:Select Image')}</span>
          </div>
        </Files>
        <div className='flex flex-col items-center'>
          <Button
            active={Boolean(values?.imgSrc)! && uploading !== true}
            className=''
            onClick={() => onUpload()}
            disabled={!Boolean(values?.imgSrc)! || uploading}
          >
            <SaveIcon
              className={Boolean(values?.imgSrc)! && uploading !== true ? '' : 'text-white'}
            />
          </Button>
          <span className='text-xs -mt-2'>{t('common:Upload Image')}</span>
        </div>
      </div>
    </div>
  );
};
