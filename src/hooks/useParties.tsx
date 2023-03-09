import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { partiesActions, partiesSelectors } from '../redux/slices/partiesSlice';
import { getPnPGInstitutions } from '../services/dashboardService';
import { PartyPnpg } from '../types';

export const useParties = (): (() => Promise<Array<PartyPnpg>>) =>
  useReduxCachedValue(
    'PARTIES',
    getPnPGInstitutions,
    partiesSelectors.selectPartiesList,
    partiesActions.setPartiesList
  );
