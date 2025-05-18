/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable import/prefer-default-export */
import React, {forwardRef, useEffect, useRef} from 'react';
import cn from 'classnames';
import {
  getBackgroundStyle,
  mergeRefs,
  CropperTransitions,
  CropperImage,
  CropperState,
} from 'react-advanced-cropper';

interface DesiredCropperRef {
  getState: () => CropperState;
  getTransitions: () => CropperTransitions;
  getImage: () => CropperImage;
}

interface Props {
  className?: string;
  cropper: DesiredCropperRef;
  crossOrigin?: 'anonymous' | 'use-credentials' | boolean;
  brightness?: number;
  saturation?: number;
  hue?: number;
  contrast?: number;
}

export const AdjustableImage = forwardRef<HTMLCanvasElement, Props>(
  (
    {className, cropper, crossOrigin, brightness = 0, saturation = 0, hue = 0, contrast = 0}: Props,
    ref
  ) => {
    const state = cropper.getState();
    const transitions = cropper.getTransitions();
    const image = cropper.getImage();

    const imageRef = useRef<HTMLImageElement>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const style = image && state ? getBackgroundStyle(image, state, transitions) : {};

    const src = image ? image.src : undefined;

    const drawImage = () => {
      const Iimage: any = imageRef.current;
      const canvas = canvasRef.current;
      if (canvas && image && Iimage.complete) {
        const ctx = canvas.getContext('2d');
        canvas.width = Iimage.naturalWidth;
        canvas.height = Iimage.naturalHeight;

        if (ctx) {
          ctx.filter = [
            `brightness(${100 + brightness * 100}%)`,
            `contrast(${100 + contrast * 100}%)`,
            `saturate(${100 + saturation * 100}%)`,
            `hue-rotate(${hue * 360}deg)`,
          ].join(' ');

          ctx.drawImage(Iimage, 0, 0, Iimage.naturalWidth, Iimage.naturalHeight);
        }
      }
    };

    useEffect(() => {
      drawImage();
    }, [brightness, saturation, hue, contrast]);

    return (
      <>
        <canvas
          ref={mergeRefs([ref, canvasRef])}
          className={cn('adjustable-image-canvas', className)}
          style={style}
        />
        {src ? (
          <img
            alt=''
            key={src}
            ref={imageRef}
            className={'adjustable-image-source hidden'}
            src={src}
            crossOrigin={crossOrigin === true ? 'anonymous' : crossOrigin || undefined}
            onLoad={drawImage}
          />
        ) : null}
      </>
    );
  }
);

AdjustableImage.displayName = 'AdjustableImage';
