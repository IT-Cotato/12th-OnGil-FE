import { ApiError } from '@/lib/api-client';
import type { ApiResponse } from '@/types/common';

const BASE_URL = process.env.BACKEND_API_URL;
const DEFAULT_REVALIDATE_SECONDS = 60;

interface PublicFetchOptions extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | string[] | undefined>;
  revalidate?: number;
}

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | string[] | undefined>,
): string {
  let url = `${BASE_URL}${endpoint}`;

  if (!params) {
    return url;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }
    searchParams.append(key, String(value));
  });

  return `${url}?${searchParams.toString()}`;
}

async function get<T>(endpoint: string, options: PublicFetchOptions = {}) {
  const url = buildUrl(endpoint, options.params);
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const nextOptions =
    options.cache === 'no-store'
      ? options.next
      : {
          revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
          ...options.next,
        };

  const response = await fetch(url, {
    method: 'GET',
    headers,
    cache: options.cache,
    next: nextOptions,
  });

  let responseData: unknown;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof responseData === 'object' &&
      responseData !== null &&
      'message' in responseData &&
      typeof responseData.message === 'string'
        ? responseData.message
        : 'Something went wrong';

    throw new ApiError(response.status, message, responseData);
  }

  const result = responseData as ApiResponse<T>;
  return result.data;
}

export const publicApi = {
  get,
};
