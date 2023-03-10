import { useEffect, useState } from 'react';
import SessionModal from '@pagopa/selfcare-common-frontend/components/SessionModal';
import { useTranslation } from 'react-i18next';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { User } from './types';
import BodyLogger from './components/BodyLogger';
import { UserContext } from './lib/context';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [requiredLogin, setRequiredLogin] = useState(false);
  const { t } = useTranslation();

  // TODO This will be removed when the login service of PN is available
  useEffect(() => {
    storageTokenOps.write(
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imp3dF9kZjplNjoxOTplYToxZTpjZTplNjo3Yjo3MDo0MjoyYzphMjpjZDo4Yjo1MjowYiJ9.eyJlbWFpbCI6ImQuZGVsbGF2YWxsZUB0ZXN0Lml0IiwiZmFtaWx5X25hbWUiOiJEZWxsYSBWYWxsZSIsImZpc2NhbF9udW1iZXIiOiJETExER0k1M1QzMEkzMjRFIiwibmFtZSI6IkRpZWdvIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6IjM5MzQ1MDcyLWU0YmYtNDYwOS04MmVhLTg4ZDE5NDUyNTM2YiIsImxldmVsIjoiTDIiLCJpYXQiOjE2NDAyNTU2ODMsImFwaSI6InBucGciLCJhdWQiOiJhcGkuZGV2LnNlbGZjYXJlLnBhZ29wYS5pdCIsImlzcyI6IlNQSUQiLCJqdGkiOiIwMUZRS0RQWjE1R1Q0U1RDUUFFNUVYQlZWTSJ9.XeaRUpqmHzevWAt9bojuvFogOUPpVkjQWEqAdKFYJo0icY5gA3BkRqYpQHuCudqrCQDmhi0zRh8o5sx-5OcavBDFEOZnF7dvdf3EWdnAuJvbDpifoNPvO1dUZUhN3u6MvtZwwJnuRi_a85jpquDM8qQH5F-r_s75P1IMeewXnNnAQKdets-xb6TreRcyM4q7fEYdBf21DJ6WmLC7x3i6yxWuJUY1DnEIHUbX7CwuW2GFZ6Zth1OuNNN2L9Nm3YLAy90lo-xQh4lGYMESgJmP98pNmBovPm193NiFSWmnQkuigmBAip87bnzqCx4MO5_RwDnVDxTdTim8faBxCI9SEA'
    );
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, requiredLogin, setRequiredLogin }}>
      <BodyLogger />
      <SessionModal
        handleClose={() => setRequiredLogin(false)}
        open={requiredLogin}
        title={t('app.sessionModal.title')}
        message={t('app.sessionModal.message')}
      />
    </UserContext.Provider>
  );
}
