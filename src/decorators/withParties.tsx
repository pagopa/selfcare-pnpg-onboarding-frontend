import withRetrievedValue from '@pagopa/selfcare-common-frontend/decorators/withRetrievedValue';
import { InstitutionPnPGResourceArray } from '../api/generated/b4f-dashboard-pnpg/InstitutionPnPGResourceArray';
import { useParties } from '../hooks/useParties';

export type WithPartiesProps = {
  parties: InstitutionPnPGResourceArray;
};

export default function withParties<T extends WithPartiesProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'parties' | 'reload'>> {
  return withRetrievedValue('parties', useParties, WrappedComponent);
}
