import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  ABUJA_DISTRICTS,
  PROPERTY_TYPE_LABELS,
  type PropertyFilters as PropertyFiltersValue,
  type PropertyType,
} from '../types/property';
import { PropertySearch } from './PropertySearch';

interface PropertyFiltersProps {
  filters: PropertyFiltersValue;
  onApply(filters: PropertyFiltersValue): void;
  onClear(): void;
}

export function PropertyFilters({ filters, onApply, onClear }: PropertyFiltersProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const typeValue = String(formData.get('type') ?? '');
    const sortValue = String(formData.get('sort') ?? 'newest');
    const propertyType = typeValue in PROPERTY_TYPE_LABELS ? (typeValue as PropertyType) : '';
    const sortBy: PropertyFiltersValue['sortBy'] =
      sortValue === 'price-asc' || sortValue === 'price-desc' ? sortValue : 'newest';

    onApply({
      query: String(formData.get('q') ?? '').trim(),
      location: String(formData.get('location') ?? ''),
      minPrice: String(formData.get('minPrice') ?? ''),
      maxPrice: String(formData.get('maxPrice') ?? ''),
      propertyType,
      minBedrooms: String(formData.get('beds') ?? ''),
      minBathrooms: String(formData.get('baths') ?? ''),
      sortBy,
    });
  };

  return (
    <details className='group rounded-card border border-border bg-white' open>
      <summary className='flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 font-semibold text-text-primary marker:hidden [&::-webkit-details-marker]:hidden'>
        <span className='inline-flex items-center gap-2'>
          <SlidersHorizontal aria-hidden='true' className='text-brand-primary' size={17} />
          Search and filters
        </span>
        <span className='text-xs font-medium text-text-muted group-open:hidden'>Show</span>
        <span className='hidden text-xs font-medium text-text-muted group-open:inline'>Hide</span>
      </summary>
      <form
        className='grid gap-4 border-t border-border p-4 sm:grid-cols-2 lg:grid-cols-4'
        onSubmit={handleSubmit}
      >
        <div className='sm:col-span-2 lg:col-span-4'>
          <PropertySearch defaultValue={filters.query} />
        </div>
        <label className='grid gap-1.5 text-sm font-medium text-text-primary'>
          Abuja district
          <select
            className='min-h-11 rounded-control border border-border bg-white px-3 text-sm text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
            defaultValue={filters.location}
            name='location'
          >
            <option value=''>All districts</option>
            {ABUJA_DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>
        <label className='grid gap-1.5 text-sm font-medium text-text-primary'>
          Property type
          <select
            className='min-h-11 rounded-control border border-border bg-white px-3 text-sm text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
            defaultValue={filters.propertyType}
            name='type'
          >
            <option value=''>All property types</option>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className='grid gap-1.5 text-sm font-medium text-text-primary'>
          Minimum bedrooms
          <select
            className='min-h-11 rounded-control border border-border bg-white px-3 text-sm text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
            defaultValue={filters.minBedrooms}
            name='beds'
          >
            <option value=''>Any</option>
            {[1, 2, 3, 4, 5].map((count) => (
              <option key={count} value={count}>
                {count}+ bedrooms
              </option>
            ))}
          </select>
        </label>
        <label className='grid gap-1.5 text-sm font-medium text-text-primary'>
          Minimum bathrooms
          <select
            className='min-h-11 rounded-control border border-border bg-white px-3 text-sm text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
            defaultValue={filters.minBathrooms}
            name='baths'
          >
            <option value=''>Any</option>
            {[1, 2, 3, 4].map((count) => (
              <option key={count} value={count}>
                {count}+ bathrooms
              </option>
            ))}
          </select>
        </label>
        <Input
          defaultValue={filters.minPrice}
          label='Minimum price (₦)'
          min={0}
          name='minPrice'
          placeholder='No minimum'
          type='number'
        />
        <Input
          defaultValue={filters.maxPrice}
          label='Maximum price (₦)'
          min={0}
          name='maxPrice'
          placeholder='No maximum'
          type='number'
        />
        <label className='grid gap-1.5 text-sm font-medium text-text-primary'>
          Sort by
          <select
            className='min-h-11 rounded-control border border-border bg-white px-3 text-sm text-text-primary outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-soft'
            defaultValue={filters.sortBy}
            name='sort'
          >
            <option value='newest'>Newest examples</option>
            <option value='price-asc'>Price: low to high</option>
            <option value='price-desc'>Price: high to low</option>
          </select>
        </label>
        <div className='flex items-end gap-2 sm:col-span-2 lg:col-span-4'>
          <Button className='flex-1 sm:flex-none' type='submit'>
            Apply filters
          </Button>
          <Button className='flex-1 sm:flex-none' onClick={onClear} type='button' variant='outline'>
            <RotateCcw aria-hidden='true' size={15} />
            Clear
          </Button>
        </div>
      </form>
    </details>
  );
}
