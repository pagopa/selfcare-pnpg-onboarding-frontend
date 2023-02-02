import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';
import { AxiosRequestConfig } from 'axios';
import { FunctionComponent, SVGProps } from 'react';
import { API } from './src/utils/constants';

/*
 * Fetch data and router related types
 */
export type ApiEndpointKey = keyof typeof API;

export type Endpoint = {
  endpoint: ApiEndpointKey;
  endpointParams?: any;
};

export type RequestConfig = {
  path: Endpoint;
  config: AxiosRequestConfig;
};

export type RoutesObject = { [key: string]: RouteConfig };

export type RouteConfig = {
  PATH: string;
  LABEL: string;
  EXACT?: boolean;
  SUBROUTES?: RoutesObject;
  COMPONENT?: React.FunctionComponent<any>;
};

export type Image = { src: string; alt: string };
export type RequestOutcome = 'success' | 'error';
export type RequestOutcomeMessage = {
  title: string;
  description: Array<JSX.Element>;
  img?: Image;
  ImgComponent?:
    | FunctionComponent<SVGProps<SVGSVGElement>>
    | ((props: DefaultComponentProps<SvgIconTypeMap>) => JSX.Element);
};
export type RequestOutcomeOptions = { [key in RequestOutcome]: RequestOutcomeMessage };

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

export interface Attribute {
  id: string;
  name: string;
  description: string;
}

export interface Problem {
  type: string;
  status: number;
  title: string;
  detail?: string;
  errors: Array<ProblemError>;
}

export interface ProblemError {
  code: string;
  detail: string;
}

export type Product = {
  id: string;
  title: string;
  parentId?: string;
};

export type BusinessPnpg = { businessName: string; businessTaxId: string };

export type InstitutionsPnPG = {
  businesses: Array<BusinessPnpg>;
  legalTaxId: string;
  requestDateTime: string;
};

export type PnPGInstitutionResource = {
  address: string;
  category: string;
  externalId: string;
  fiscalCode: string;
  geographicTaxonomies: Array<any>; // TODO FixMe
  id: string;
  institutionType: 'GSP' | 'PA' | 'PSP' | 'PT' | 'SCP';
  mailAddress: string;
  name: string;
  origin: string;
  originId: string;
  recipientCode: string;
  status: string;
  userRole: string;
  zipCode: string;
};
