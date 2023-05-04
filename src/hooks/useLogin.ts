import { useContext } from 'react';
import isEmpty from 'lodash/isEmpty';
import { storageTokenOps, storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { MOCK_USER } from '../utils/constants';
import { ENV } from '../utils/env';
import { UserContext } from '../lib/context';

export const testToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF9hZDowYToxMTowNDozMjo4Mjo4MTo3Mjo5OTozNTozODpjNzo5NTo2YzpjNjo2NCJ9.eyJlbWFpbCI6ImRhbnRlLmFsaWdoaWVyaUBkaXZpbmEuY28iLCJmYW1pbHlfbmFtZSI6IkFsaWdoaWVyaSIsImZpc2NhbF9udW1iZXIiOiJMR0hETlQwMFAxNEQ2MTJEIiwibmFtZSI6IkRhbnRlIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6IjkxY2U3NTU3LTlkMzEtNDI3MC1hZmIzLTVlMGM0MmIzMDJmZCIsImxldmVsIjoiTDIiLCJpYXQiOjE2ODI1ODAzOTAsImV4cCI6MTY4MjYxMjc5MCwiYXVkIjoiYXBpLXBucGcuZGV2LnNlbGZjYXJlLnBhZ29wYS5pdCIsImlzcyI6IlNQSUQiLCJqdGkiOiJfMDk0MWNiZDczOWU5MWE5Yzg3ZmIifQ.P9Bzg9nv5aQz1keCioGR_mDnW8rJ43gAm3kdd_aiiT9pgtth18oynYgupADlCqeF-OSeq3YTNIBcWVtMY9-WdjNFwPreEaXYtg7fBww4MZ8QjUGBSWzfuPWYeafBmT8ROz4u82q8G4o4ki6bAqb2Rk2oha4jTkCEvPXzfA-Z2W5bVXunk0HttnFEMppoCSWBUfjbiA5JIccKoo_Yx_mQbC9glY2b1YFds1R-Ii7uTs5CBXBMKAux6cvvzurn2mJ0MjRTTXW8YAEy8-mjK9xE-vhSxAWiVlrYsdp98eTiWDOOdkRwsPCwTYMvlERxWeGyXbc9ZWBjlmoyebiU282BIA';

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
        uid: '0',
        taxCode: 'LGGLGD00A00A000A',
        name: 'loggedName',
        surname: 'loggedSurname',
        email: 'loggedEmail@aa.aa',
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
