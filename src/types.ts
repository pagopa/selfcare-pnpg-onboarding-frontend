import { GeographicTaxonomyResource } from './api/generated/b4f-dashboard-pnpg/GeographicTaxonomyResource';
import { InstitutionPnPGResource } from './api/generated/b4f-dashboard-pnpg/InstitutionPnPGResource';
import { ENV } from './utils/env';

export type RoutesObject = { [key: string]: RouteConfig };

export type RouteConfig = {
  PATH: string;
  LABEL: string;
  EXACT?: boolean;
  SUBROUTES?: RoutesObject;
  COMPONENT?: React.FunctionComponent<any>;
};

/*
 * Onboarding component
 */
export type StepperStepComponentProps = {
  product?: Product | null;
  forward?: any;
  back?: VoidFunction;
  updateFormData?: React.Dispatch<React.SetStateAction<any>>;
};

export type StepperStep = {
  label: string;
  Component: React.FunctionComponent<StepperStepComponentProps>;
};

export type User = {
  uid: string;
  taxCode: string;
  name: string;
  surname: string;
  email: string;
};

export type AlertDialogActions = {
  setDialogTitle: (t: string) => void;
  setDialogDescription: (t: string) => void;
  setShowDialog: (t: boolean) => void;
  handleCloseDialog?: (t: any) => void;
};

export type Product = {
  id: string;
  title: string;
};

export type PartyPnpg = {
  externalId: string;
  id: string;
  fiscalCode: string;
  name: string;
  status: string;
  urlLogo?: string;
  address?: string;
  category?: string;
  geographicTaxonomies?: Array<GeographicTaxonomyResource>;
  institutionType?: string;
  mailAddress?: string;
  origin?: string;
  originId?: string;
  recipientCode?: string;
  userRole?: string;
  zipCode?: string;
};

export type BusinessPnpg = { businessName: string; businessTaxId: string };

export type InstitutionsPnpg = {
  businesses: Array<BusinessPnpg>;
  legalTaxId: string;
  requestDateTime: string;
};

export type PnpgInstitutionLegalAddressResource = {
  externalInstitutionId: string;
  address: string;
  zipCode: string;
};

const buildUrlLogo = (partyId: string) =>
  `${ENV.URL_INSTITUTION_LOGO.PREFIX}${partyId}${ENV.URL_INSTITUTION_LOGO.SUFFIX}`;

export const institutionPnPGResource2PartyPnpg = (
  institutionResourcePnpg: InstitutionPnPGResource
): PartyPnpg => {
  const urlLogo = institutionResourcePnpg.id && buildUrlLogo(institutionResourcePnpg.id);
  return {
    address: institutionResourcePnpg.address,
    externalId: institutionResourcePnpg.externalId,
    fiscalCode: institutionResourcePnpg.fiscalCode,
    id: institutionResourcePnpg.id,
    name: institutionResourcePnpg.name,
    status: institutionResourcePnpg.status,
    urlLogo,
    category: institutionResourcePnpg.category,
    geographicTaxonomies:
      institutionResourcePnpg.geographicTaxonomies as Array<GeographicTaxonomyResource>,
    institutionType: institutionResourcePnpg.institutionType,
    mailAddress: institutionResourcePnpg.mailAddress,
    origin: institutionResourcePnpg.origin,
    originId: institutionResourcePnpg.originId,
    recipientCode: institutionResourcePnpg.recipientCode,
    userRole: institutionResourcePnpg.userRole,
    zipCode: institutionResourcePnpg.zipCode,
  };
};
