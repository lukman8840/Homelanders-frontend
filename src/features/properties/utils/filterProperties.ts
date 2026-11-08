import type { Property, PropertyFilters } from '../types/property';

export function filterProperties(properties: Property[], filters: PropertyFilters) {
  const query = filters.query.trim().toLocaleLowerCase('en-NG');
  const minPrice = parseBound(filters.minPrice);
  const maxPrice = parseBound(filters.maxPrice);
  const minBedrooms = parseBound(filters.minBedrooms);
  const minBathrooms = parseBound(filters.minBathrooms);

  const filtered = properties.filter((property) => {
    const searchableText = [
      property.title,
      property.description,
      property.location.address,
      property.location.district,
      property.location.city,
      property.propertyType,
    ]
      .join(' ')
      .toLocaleLowerCase('en-NG');

    return (
      (!query || searchableText.includes(query)) &&
      (!filters.location || property.location.district === filters.location) &&
      (minPrice === undefined || property.priceNaira >= minPrice) &&
      (maxPrice === undefined || property.priceNaira <= maxPrice) &&
      (!filters.propertyType || property.propertyType === filters.propertyType) &&
      (minBedrooms === undefined || property.features.bedrooms >= minBedrooms) &&
      (minBathrooms === undefined || property.features.bathrooms >= minBathrooms)
    );
  });

  return filtered.sort((first, second) => {
    if (filters.sortBy === 'price-asc') {
      return first.priceNaira - second.priceNaira;
    }

    if (filters.sortBy === 'price-desc') {
      return second.priceNaira - first.priceNaira;
    }

    return (
      new Date(second.listingInfo.listedAt).getTime() -
      new Date(first.listingInfo.listedAt).getTime()
    );
  });
}

function parseBound(value: string) {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : undefined;
}
