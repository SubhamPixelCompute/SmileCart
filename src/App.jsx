import { Route, Switch } from "react-router-dom";
import { NavLink, Redirect } from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";

import PageNotFound from "./components/commons/PageNotFound";
import Product from "./components/Product";
import ProductList from "./components/ProductList";

const App = () => (
  <>
    <div className="flex space-x-2">
      <NavLink exact activeClassName="underline font-bold" to="/">
        Home
      </NavLink>
      <NavLink exact activeClassName="underline font-bold" to="/product">
        Product
      </NavLink>
    </div>
    <Switch>
      <Route exact component={Product} path={routes.products.show} />
      <Route exact component={ProductList} path={routes.products.index} />
      <Redirect exact from={routes.root} to={routes.products.index} />
      <Route component={PageNotFound} path="*" />
    </Switch>
  </>
);

export default App;
