import { useEffect, useState } from "react";

import productsApi from "apis/products";
import Header from "components/commons/Header";
import useDebounce from "hooks/useDebounce";
import { Search } from "neetoicons";
import { Spinner, Input, NoData } from "neetoui";
import { isEmpty } from "ramda";

import ProductListItem from "./ProductListItem";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [availableQuantity, setAvailableQuantity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const debouncedSearchKey = useDebounce(searchKey);

  const fetchProducts = async () => {
    try {
      const data = await productsApi.fetch({
        searchTerm: debouncedSearchKey,
      });

      setProducts(data.products);
      setAvailableQuantity(data.totalProductsCount);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchKey, fetchProducts]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
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
              onChange={event => setSearchKey(event.target.value)}
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
              availableQuantity={availableQuantity}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
