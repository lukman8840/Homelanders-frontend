import { House } from 'lucide-react';
import styled from 'styled-components';

const BrandIcon = styled.span`
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border-radius: var(--radius-control);
  background: var(--color-brand-soft);
  color: var(--color-brand-primary);
`;

export function BrandMark() {
  return (
    <span className='inline-flex items-center gap-2.5'>
      <BrandIcon aria-hidden='true'>
        <House size={20} strokeWidth={2.2} />
      </BrandIcon>
      <span className='text-lg font-bold tracking-tight text-slate-950'>HomeLander</span>
    </span>
  );
}
