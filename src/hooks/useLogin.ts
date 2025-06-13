import { useContext } from 'react';
import isEmpty from 'lodash/isEmpty';
import {
  storageTokenOps,
  storageUserOps,
} from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { MOCK_USER } from '../utils/constants';
import { ENV } from '../utils/env';
import { UserContext } from '../lib/context';

export const testToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF9iNjowMjozMzowMzpjYTpmZTo1MzowODoyNjpmMTpjYzpiZTo1ZTowNjplNzowYyJ9.eyJmYW1pbHlfbmFtZSI6IkNhdG9uZSIsImZpc2NhbF9udW1iZXIiOiJDVE5NQ1A4MEEwMUg1MDFNIiwibmFtZSI6Ik1hcmNvIFBvcmNpbyIsInNwaWRfbGV2ZWwiOiJodHRwczovL3d3dy5zcGlkLmdvdi5pdC9TcGlkTDIiLCJmcm9tX2FhIjpmYWxzZSwidWlkIjoiNzFkMWZjMzUtZGViZi00NzYzLTg3OWUtMTkzMjllNzdjYTgzIiwibGV2ZWwiOiJMMiIsImlhdCI6MTc0OTgwNzQ0MywiZXhwIjoxNzQ5ODM5ODQzLCJhdWQiOiJhcGktcG5wZy5kZXYuc2VsZmNhcmUucGFnb3BhLml0IiwiaXNzIjoiU1BJRCIsImp0aSI6Il8yYTUxOTQ2MWIzMDQ5YTBmOGNkOCJ9.JS1_TYtN0nrD-kypTLmBZJ1MU4ZaF3gwMOla7zJyoWi4Glg3s89cTLDkK4SWiL7YXrf8s_8etfDOt46ZQ3_MXY9kdv0km0wfBlmxhp01frb8HmF-AXp1gMsLFCNNDqSurKOrRWfLirzKSNzWhCcNAwv_G9EudIw_F_Lxp9m2KnqHaWzCAhoEM3memJ6z7XMomBoPvy1A-uVq2Droh3OpUApgQ2_8ew7P2Ud-Jpm3W1JrWiU0oxnfStqYNn2PXEwMTg5hZM_AlLorHTnVdsxvyJ_P6ZWnpV0K8LQr3vX_Y2zBMbKz0sG3eJ1aVJVwUeP0qL8SS2rp0xnGDkWXHdEGOg';

export const useLogin = () => {
  const { setUser } = useContext(UserContext);

  // This happens when the user does a hard refresh when logged in
  // Instead of losing the user, we attempt at logging it back in
  // with the credentials stored in the sessionStorage
  // WARNING: this is not secure and will ultimately be rewritten
  // See PIN-403
  const attemptSilentLogin = async () => {
    if (MOCK_USER) {
      setUser({
        uid: '71d1fc35-debf-4763-879e-19329e77ca83',
        taxCode: 'CTNMCP80A01H501M',
        name: 'Marco Porcio',
        surname: 'Catone'
      });
      storageTokenOps.write(testToken);
      return;
    }

    const sessionStorageUser = storageUserOps.read();

    // If there are no credentials, it is impossible to get the user, so
    if (isEmpty(sessionStorageUser)) {
      // Remove any partial data that might have remained, just for safety
      storageUserOps.delete();
      const onSuccessEncoded = encodeURIComponent(location.pathname + location.search);
      // Go to the login view
      window.location.assign(ENV.URL_FE.LOGIN + '?onSuccess=' + onSuccessEncoded);
      // This return is necessary
      return;
    }

    // Otherwise, set the user to the one stored in the storage
    setUser(sessionStorageUser);
  };

  return { attemptSilentLogin };
};
