import { useState } from "react";

import { PageLoader } from "components/commons";
import Header from "components/commons/Header";
import { buildUrl } from "components/utils/url";
import { useFetchProducts } from "hooks/reactQuery/useProductsApi";
import useFuncDebounce from "hooks/useFuncDebounce";
import useQueryParams from "hooks/useQueryParams";
import { filterNonNull } from "neetocist";
import { Search } from "neetoicons";
import { Input, NoData, Pagination } from "neetoui";
import { isEmpty, mergeLeft } from "ramda";
import { useHistory } from "react-router-dom";
import routes from "routes";

import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_INDEX } from "./constants";
import ProductListItem from "./ProductListItem";

const ProductList = () => {
  const { page, pageSize, searchTerm = "" } = useQueryParams();
  const [searchKey, setSearchKey] = useState(searchTerm);

  const history = useHistory();
  const queryParams = useQueryParams();

  const handlePageNavigation = page => {
    history.replace(
      buildUrl(
        routes.products.index,
        mergeLeft({ page, pageSize: DEFAULT_PAGE_SIZE }, queryParams)
      )
    );
  };

  const updateQueryParams = useFuncDebounce(value => {
    const params = {
      page: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PAGE_SIZE,
      searchTerm: value || null,
    };

    history.replace(buildUrl(routes.products.index, filterNonNull(params)));
  });

  const { data: { products = [], totalProductsCount } = {}, isLoading } =
    useFetchProducts({
      searchTerm: searchKey,
      page: Number(page) || DEFAULT_PAGE_INDEX,
      pageSize: Number(pageSize) || DEFAULT_PAGE_SIZE,
    });

  if (isLoading) {
    return <PageLoader prefix={<Search />} type="search" value={searchKey} />;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="m-2 ">
          <Header
            shouldShowBackButton={false}
            title="Smile cart"
            actionBlock={
              <Input
                className="w-full"
                placeholder="Search products"
                prefix={<Search />}
                type="search"
                value={searchKey}
                onChange={({ target: { value } }) => {
                  updateQueryParams(value);
                  setSearchKey(value);
                }}
              />
            }
          />
          <hr className="neeto-ui-bg-black h-1 " />
        </div>
        {isEmpty(products) ? (
          <NoData className="h-full w-full" title="No products to show" />
        ) : (
          <div className="grid grid-cols-2 justify-items-center gap-y-8 p-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map(product => (
              <ProductListItem
                key={product.slug}
                {...product}
                availableQuantity={totalProductsCount}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mb-5 self-end">
        <Pagination
          count={totalProductsCount}
          pageNo={Number(page) || DEFAULT_PAGE_INDEX}
          pageSize={Number(pageSize) || DEFAULT_PAGE_SIZE}
          navigate={page => {
            handlePageNavigation(page);
          }}
        />
      </div>
    </>
  );
};

export default ProductList;
