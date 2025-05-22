export interface SubRoute {
    path: string;
    translationKey: string; // labels ichidagi key bo'lishi kerak
  }
  
  export interface Route {
    path: RoutePathEnum;
    translationKey: 'services' | 'checkups' | 'analysis' | 'partners' | 'clinic' | 'contacts';
    hasSubmenu?: boolean;
    submenuItems?: SubRoute[];
  }
  
  export enum RoutePathEnum {
    SERVICES = '/services',
    CHECKUPS = '/checkups',
    ANALYSIS = '/analysis',
    PARTNERS = '/partners',
    CLINIC = '/clinic',
    CONTACTS = '/contacts',
  }
  
  export const routes: Route[] = [
    {
      path: RoutePathEnum.SERVICES,
      translationKey: 'services',
      hasSubmenu: false,
      submenuItems: [
        {
          path: '/services',
          translationKey: 'services'
        },
        {
          path: '/services/dietolog',
          translationKey: 'dietolog' 
        }
      ]
    },
    {
      path: RoutePathEnum.CHECKUPS,
      translationKey: 'checkups'
    },
    {
      path: RoutePathEnum.ANALYSIS,
      translationKey: 'analysis'
    },
    {
      path: RoutePathEnum.PARTNERS,
      translationKey: 'partners'
    },
    {
      path: RoutePathEnum.CLINIC,
      translationKey: 'clinic',
      hasSubmenu: true,
      submenuItems: [
        {
          path: '/clinic',
          translationKey: 'clinic'
        },
        {
          path: '/clinic/doctors',
          translationKey: 'doctors'
        }
      ]
    },
    {
      path: RoutePathEnum.CONTACTS,
      translationKey: 'contacts'
    },
  ];
  