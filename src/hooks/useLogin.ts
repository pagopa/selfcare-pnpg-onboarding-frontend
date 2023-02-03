import { useContext } from 'react';
import isEmpty from 'lodash/isEmpty';
import { storageTokenOps, storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { MOCK_USER } from '../utils/constants';
import { ENV } from '../utils/env';
import { UserContext } from '../lib/context';

const testToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF9kZjplNjoxOTplYToxZTpjZTplNjo3Yjo3MDo0MjoyYzphMjpjZDo4Yjo1MjowYiJ9.eyJlbWFpbCI6ImQuZGVsbGF2YWxsZUB0ZXN0Lml0IiwiZmFtaWx5X25hbWUiOiJEZWxsYSBWYWxsZSIsImZpc2NhbF9udW1iZXIiOiJETExER0k1M1QzMEkzMjRFIiwibmFtZSI6IkRpZWdvIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6ImQwYWFjYzYxLWU2YzgtNDcxMy05MjdlLTY0MThmMDFiMTMwYiIsImxldmVsIjoiTDIiLCJpYXQiOjE2NDAyNTU2ODMsImF1ZCI6ImFwaS5kZXYuc2VsZmNhcmUucGFnb3BhLml0IiwiaXNzIjoiU1BJRCIsImp0aSI6IjAxRlFLRFBaMTVHVDRTVENRQUU1RVhCVlZNIn0.JAZDi2oIwZC-jqTATFCbDIP0EDgVmeAJvz7rbKX3FhdLP-hTGAicF-KYNj1p69h2B8x0tlivZmph2OWZWlJ7O-UkGjFW-koBm2TYh8hllm6A42Hv1XAeiAo657j-kBLpuVBTwHpk9I93xRBgmacqMLQwrbNaW6oPyn2eA4mY5nyDF9s0RHFAo9VaZyH1gZSnGm33CbZ2sFblfnSY4FopbUed1Fiedu-AthdlpWBPQAYfO3Km1Lkv-S4csk34SG3mzY8MqDf9Fv94XHoGsIBGETh2xqnD7OGKwqbIuMVQjtZchwsuywuOVqwc1MnH7xjxg70B5WZ8cqBLPTBLFdoDCQ';

/* Token for test the redirect to BO in local
  const testToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF84Njo3NDoxZTozNTphZTphNjpkODo0YjpkYzplOTpmYzo4ZTphMDozNTo2ODpiNSJ9.eyJlbWFpbCI6ImZ1cmlvdml0YWxlQG1hcnRpbm8uaXQiLCJmYW1pbHlfbmFtZSI6IlNhcnRvcmkiLCJmaXNjYWxfbnVtYmVyIjoiU1JUTkxNMDlUMDZHNjM1UyIsIm5hbWUiOiJBbnNlbG1vIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6IjUwOTZlNGM2LTI1YTEtNDVkNS05YmRmLTJmYjk3NGE3YzFjOCIsImxldmVsIjoiTDIiLCJpYXQiOjE2NzU0MTcxMTYsImV4cCI6MTY3NTQ0OTUxNiwiYXVkIjoiYXBpLmRldi5zZWxmY2FyZS5wYWdvcGEuaXQiLCJpc3MiOiJTUElEIiwianRpIjoiMDFHUkJBOFFKMDdKN0U3RDIySFo3NFo0TTYifQ.fZJ4b7Au6oRjxd9WqivcWeVz8KO2IKx6rDTZNNyEcXQ6zKuJDz27CWBwJ635_3WlhbYynPVXlvp4FrDQEGch1eeEfmkSCyKVFd38BlUBRYeuPYL-g79jzu_fdVOj6TzVF9y1cumC_3Z3wagxcryjEtzpD-0qPVZrGyrBAyGiM6qc6PxzY49kMYefz8l17n59GDUf72xHAWQPRXqKomgJTeTd_-dV_5h_R7PfrocJgg6InywYl87dr_c7G7Neg4-zIHa74rijh7nuTVNgdUzitJlZLlLoOHZG93yFtQeGzXdPbX6CvsP2lqCCTsXs5JSgwNofZ3NilDTFwIxd1lLaBA';
*/

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
