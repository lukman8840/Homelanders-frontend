import { useState } from 'react';
import styled from 'styled-components';
import type { PropertyImage as PropertyImageData } from '../types/property';

const GalleryFrame = styled.div`
  display: grid;
  gap: 0.75rem;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

interface PropertyGalleryProps {
  images: PropertyImageData[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [activeImageId, setActiveImageId] = useState(images[0]?.id ?? '');
  const activeImage = images.find((image) => image.id === activeImageId) ?? images[0];

  if (!activeImage) {
    return (
      <div className='grid aspect-[4/3] place-items-center rounded-card bg-brand-soft text-sm text-text-muted'>
        No sample images available
      </div>
    );
  }

  return (
    <GalleryFrame aria-label='Sample property image gallery'>
      <div className='aspect-[4/3] overflow-hidden rounded-card bg-brand-soft sm:aspect-[16/10]'>
        <img alt={activeImage.alt} src={activeImage.src} />
      </div>
      {images.length > 1 ? (
        <div aria-label='Choose a sample property image' className='grid grid-cols-3 gap-3'>
          {images.map((image, index) => (
            <button
              aria-label={`Show sample image ${index + 1}: ${image.alt}`}
              aria-pressed={image.id === activeImage.id}
              className={`aspect-[4/3] overflow-hidden rounded-control border-2 bg-brand-soft ${
                image.id === activeImage.id
                  ? 'border-brand-primary'
                  : 'border-transparent hover:border-border'
              }`}
              key={image.id}
              onClick={() => setActiveImageId(image.id)}
              type='button'
            >
              <img alt='' src={image.src} />
            </button>
          ))}
        </div>
      ) : null}
    </GalleryFrame>
  );
}
