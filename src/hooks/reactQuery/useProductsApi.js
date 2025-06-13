import { QUERY_KEYS } from "constants/query";

import productsApi from "apis/products";
import { existsBy } from "neetocist";
import { prop } from "ramda";
import { useQueries, useQuery } from "react-query";

export const useShowProduct = slug =>
  useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, slug],
    queryFn: () => productsApi.show(slug),
  });

export const useFetchProducts = params =>
  useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, params],
    queryFn: () => productsApi.fetch(params),
    keepPreviousData: true,
  });

export const useFetchCartProducts = slugs => {
  const responses = useQueries(
    slugs.map(slug => ({
      queryKey: [QUERY_KEYS.PRODUCTS, slug],
      queryFn: () => productsApi.show(slug),
    }))
  );
  const data = responses.map(prop("data")).filter(Boolean);
  const isLoading = existsBy({ isLoading: true }, responses);

  return { data, isLoading };
};
