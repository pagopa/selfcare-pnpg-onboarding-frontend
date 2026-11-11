import { Box } from '@mui/material';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { ROUTES } from '../routes';

export function Main() {
  const location = useLocation();
  const productId = location.pathname.replace(/^\/prod-pn-pnpg\/([^/]+)\/?.*/, '$1');
  return (
    <Box component="main" my="auto" display="flex">
      <Routes>
        {Object.values(ROUTES).map(({ PATH, COMPONENT: Component }) => (
          <Route
            path={PATH}
            key={PATH}
            element={Component && <Component productId={productId} />}
          />
        ))}
        <Route path="*" element={<Navigate replace to={ROUTES.ONBOARDING.PATH} />} />
      </Routes>
    </Box>
  );
}
