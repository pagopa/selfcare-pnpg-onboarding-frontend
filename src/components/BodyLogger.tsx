import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/system';
import { Footer, Header } from '@pagopa/selfcare-common-frontend';
import { logAction } from '../lib/action-log';
import { ENV } from '../utils/env';
import { partiesSelectors } from '../redux/slices/partiesSlice';
import { useAppSelector } from '../redux/hooks';
import { loggedUser } from '../api/__mocks__/DashboardPnPgApiClient';
import { BusinessPnpg } from '../types';
import { HeaderContext } from './../lib/context';
import { Main } from './Main';
import { useHistoryState } from './useHistoryState';

function BodyLogger() {
  // const { user } = useContext(UserContext);
  const location = useLocation();
  const parties = useAppSelector(partiesSelectors.selectPartiesList);
  const [subHeaderVisible, setSubHeaderVisible] = useState<boolean>(false);
  const [selectedInstitution, _setSelectedInstitution, setSelectedInstitutionHistory] =
    useHistoryState<BusinessPnpg | undefined>('selected_institution', undefined);
  const [onExit, setOnExit] = useState<((exitAction: () => void) => void) | undefined>();
  const [enableLogin, setEnableLogin] = useState<boolean>(true);

  const selectedInstitutionPnPg = history.state;

  useEffect(() => {
    logAction('Route change', location);
    setSubHeaderVisible(location.pathname === '/dashboardpg');
  }, [location]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <HeaderContext.Provider
        value={{
          subHeaderVisible,
          setSubHeaderVisible,
          onExit,
          setOnExit,
          enableLogin,
          setEnableLogin,
        }}
      >
        <Header
          withSecondHeader={subHeaderVisible}
          onExit={onExit}
          assistanceEmail={ENV.ASSISTANCE.ENABLE ? ENV.ASSISTANCE.EMAIL : undefined}
          enableLogin={enableLogin}
          loggedUser={
            loggedUser
              ? {
                  id: loggedUser.uid,
                  name: loggedUser.name,
                  surname: loggedUser.surname,
                  email: loggedUser.email,
                }
              : false
          }
          partyList={parties?.map((p) => ({
            logoUrl: '', // TODO
            id: p.externalId ?? '',
            name: p.name ?? '',
            productRole: p.fiscalCode ?? '',
          }))}
          selectedPartyId={
            selectedInstitution?.businessTaxId ?? selectedInstitutionPnPg?.state.businessTaxId
          }
          productsList={[
            {
              id: 'prod-pn-pg',
              title: 'La tua azienda',
              linkType: 'external',
              productUrl: '',
            },
          ]}
          selectedProductId={'prod-pn-pg'}
          onSelectedParty={(selected) => {
            setSelectedInstitutionHistory({
              ...selected,
              businessName: selected.name ?? '',
              businessTaxId: selected?.id ?? '',
            });
          }}
        />
        <Main />
        <Box>
          <Footer loggedUser={!!loggedUser} onExit={onExit} />
        </Box>
      </HeaderContext.Provider>
    </Box>
  );
}
export default BodyLogger;
