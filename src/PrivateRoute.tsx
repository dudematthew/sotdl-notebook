import React, { ReactNode, useContext } from "react";
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom";

import { AuthContext } from "./AuthContext";

export const PrivateRoute: React.FC<RouteProps & { children: ReactNode }> = ({ children, ...rest }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={() => {
        if (auth?.user) {
          return children;
        }
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location.pathname },
            }}
          />
        );
      }}
    />
  );
};
