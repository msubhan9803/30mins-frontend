import extensionQueries from 'constants/GraphQL/ActiveExtension/queries';
import ProductIDs from 'constants/stripeProductIDs';
import graphqlRequestHandler from './graphqlRequestHandler';

export enum EmailFilters {
  whiteEmail = 'WHITE_EMAIL',
  blackEmail = 'BLACK_EMAIL',
  whiteDomain = 'WHITE_DOMAIN',
  blackDomain = 'BLACK_DOMAIN',
}

export default async function checkEmailFilter({
  accessToken,
  bookerEmail,
  domainFilterB,
  emailFilterB,
  domainFilterW,
  emailFilterW,
}: {
  bookerEmail: string;
  accessToken: any;
  domainFilterB: Array<String>;
  emailFilterB: Array<String>;
  domainFilterW: Array<String>;
  emailFilterW: Array<String>;
}) {
  try {
    if (
      emailFilterW?.length ||
      domainFilterW?.length ||
      emailFilterB?.length ||
      domainFilterB?.length
    ) {
      const {data: response} = await graphqlRequestHandler(
        extensionQueries.checkExtensionStatus,
        {productId: ProductIDs.EXTENSIONS.WHITE_BLACK_LIST},
        accessToken
      );

      if (response.data.checkExtensionStatus.isActive) {
        const emailDomain = bookerEmail.split('@')[1];

        if (emailFilterB?.length || domainFilterB.length) {
          const includesEmailB = emailFilterB?.includes(bookerEmail);
          const includesDomainB = domainFilterB?.includes(emailDomain);

          if (includesEmailB || includesDomainB) {
            return !includesEmailB ? EmailFilters.blackEmail : EmailFilters.blackDomain;
          }
        }

        if (emailFilterW.length || domainFilterW.length) {
          const includesEmailW = emailFilterW?.includes(bookerEmail);
          const includesDomainW = domainFilterW?.includes(emailDomain);

          if (!includesEmailW && !includesDomainW) {
            return !includesEmailW ? EmailFilters.whiteEmail : EmailFilters.whiteDomain;
          }
        }
      }
    }
  } catch (er) {
    console.log(er);
  }

  return true;
}
