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
