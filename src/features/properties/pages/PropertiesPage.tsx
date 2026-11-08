import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Container } from '../../../components/ui/Container';
import { Button } from '../../../components/ui/Button';
import { PropertyFilters } from '../components/PropertyFilters';
import { PropertyGrid } from '../components/PropertyGrid';
import { sampleProperties } from '../data/sampleProperties';
import { filterProperties } from '../utils/filterProperties';
import type { PropertyFilters as PropertyFiltersValue, PropertyType } from '../types/property';

const pageSize = 3;
const validTypes: PropertyType[] = ['apartment', 'detached-home', 'terrace-home', 'duplex'];
const validSortOptions: PropertyFiltersValue['sortBy'][] = ['newest', 'price-asc', 'price-desc'];

function readFilters(params: URLSearchParams): PropertyFiltersValue {
  const type = params.get('type') ?? '';
  const sort = params.get('sort') ?? 'newest';

  return {
    query: params.get('q') ?? '',
    location: params.get('location') ?? '',
    minPrice: params.get('minPrice') ?? '',
    maxPrice: params.get('maxPrice') ?? '',
    propertyType: validTypes.includes(type as PropertyType) ? (type as PropertyType) : '',
    minBedrooms: params.get('beds') ?? '',
    minBathrooms: params.get('baths') ?? '',
    sortBy: validSortOptions.includes(sort as PropertyFiltersValue['sortBy'])
      ? (sort as PropertyFiltersValue['sortBy'])
      : 'newest',
  };
}

export function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readFilters(searchParams);
  const matchingProperties = filterProperties(sampleProperties, filters);
  const requestedPage = Number(searchParams.get('page') ?? 1);
  const pageCount = Math.max(1, Math.ceil(matchingProperties.length / pageSize));
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, pageCount) : 1;
  const startIndex = (currentPage - 1) * pageSize;
  const visibleProperties = matchingProperties.slice(startIndex, startIndex + pageSize);

  const handleApply = (nextFilters: PropertyFiltersValue) => {
    const params = new URLSearchParams();
    const filterParams: Array<[string, string]> = [
      ['q', nextFilters.query],
      ['location', nextFilters.location],
      ['minPrice', nextFilters.minPrice],
      ['maxPrice', nextFilters.maxPrice],
      ['type', nextFilters.propertyType],
      ['beds', nextFilters.minBedrooms],
      ['baths', nextFilters.minBathrooms],
      ['sort', nextFilters.sortBy],
    ];

    filterParams.forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    setSearchParams(params);
  };

  return (
    <Container className='py-10 sm:py-14'>
      <div className='max-w-3xl'>
        <p className='text-sm font-semibold text-brand-primary'>Abuja, Nigeria</p>
        <h1 className='mt-2 text-4xl font-semibold tracking-tight text-text-primary'>
          Explore sample homes
        </h1>
        <p className='mt-3 text-sm leading-6 text-text-muted'>
          These illustrative listings help demonstrate the marketplace. They are not real offers and
          are not available to view or purchase.
        </p>
      </div>
      <div className='mt-7'>
        <PropertyFilters
          filters={filters}
          key={searchParams.toString()}
          onApply={handleApply}
          onClear={() => setSearchParams({})}
        />
      </div>
      <div className='mt-6 flex flex-wrap items-center justify-between gap-2'>
        <p aria-live='polite' className='text-sm text-text-muted'>
          Showing {matchingProperties.length === 0 ? 0 : startIndex + 1}–
          {Math.min(startIndex + pageSize, matchingProperties.length)} of{' '}
          {matchingProperties.length} illustrative{' '}
          {matchingProperties.length === 1 ? 'listing' : 'listings'}
        </p>
        <p className='text-xs text-text-muted'>Sample data only · Abuja districts</p>
      </div>
      <div className='mt-4'>
        <PropertyGrid properties={visibleProperties} />
      </div>
      {pageCount > 1 ? (
        <nav
          aria-label='Property results pages'
          className='mt-8 flex items-center justify-center gap-4'
        >
          <Button
            aria-label='Previous results page'
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            type='button'
            variant='outline'
          >
            <ChevronLeft aria-hidden='true' size={16} />
            Previous
          </Button>
          <p aria-live='polite' className='text-sm text-text-muted'>
            Page {currentPage} of {pageCount}
          </p>
          <Button
            aria-label='Next results page'
            disabled={currentPage === pageCount}
            onClick={() => handlePageChange(currentPage + 1)}
            type='button'
            variant='outline'
          >
            Next
            <ChevronRight aria-hidden='true' size={16} />
          </Button>
        </nav>
      ) : null}
    </Container>
  );
}
