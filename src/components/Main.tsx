import { Box } from '@mui/material';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router';
import { ROUTES } from '../utils/constants';

export function Main() {
  const location = useLocation();
  const productId = location.pathname.replace(/^\/prod-pn-pnpg\/([^/]+)\/?.*/, '$1');
  return (
    <Box component="main" my="auto" display="flex">
      <Switch>
        {Object.values(ROUTES).map(({ PATH, EXACT, COMPONENT: Component }, i) => (
          <Route path={PATH} exact={EXACT} key={i}>
            {Component && <Component productId={productId} />}
          </Route>
        ))}
        <Route path="*">
          <Redirect to={ROUTES.ONBOARDING_PNPG_ROOT.PATH} />
        </Route>
        <Route path="/dashboardpg">
          <Redirect to={ROUTES.DASHBOARD.PATH} />
        </Route>
      </Switch>
    </Box>
  );
}
