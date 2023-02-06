import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/system';
import { Footer, Header } from '@pagopa/selfcare-common-frontend';
import { logAction } from '../lib/action-log';
import { ENV } from '../utils/env';
import { HeaderContext, UserContext } from './../lib/context';
import { Main } from './Main';

export function BodyLogger() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [subHeaderVisible, setSubHeaderVisible] = useState<boolean>(false);
  const [onExit, setOnExit] = useState<((exitAction: () => void) => void) | undefined>();
  const [enableLogin, setEnableLogin] = useState<boolean>(true);

  const selectedInstitution = history.state;

  const product = {
    id: 'prod-pn-pg',
    title: 'La tua azienda',
  };

  useEffect(() => {
    logAction('Route change', location);
    if (location.pathname === '/dashboardpg') {
      setSubHeaderVisible(true);
    }
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
            user
              ? {
                  id: user ? user.uid : '',
                  name: user?.name,
                  surname: user?.surname,
                  email: user?.email,
                }
              : false
          }
          selectedProductId={product.id}
          selectedPartyId={selectedInstitution?.state.businessTaxId}
          partyList={[
            {
              logoUrl: '',
              id: selectedInstitution?.state ? selectedInstitution.state.businessTaxId : '',
              name: selectedInstitution?.state ? selectedInstitution.state.businessName : '',
              productRole: selectedInstitution?.state
                ? selectedInstitution.state.businessTaxId
                : '',
            },
          ]}
          productsList={[
            {
              id: product.id,
              title: product.title,
              productUrl: '',
              linkType: 'external',
            },
          ]}
        />
        <Main />
        <Box>
          <Footer loggedUser={!!user} onExit={onExit} />
        </Box>
      </HeaderContext.Provider>
    </Box>
  );
}
