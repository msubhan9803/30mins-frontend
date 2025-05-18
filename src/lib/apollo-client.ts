import {ApolloClient, InMemoryCache, split} from '@apollo/client';
import {createUploadLink} from 'apollo-upload-client';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {getMainDefinition} from '@apollo/client/utilities';
import {createClient} from 'graphql-ws';

const uploadLink = createUploadLink({uri: process.env.NEXT_PUBLIC_GRAPHQL_URL});

const wsLink = process.browser
  ? new GraphQLWsLink(
      createClient({
        url: process.env.NEXT_PUBLIC_WEB_SOCKET_URL!,
      })
    )
  : undefined;

const splitLink =
  process.browser && wsLink
    ? split(
        ({query}) => {
          const def = getMainDefinition(query);
          return def.kind === 'OperationDefinition' && def.operation === 'subscription';
        },
        wsLink,
        uploadLink
      )
    : undefined;

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  cache: new InMemoryCache(),
  link: splitLink,
});

export default client;
