'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type {
  Product,
  ProductDetail,
  ProductOption,
} from '@/types/domain/product';
import type { ReviewStatsData } from '@/types/domain/review';
import type { SizeAnalysisResult, UserBodyInfo } from '@/types/domain/size';
import ProductDescription from '@/components/product/descriptions/product-description';
import { ProductInteractionProvider } from '@/components/product/product-interaction-context';
import { ProductStickyContainer } from '@/components/product/descriptions/product-sticky-container';
import ProductTab from '@/components/product/product-tab';

const ProductSizeContent = dynamic(
  () =>
    import('@/components/product/size/product-size-content').then(
      (module) => module.ProductSizeContent,
    ),
  {
    loading: () => <TabPanelFallback label="사이즈" />,
  },
);

const ProductReviewContent = dynamic(
  () => import('@/components/product/review/review-section'),
  {
    loading: () => <TabPanelFallback label="리뷰" />,
  },
);

interface ProductDetailTabsClientProps {
  product: ProductDetail;
  similarProducts: Product[];
  userInfo: UserBodyInfo | null;
  analysisData: SizeAnalysisResult | null;
  reviewStats: ReviewStatsData;
}

function TabPanelFallback({ label }: { label: string }) {
  return (
    <div className="min-h-[500px] animate-pulse rounded-lg bg-gray-50 py-20 text-center text-gray-400">
      {label} 콘텐츠를 불러오는 중...
    </div>
  );
}

function ProductInquiryContent() {
  return (
    <div className="rounded-lg bg-gray-50 py-20 text-center text-gray-500">
      <p>문의 영역입니다.</p>
      <p className="mt-2 text-sm">이곳에 문의 리스트 컴포넌트가 들어갑니다.</p>
    </div>
  );
}

export default function ProductDetailTabsClient({
  product,
  similarProducts,
  userInfo,
  analysisData,
  reviewStats,
}: ProductDetailTabsClientProps) {
  const [activeTab, setActiveTab] = useState('desc');

  const availableSizes = [
    ...new Set(
      (product.options ?? []).map((option: ProductOption) => option.size),
    ),
  ];
  const availableColors = [
    ...new Set(
      (product.options ?? []).map((option: ProductOption) => option.color),
    ),
  ];
  const recommendedSize =
    analysisData?.recommendedSizes.find((size) =>
      availableSizes.includes(size),
    ) ?? undefined;

  const reviewProductInfo = {
    productId: Number(product.id),
    name: product.name,
    materialDescription: product.materialDescription,
    materialName: product.materialOriginal,
    availableOptions: {
      sizes: availableSizes,
      colors: availableColors,
    },
    recommendedSize,
  };

  return (
    <ProductInteractionProvider key={product.id}>
      <ProductStickyContainer
        tabBarSlot={
          <ProductTab
            activateTab={activeTab}
            onTabChange={setActiveTab}
            reviewCount={
              reviewStats.initialReviewCount + reviewStats.oneMonthReviewCount
            }
          />
        }
      >
        <div className="min-h-[500px]">
          {activeTab === 'desc' && (
            <ProductDescription
              product={product}
              similarProducts={similarProducts}
            />
          )}
          {activeTab === 'size' && (
            <ProductSizeContent
              userInfo={userInfo}
              analysisData={analysisData}
            />
          )}
          {activeTab === 'inquiry' && <ProductInquiryContent />}
          {activeTab === 'review' && (
            <ProductReviewContent
              productInfo={reviewProductInfo}
              stats={reviewStats}
            />
          )}
        </div>
      </ProductStickyContainer>
    </ProductInteractionProvider>
  );
}
