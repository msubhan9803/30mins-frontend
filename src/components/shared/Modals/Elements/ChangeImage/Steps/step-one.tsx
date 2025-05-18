import {useEffect, useRef, useState} from 'react';
import Button from '@root/components/button';
import Files from 'react-files';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import Jimp from 'jimp';
import {CircleStencil, CropperRef, Cropper} from 'react-advanced-cropper';
import {ModalContextProvider} from 'store/Modal/Modal.context';
import useTranslation from 'next-translate/useTranslation';
import {PhotoIcon} from '@heroicons/react/20/solid';

import {IValues} from '../feutures/constants';
import 'react-advanced-cropper/dist/style.css';
import 'react-advanced-cropper/dist/themes/classic.css';
import {Slider} from '../feutures/Slider';
import {Navigation} from '../feutures/Navigation';
import {ResetIcon} from '../icons/ResetIcon';
import {AdjustableImage} from '../feutures/AdjustableImage';

export default function StepOne({
  values,
  setValue,
}: {
  values: IValues;
  setValue(field: string, value: any, shouldValidate?: boolean | undefined): void;
}) {
  const {aspect, imgSrc, maxSize} = values;

  const {t} = useTranslation();
  const {hideModal} = ModalContextProvider();
  const [uploading, setUploading] = useState(false);
  function onSelectFile(e) {
    if (e && e.length > 0) {
      // setValue('crop', undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () => setValue('imgSrc', reader?.result?.toString() || ''));
      reader.readAsDataURL(e[0]);
    }
  }

  const cropperRef = useRef<CropperRef>(null);

  const [mode, setMode] = useState('crop');

  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    hue: 0,
    saturation: 0,
    contrast: 0,
    circleStencil: false,
  });

  const changed = Object.values(adjustments).some((el: any) => Math.floor(el * 100));

  useEffect(() => {}, [adjustments]);

  const onChangeValue = (value: number) => {
    if (mode in adjustments) {
      setAdjustments(previousValue => ({
        ...previousValue,
        [mode]: value,
      }));
    }
  };

  const onReset = () => {
    setMode('crop');
    setAdjustments({
      brightness: 0,
      hue: 0,
      saturation: 0,
      contrast: 0,
      circleStencil: false,
    });
  };

  const onUpload = async () => {
    try {
      setUploading(true);
      toast.loading(t('common:uploading'));
      // const size = aspect === 1 ? {w: 300, h: 300} : {w: 1270, h: 300};
      // const mask = await Jimp.read('/assets/mask.png').then(lenna => lenna.resize(size.w, size.h));
      const base64 = Buffer.from(
        cropperRef.current?.getCanvas()?.toDataURL().split(',')[1]!,
        'base64'
      );
      // const Data = await Jimp.read(base64).then(lenna =>
      //   adjustments.circleStencil === true
      //     ? lenna.resize(size.w, size.h).mask(mask, 0, 0)
      //     : lenna.resize(size.w, size.h)
      // );
      const Data = await Jimp.read(base64).then(lenna => lenna.resize(1000, -1));
      // .then(lenna => lenna.resize(size.w, size.h));
      const data: any = await Data?.getBufferAsync(Jimp.MIME_JPEG);
      const file = new File([data], 'fileName.jpeg', {
        type: 'image/jpeg',
      });
      await values.upLoadImage(file);
      toast.dismiss();
      toast.success(t('common:uploading_image_complete'));
      hideModal();
      // eslint-disable-next-line no-empty
    } catch (err) {}
    setUploading(false);
  };

  const cropperEnabled = mode === 'crop';
  return (
    <Files
      id=''
      className={classNames(['image-editor-navigation__button flex flex-col h-full'])}
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
        toast.error(t(`common:txt_valid_upload_image_${(maxSize || 2000000) / 1000000}mb`));
      }}
      multiple={false}
      maxFileSize={maxSize}
      minFileSize={0}
      clickable={false}
    >
      <div className='flex flex-col w-full h-full'>
        <div className={'image-editor'}>
          <div className='image-editor__cropper flex justify-center items-center '>
            <Cropper
              src={imgSrc}
              ref={cropperRef}
              stencilProps={{
                movable: cropperEnabled,
                resizable: cropperEnabled,
                lines: cropperEnabled,
                handlers: cropperEnabled,
                aspectRatio: aspect,
                overlayClassName: classNames(
                  'image-editor__cropper-overlay',
                  !cropperEnabled && 'image-editor__cropper-overlay--faded'
                ),
              }}
              sizeRestrictions={{
                minWidth: 500,
                minHeight: 500,
                maxHeight: Number.POSITIVE_INFINITY,
                maxWidth: Number.POSITIVE_INFINITY,
              }}
              transitions
              backgroundWrapperProps={{
                scaleImage: mode === 'crop',
                moveImage: false,
              }}
              backgroundComponent={AdjustableImage}
              backgroundProps={adjustments}
              className='max-h-96'
              {...(adjustments.circleStencil === true && {stencilComponent: CircleStencil})}
            />
            {Boolean(imgSrc) === false && (
              <div className='w-full h-full flex flex-col justify-center items-center'>
                <span className='text-white text-xl'>{t('common:drag_&_rop_a_image')}</span>
                <PhotoIcon className='w-28 text-white opacity-25' />
              </div>
            )}
            {mode !== 'crop' && (
              <Slider
                className='image-editor__slider'
                value={adjustments[mode]}
                onChange={onChangeValue}
              />
            )}
            <Button
              variant='cancel'
              className={classNames(
                'image-editor__reset-button',
                !changed && 'image-editor__reset-button--hidden'
              )}
              onClick={onReset}
            >
              <ResetIcon />
            </Button>
          </div>
          <Navigation
            mode={mode}
            onChange={setMode}
            onSelectFile={onSelectFile}
            setCircleStencil={() => {
              setAdjustments({...adjustments, circleStencil: !adjustments.circleStencil});
            }}
            circleStencil={adjustments.circleStencil}
            onUpload={onUpload}
            uploading={uploading}
            values={values}
            maxFileSize={maxSize}
          />
        </div>
      </div>
    </Files>
  );
}
