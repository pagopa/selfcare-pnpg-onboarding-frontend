import withRetrievedValue from '@pagopa/selfcare-common-frontend/decorators/withRetrievedValue';
import { PnPGInstitutionResource } from '../../types';
import { useParties } from '../hooks/useParties';

export type WithPartiesProps = {
  parties: Array<PnPGInstitutionResource>;
};

export default function withParties<T extends WithPartiesProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'parties' | 'reload'>> {
  return withRetrievedValue('parties', useParties, WrappedComponent);
}
