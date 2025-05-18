import {useSession} from 'next-auth/react';
import {useQuery} from '@apollo/client';
import DEFAULT_STATE from 'constants/context/initialState';
import queries from 'constants/GraphQL/Organizations/queries';
import {createContext, useState, PropsWithChildren, useEffect} from 'react';

const CollapseDrawerContext = createContext(DEFAULT_STATE.sidebar);
const initialCurrentActiveRouteState = {
  routeName: '',
  childRouteName: '',
  href: '',
  isChild: false,
  isDropdownOpen: false,
};

function CollapseDrawerProvider({children}: PropsWithChildren<unknown>) {
  const [collapse, setCollapse] = useState({
    click: false,
    hover: false,
  });
  const [currentActiveRoute, setCurrentActiveRoute] = useState(initialCurrentActiveRouteState);
  const [isOrganizationMember, setIsOrganizationMember] = useState(false);
  const [hasOrgEditPermission, setHasOrgEditPermission] = useState(false);
  const {data: session} = useSession();
  const {data: organizations} = useQuery(queries.getOrganizationManagementDetails, {
    variables: {
      token: session?.accessToken,
    },
    skip: !session?.accessToken,
    context: {
      headers: {
        Authorization: session?.accessToken,
      },
    },
  });

  useEffect(() => {
    const currentRouteState = JSON.parse(localStorage.getItem('currentRouteState') as any);
    if (currentRouteState) {
      setCurrentActiveRoute(currentRouteState as any);
    }
  }, []);

  const handleToggleCollapse = () => {
    setCollapse({...collapse, click: !collapse.click});
  };

  const handleHoverEnter = () => {
    if (collapse.click) {
      setCollapse({...collapse, hover: true});
    }
  };

  const handleHoverLeave = () => {
    setCollapse({...collapse, hover: false});
  };

  const handleActiveRouteToggle = (route: any) => {
    setCurrentActiveRoute(route);
    localStorage.setItem('currentRouteState', JSON.stringify(route));
  };

  const handleClearRouteDropdown = () => {
    setCurrentActiveRoute(initialCurrentActiveRouteState);
    localStorage.setItem('currentRouteState', JSON.stringify(initialCurrentActiveRouteState));
  };

  const handleToggleIsOrganizationMember = val => {
    setIsOrganizationMember(val);
  };

  useEffect(() => {
    const membershipData = organizations?.getOrganizationManagementDetails?.membershipData;
    if (Array.isArray(membershipData)) {
      const rolesList = membershipData.map(elem => elem.role);
      if (rolesList.includes('admin') || rolesList.includes('owner')) {
        setHasOrgEditPermission(true);
      }
    }
    handleToggleIsOrganizationMember(Array.isArray(membershipData));
  }, [organizations]);

  return (
    <CollapseDrawerContext.Provider
      value={{
        isCollapse: collapse.click && !collapse.hover,
        collapseClick: collapse.click,
        collapseHover: collapse.hover,
        currentActiveRoute: currentActiveRoute,
        isOrganizationMember: isOrganizationMember,
        hasOrgEditPermission: hasOrgEditPermission,
        onToggleCollapse: handleToggleCollapse,
        onHoverEnter: handleHoverEnter,
        onHoverLeave: handleHoverLeave,
        handleClearRouteDropdown: handleClearRouteDropdown,
        handleActiveRouteToggle: handleActiveRouteToggle,
        handleToggleIsOrganizationMember: handleToggleIsOrganizationMember,
      }}
    >
      {children}
    </CollapseDrawerContext.Provider>
  );
}

export {CollapseDrawerProvider, CollapseDrawerContext};
