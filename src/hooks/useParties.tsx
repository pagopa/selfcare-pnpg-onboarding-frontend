import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { InstitutionPnPGResourceArray } from '../api/generated/b4f-dashboard-pnpg/InstitutionPnPGResourceArray';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { getPnPGInstitutions } from '../services/dashboardService';

export const useParties = (): (() => Promise<InstitutionPnPGResourceArray>) =>
  useReduxCachedValue(
    'PARTIES',
    getPnPGInstitutions,
    partiesSelectors.selectPartiesList,
    partiesActions.setPartiesList
  );
