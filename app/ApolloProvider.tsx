"use client"
import { ApolloClient } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { createHttpLink } from "@apollo/client/core";
import { ApolloProvider } from "@apollo/client/react";
import {setContext} from "@apollo/client/link/context"
import { getToken } from "./utils/localstorage";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const httpLink = createHttpLink({
    uri: "http://localhost:4000",
  });

  const authLink = setContext(() => {
    const token = getToken()
    return {
      headers:{
        Authorization:token ? `Bearer ${token}` : ''
      }
    }
  })

  const client = new ApolloClient({
    link:authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
