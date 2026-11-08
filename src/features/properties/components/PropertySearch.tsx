import { Search } from 'lucide-react';
import { Input } from '../../../components/ui/Input';

interface PropertySearchProps {
  defaultValue?: string;
}

export function PropertySearch({ defaultValue = '' }: PropertySearchProps) {
  return (
    <div className='relative'>
      <Search
        aria-hidden='true'
        className='pointer-events-none absolute right-3 top-[2.4rem] text-text-muted'
        size={17}
      />
      <Input
        autoComplete='off'
        defaultValue={defaultValue}
        label='Search homes'
        name='q'
        placeholder='Area, neighbourhood, or keyword'
        type='search'
      />
    </div>
  );
}
