import { getSubCategories } from '@/app/actions/category';
import { api } from '@/lib/api-client';
import { ProductSearchResult } from '@/types/domain/product';
import { ProductSortType } from '@/types/enums';
import { BrandFilterOption, ProductFilterBar } from './product-filter-bar';

interface ProductFilterBarContainerProps {
  params: Promise<{ parentId: string; id: string }>;
  searchParams: Promise<{
    sortType?: string;
    page?: string;
    clothingSizes?: string | string[];
    priceRange?: string | string[];
    brandIds?: string | string[];
  }>;
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

export default async function ProductFilterBarContainer({
  params,
  searchParams,
}: ProductFilterBarContainerProps) {
  const [{ parentId, id: subCategoryId }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const parsedCategoryId = Number(subCategoryId);
  const parsedParentId = Number(parentId);
  const safeCategoryId =
    Number.isFinite(parsedCategoryId) && parsedCategoryId > 0
      ? parsedCategoryId
      : null;

  if (safeCategoryId === null) {
    return <ProductFilterBar parentCategoryName="" availableBrands={[]} />;
  }

  const sortValues = Object.values(ProductSortType);
  const safeSortType = sortValues.includes(query.sortType as ProductSortType)
    ? (query.sortType as ProductSortType)
    : ProductSortType.POPULAR;

  const sizeOptions = normalizeArray(query.clothingSizes).filter((size) =>
    ['XS', 'S', 'M', 'L', 'XL'].includes(size),
  );

  const rawPriceRange = normalizePriceRange(query.priceRange);
  const safePriceRange = PRICE_RANGE_PATTERN.test(rawPriceRange)
    ? rawPriceRange
    : '';

  const [subCategories, result] = await Promise.all([
    Number.isFinite(parsedParentId)
      ? getSubCategories(parsedParentId)
      : Promise.resolve([]),
    api.get<ProductSearchResult>('/products', {
      params: {
        categoryId: safeCategoryId,
        sortType: safeSortType,
        page: 0,
        size: 36,
        clothingSizes: sizeOptions.length > 0 ? sizeOptions : undefined,
        priceRange: safePriceRange || undefined,
      },
    }),
  ]);

  const parentCategoryName = subCategories[0]?.parentCategoryName ?? '';
  const productItems = result.products.content as Array<{
    brandName: string;
    brandId?: number;
  }>;
  const availableBrands = Array.from(
    new Map(
      productItems
        .map((product) => {
          const id = Number(product.brandId);
          const name = product.brandName.trim();
          if (!Number.isFinite(id) || id <= 0 || name.length === 0) return null;
          return [String(id), { id, name }] as const;
        })
        .filter(
          (
            item,
          ): item is readonly [string, BrandFilterOption] => item !== null,
        ),
    ).values(),
  ).sort((a, b) => a.name.localeCompare(b.name, 'ko'));

  return (
    <ProductFilterBar
      parentCategoryName={parentCategoryName}
      availableBrands={availableBrands}
    />
  );
}
