/* eslint-disable react-hooks/rules-of-hooks */
import {useQuery} from '@apollo/client';
import {signOut, useSession} from 'next-auth/react';
import {createContext, PropsWithChildren, useEffect, useState} from 'react';

import ProductIDs from 'constants/stripeProductIDs';
import queries from 'constants/GraphQL/User/queries';
import Productqueries from 'constants/GraphQL/Products/queries';
import exQueries from 'constants/GraphQL/ActiveExtension/queries';
import intQueries from 'constants/GraphQL/Integrations/queries';
import orgQueries from 'constants/GraphQL/Organizations/queries';

import removeDuplicateExtensions from 'utils/removeDuplicateExtensions';

export type BankDetails = {
  bankName?: string;
  bankAddress?: string;
  accountNumber?: string;
  typeAccount?: string;
  categoryAccount?: string;
  currencyAccount?: string;
  SWIFTBIC?: string;
};
export type WireDetails = {
  nameOnBank?: string;
  phoneOfBank?: string;
  addressOfBank?: string;
  country?: string;
};

type User = {
  userID: string | undefined;
  accountType: string | undefined;
  isMarketer: boolean | undefined;
  username: string | undefined;
  welcomeComplete: boolean | undefined;
  timezone: string | undefined;
  email: string | undefined;
  workingHours: any | undefined;
  escrowAccount: boolean | undefined;
  directAccount: boolean | undefined;
  isStripeConnected: string | undefined;
  avatar: string | undefined;
  name: string | undefined;
  direct: [string] | undefined;
  escrow: [string] | undefined;
  hasZoomExtention: boolean | undefined;
  allowedConferenceTypes: Array<string> | undefined;
  verifiedAccount: boolean | undefined;
  bankDetails: BankDetails | undefined;
  wireDetails: WireDetails | undefined;
  country: string | undefined;
  zipCode: string | undefined;
  paypalId: string | undefined;
  payoneerId: string | undefined;
  upiId: string | undefined;
};

export const UserContext = createContext<{
  user: User | undefined;
  items: Array<{
    productQttId: any;
    productId: any;
    quantity: any;
    price: any;
  }>;
  hasOrgs: boolean | undefined;
  hasOrgServiceCats: boolean | undefined;
  hasCalendar: string;
  hasOrgExtention: boolean | undefined;
  hasBWExtention: boolean | undefined;
  unreadMessageCount?: number;
  pendingInvites: Array<any>;
  zoomEmails: Array<any>;
  activeExtensions: Array<any>;
  refetchUser: () => void;
  refItems: () => void;
  setUser: (u: User) => void;
  setHasOrgs: (boolean) => void;
  setHasOrgServiceCats: (u: boolean) => void;
  setHasCalendar: (u: string) => void;
  setHasOrgExtention: (u: boolean) => void;
  setHasBWExtention: (u: boolean) => void;
  setUnreadMessageCount: (count: number) => void;
  setpendingInvites: (count: Array<any>) => void;
}>({
  user: undefined,
  hasOrgs: undefined,
  items: [],
  hasOrgServiceCats: undefined,
  hasCalendar: '',
  hasOrgExtention: undefined,
  hasBWExtention: undefined,
  unreadMessageCount: undefined,
  zoomEmails: [],
  pendingInvites: [],
  activeExtensions: [],
  refetchUser: () => {},
  refItems: () => {},
  setUser: () => {},
  setHasOrgs: () => undefined,
  setHasOrgServiceCats: () => undefined,
  setHasCalendar: () => undefined,
  setpendingInvites: () => undefined,
  setUnreadMessageCount: () => undefined,
  setHasOrgExtention: () => undefined,
  setHasBWExtention: () => undefined,
});

const UserCtxProvider = ({children}: PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [hasOrgs, setHasOrgs] = useState<boolean | undefined>(undefined);
  const [hasOrgServiceCats, setHasOrgServiceCats] = useState<boolean | undefined>(undefined);
  const [hasCalendar, setHasCalendar] = useState<string>('');
  const [hasOrgExtention, setHasOrgExtention] = useState<boolean | undefined>(undefined);
  const [unreadMessageCount, setUnreadMessageCount] = useState<number | undefined>(undefined);
  const [pendingInvites, setpendingInvites] = useState<any>([]);
  const [zoomEmails, setZoomEmails] = useState<any>([]);
  const [hasBWExtention, setHasBWExtention] = useState<boolean | undefined>(undefined);
  const [activeExtensions, setActiveExtensions] = useState<any>([]);

  const {data: session} = useSession();

  const {data: userData, refetch: refetchUser} = useQuery(queries.getUserById, {
    variables: {token: session?.accessToken},
    skip: session ? false : true,
  });

  const {
    data: {getCountItemsAndSubtotal: {items}} = {getCountItemsAndSubtotal: {items: []}},
    refetch: refItems,
  } = useQuery(Productqueries.getCountItemsAndSubtotal, {
    variables: {token: session?.accessToken},
    skip: !session?.accessToken,
  });

  const {data: extentionsData} = useQuery(exQueries.getActiveExtensions, {
    variables: {token: session?.accessToken},
    skip: session ? false : true,
  });

  const {data: integrationsData, loading: intLoading} = useQuery(intQueries.getCredentialsByToken, {
    variables: {token: session?.accessToken},
    skip: session ? false : true,
  });

  const {data: organizationsData} = useQuery(orgQueries.getOrganizationsByUserId, {
    variables: {token: session?.accessToken},
    skip: session ? false : true,
  });

  useEffect(() => {
    if (integrationsData) {
      setZoomEmails(
        integrationsData?.getCredentialsByToken?.zoomCredentials?.map(
          credential => credential.userEmail
        )
      );
    }
  }, [integrationsData]);

  useEffect(() => {
    if (
      extentionsData?.getActiveExtensions.activeExtensionData &&
      extentionsData?.getActiveExtensions.activeExtensionData.length > 0
    ) {
      const extentions = extentionsData?.getActiveExtensions.activeExtensionData;

      const extensionsList = removeDuplicateExtensions(extentions);
      setActiveExtensions(extensionsList);

      const orgExt = extentions.find(e =>
        [ProductIDs.EXTENSIONS.ORGANIZATIONS, ProductIDs.EXTENSIONS.ORGANIZATIONS_ANNUAL].includes(
          e.extensionProductId
        )
      );
      if (!orgExt) {
        setHasOrgExtention(false);
      } else {
        setHasOrgExtention(true);
      }
      const BWExt = extentions.find(
        e => e.extensionProductId === ProductIDs.EXTENSIONS.WHITE_BLACK_LIST
      );
      if (!BWExt) {
        setHasBWExtention(false);
      } else {
        setHasBWExtention(true);
      }
    }
  }, [extentionsData]);

  useEffect(() => {
    if (
      organizationsData?.getOrganizationsByUserId.membershipData &&
      organizationsData.getOrganizationsByUserId.membershipData.length > 0
    ) {
      setHasOrgs(true);
      const orgs = organizationsData.getOrganizationsByUserId.membershipData;
      orgs.forEach(org => {
        if (org?.organizationId?.serviceCategories?.length) {
          setHasOrgServiceCats(true);
        }
      });
    }
  }, [organizationsData]);

  useEffect(() => {
    if (!intLoading) {
      if (
        integrationsData?.getCredentialsByToken.googleCredentials ||
        integrationsData?.getCredentialsByToken.officeCredentials
      ) {
        setHasCalendar('yes');
      } else {
        setHasCalendar('no');
      }
    }
    if (intLoading) {
      setHasCalendar('pending');
    }
  }, [integrationsData, intLoading]);

  useEffect(() => {
    if (userData?.getUserById?.response?.status === 404) {
      signOut();
      return;
    }

    if (userData || userData?.getUserById?.response?.status === 200) {
      setUser({
        ...user,
        userID: userData.getUserById.userData._id,
        accountType: userData.getUserById.userData.accountDetails.accountType,
        isMarketer: userData.getUserById.userData.isMarketer,
        welcomeComplete: userData.getUserById.userData.welcomeComplete,
        username: userData.getUserById.userData.accountDetails.username,
        avatar: userData.getUserById.userData.accountDetails.avatar,
        name: userData.getUserById.userData.personalDetails.name,
        paypalId: userData.getUserById.userData?.accountDetails?.paypalId,
        payoneerId: userData.getUserById.userData?.accountDetails?.payoneerId,
        upiId: userData.getUserById.userData?.accountDetails?.upiId,
        direct: userData.getUserById.userData?.accountDetails?.paymentAccounts?.direct,
        escrow: userData.getUserById.userData?.accountDetails?.paymentAccounts?.escrow,
        country: userData.getUserById?.userData?.locationDetails?.country,
        timezone: userData.getUserById.userData.locationDetails?.timezone,

        bankDetails: userData.getUserById.userData.bankDetails,
        wireDetails: userData.getUserById.userData.wireDetails,

        hasZoomExtention: userData.getUserById.userData.accountDetails?.activeExtensions.includes(
          ProductIDs.EXTENSIONS.ZOOM
        ),
        email: userData.getUserById.userData.accountDetails.email,
        workingHours: userData.getUserById.userData.workingHours,
        zipCode: userData.getUserById.userData.locationDetails.zipCode,
        allowedConferenceTypes: userData.getUserById.userData.accountDetails.allowedConferenceTypes,
        verifiedAccount: userData.getUserById.userData.accountDetails.verifiedAccount,
        isStripeConnected: userData.getUserById.userData.accountDetails.stripeAccountId,
        escrowAccount:
          userData.getUserById.userData.accountDetails.paymentAccounts.escrow.length > 0 &&
          !userData.getUserById.userData.accountDetails.paymentAccounts.escrow.includes('none'),
        directAccount: !!(
          userData.getUserById.userData.accountDetails.paymentAccounts.direct.length > 0 &&
          userData.getUserById?.userData?.accountDetails?.paymentAccounts?.direct.some(
            account => !!account
          )
        ),
      });
    }
  }, [userData]);

  return (
    <UserContext.Provider
      value={{
        user,
        items,
        hasOrgs,
        hasOrgServiceCats,
        hasCalendar,
        hasOrgExtention,
        unreadMessageCount,
        hasBWExtention,
        pendingInvites,
        zoomEmails,
        refItems,
        activeExtensions,
        refetchUser,
        setpendingInvites,
        setUser,
        setHasOrgs,
        setHasOrgServiceCats,
        setHasCalendar,
        setHasOrgExtention,
        setUnreadMessageCount,
        setHasBWExtention,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserCtxProvider;
