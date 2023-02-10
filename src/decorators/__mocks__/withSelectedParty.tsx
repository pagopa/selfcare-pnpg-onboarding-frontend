import { useEffect } from 'react';
import { mockedPnPGInstitutionsResource } from '../../api/__mocks__/DashboardPnPgApiClient';
import { useAppDispatch } from '../../redux/hooks';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { RootState } from '../../redux/store';

export const verifyMockExecution = (state: RootState) => {
  expect(state.parties.selected).toMatchObject(mockedPnPGInstitutionsResource[0]);
};

export default (WrappedComponent: React.ComponentType<any>) => (props: any) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(partiesActions.setPartySelected(mockedPnPGInstitutionsResource[0]));
  }, []);
  return <WrappedComponent {...props} />;
};
