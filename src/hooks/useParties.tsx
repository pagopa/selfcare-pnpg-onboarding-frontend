import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { PnPGInstitutionResource } from '../../types';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { getPnPGInstitutions } from '../services/dashboardService';

export const useParties = (): (() => Promise<Array<PnPGInstitutionResource>>) =>
  useReduxCachedValue(
    'PARTIES',
    getPnPGInstitutions,
    partiesSelectors.selectPartiesList,
    partiesActions.setPartiesList
  );
