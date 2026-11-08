import styled from 'styled-components';

const ImageFrame = styled.div`
  overflow: hidden;
  border-radius: var(--radius-card);
  background: var(--color-brand-soft);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

interface PropertyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function PropertyImage({ src, alt, className = '' }: PropertyImageProps) {
  return (
    <ImageFrame className={className}>
      <img alt={alt} loading='lazy' src={src} />
    </ImageFrame>
  );
}
