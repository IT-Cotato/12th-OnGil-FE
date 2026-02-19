import { api } from '@/lib/api-client';
import { ProductSearchResult, VoiceSearchResponse } from '@/types/domain/product';
import { ProductSortType } from '@/types/enums';
import { SearchResults } from './search-results';
import { SearchError } from './search-error';

interface SearchFilterParams {
  searchType?: string;
  sortType?: string;
  page?: string;
  clothingSizes?: string | string[];
  priceRange?: string | string[];
  brandIds?: string | string[];
}

const PRICE_RANGE_PATTERN = /^\d+-\d+$/;

function normalizeArray(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value.filter((item) => item.trim().length > 0);
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return [value];
  }
  return [];
}

function normalizePriceRange(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value ?? '';
}

function normalizeFilters(filters: SearchFilterParams) {
  const sortValues = Object.values(ProductSortType);
  const safeSortType = sortValues.includes(filters.sortType as ProductSortType)
    ? (filters.sortType as ProductSortType)
    : ProductSortType.POPULAR;
  const safePage =
    Number.isFinite(Number(filters.page)) && Number(filters.page) >= 0
      ? String(Number(filters.page))
      : '0';
  const safeClothingSizes = normalizeArray(filters.clothingSizes).filter((size) =>
    ['XS', 'S', 'M', 'L', 'XL'].includes(size),
  );
  const safeBrandIds = normalizeArray(filters.brandIds).filter((value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0;
  });
  const rawPriceRange = normalizePriceRange(filters.priceRange);
  const safePriceRange = PRICE_RANGE_PATTERN.test(rawPriceRange)
    ? rawPriceRange
    : '';

  return {
    safeSortType,
    safePage,
    safeClothingSizes,
    safeBrandIds,
    safePriceRange,
  };
}

async function fetchVoiceSearchResults(
  query: string,
  filters: SearchFilterParams,
): Promise<VoiceSearchResponse> {
  const {
    safeSortType,
    safePage,
    safeClothingSizes,
    safeBrandIds,
    safePriceRange,
  } = normalizeFilters(filters);

  return await api.post<VoiceSearchResponse>(
    '/search/voice',
    {}, // Empty body - params are in query string
    {
      params: {
        speechText: query,
        sortType: safeSortType,
        sort: JSON.stringify([safeSortType]),
        page: safePage,
        size: '20',
        clothingSizes:
          safeClothingSizes.length > 0 ? safeClothingSizes : undefined,
        priceRange: safePriceRange || undefined,
        brandIds: safeBrandIds.length > 0 ? safeBrandIds : undefined,
      },
      cache: 'no-store',
    },
  );
}

async function fetchProductSearchResults(
  query: string,
  filters: SearchFilterParams,
): Promise<VoiceSearchResponse> {
  const {
    safeSortType,
    safePage,
    safeClothingSizes,
    safeBrandIds,
    safePriceRange,
  } = normalizeFilters(filters);

  const searchResult = await api.get<ProductSearchResult>('/products', {
    params: {
      query,
      sortType: safeSortType,
      page: safePage,
      size: 20,
      clothingSizes:
        safeClothingSizes.length > 0 ? safeClothingSizes : undefined,
      priceRange: safePriceRange || undefined,
      brandIds: safeBrandIds.length > 0 ? safeBrandIds : undefined,
    },
    cache: 'no-store',
  });

  return {
    extractedKeyword: query,
    searchResult,
  };
}

function shouldUseVoiceEndpoint(filters: SearchFilterParams) {
  if (filters.searchType !== 'VOICE') {
    return false;
  }

  const {
    safeSortType,
    safePage,
    safeClothingSizes,
    safeBrandIds,
    safePriceRange,
  } = normalizeFilters(filters);

  return (
    safeSortType === ProductSortType.POPULAR &&
    safePage === '0' &&
    safeClothingSizes.length === 0 &&
    safeBrandIds.length === 0 &&
    safePriceRange.length === 0
  );
}

interface SearchContentProps {
  query: string;
  searchParams: SearchFilterParams;
}

export async function SearchContent({ query, searchParams }: SearchContentProps) {
  let data: VoiceSearchResponse | null = null;
  let error: Error | null = null;

  try {
    data = shouldUseVoiceEndpoint(searchParams)
      ? await fetchVoiceSearchResults(query, searchParams)
      : await fetchProductSearchResults(query, searchParams);
  } catch (err) {
    error = err as Error;
  }

  if (error) {
    return <SearchError error={error} />;
  }

  if (!data) {
    return <SearchError error={new Error('검색 결과를 불러올 수 없습니다')} />;
  }

  return <SearchResults data={data} query={query} />;
}
