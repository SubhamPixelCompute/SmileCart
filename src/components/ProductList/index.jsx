import { useState } from "react";

import { PageLoader } from "components/commons";
import Header from "components/commons/Header";
import { useFetchProducts } from "hooks/reactQuery/useProductsApi";
import useDebounce from "hooks/useDebounce";
import { Search } from "neetoicons";
import { Input, NoData, Pagination } from "neetoui";
import { isEmpty } from "ramda";

import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_INDEX } from "./constants";
import ProductListItem from "./ProductListItem";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const debouncedSearchKey = useDebounce(searchKey);

  const { data: { products = [], totalProductsCount } = {}, isLoading } =
    useFetchProducts({
      searchTerm: debouncedSearchKey,
      page: currentPage,
      pageSize: DEFAULT_PAGE_SIZE,
    });

  if (isLoading) {
    return (
      <PageLoader
        prefix={<Search />}
        type="search"
        value={searchKey}
        onChange={event => {
          setSearchKey(event.target.value);
          setCurrentPage(DEFAULT_PAGE_INDEX);
        }}
      />
    );
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
                onChange={e => {
                  setSearchKey(e.target.value);
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
          navigate={page => setCurrentPage(page)}
          pageNo={currentPage || DEFAULT_PAGE_INDEX}
          pageSize={DEFAULT_PAGE_SIZE}
        />
      </div>
    </>
  );
};

export default ProductList;
