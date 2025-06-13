import { useContext } from 'react';
import isEmpty from 'lodash/isEmpty';
import {
  storageTokenOps,
  storageUserOps,
} from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { MOCK_USER } from '../utils/constants';
import { ENV } from '../utils/env';
import { UserContext } from '../lib/context';

export const testToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF9iNjowMjozMzowMzpjYTpmZTo1MzowODoyNjpmMTpjYzpiZTo1ZTowNjplNzowYyJ9.eyJmYW1pbHlfbmFtZSI6IkNhdG9uZSIsImZpc2NhbF9udW1iZXIiOiJDVE5NQ1A4MEEwMUg1MDFNIiwibmFtZSI6Ik1hcmNvIFBvcmNpbyIsInNwaWRfbGV2ZWwiOiJodHRwczovL3d3dy5zcGlkLmdvdi5pdC9TcGlkTDIiLCJmcm9tX2FhIjpmYWxzZSwidWlkIjoiNzFkMWZjMzUtZGViZi00NzYzLTg3OWUtMTkzMjllNzdjYTgzIiwibGV2ZWwiOiJMMiIsImlhdCI6MTc0NzMxMzIyNCwiZXhwIjoxNzQ3MzQ1NjI0LCJhdWQiOiJhcGktcG5wZy5kZXYuc2VsZmNhcmUucGFnb3BhLml0IiwiaXNzIjoiU1BJRCIsImp0aSI6Il9hZGU2MzVjYWYyMzA3M2YxZTBjZiJ9.nN3Yy_qisssa2mwEj_xXhxFFNbZsLQnVEj6gi15c93KJQDJYz3nN8VtGGFFQQ7QTBBVlVM4AyOiIV7NhCWT_HxOi3OUGPPZ9LyaMovqL25vdxrWaBKKGtImVyd_rebJCNrrNeC6cibebINumhBsy4R6ysaLhXdXeSJnzjwGgjnpnqsU8nHfuV27uwZ3le9qA9LJSRxSKfUXzVEoZd4-xK9Bp6mu4-YUw40iF8_fO7XMKjy7ELNty2SwEL9jbBpwVMA1BJOsaM5q7ZEIorsBDbdtKesIvStczqpeSDAycH61f1QSe-Oj0mkfGR_kOeMS1ifANoXZo9Hibvvy4fUtraQ';

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
