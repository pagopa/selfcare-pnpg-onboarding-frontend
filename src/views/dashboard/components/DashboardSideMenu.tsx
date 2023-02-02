import { List, Grid } from '@mui/material';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { useTranslation } from 'react-i18next';
import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircle';
import DashboardSidenavItem from './DashboardSidenavItem';

export default function DashboardSideMenu() {
  const { t } = useTranslation();
  const onExit = useUnloadEventOnExit();

  const isOVerviewSelected = true;
  {
    /* window.location.pathname === overviewPath */
  }
  const isRoleSelected = false;
  {
    /* window.location.pathname.startsWith(usersPath) */
  }
  const isGroupSelected = false;
  {
    /* window.location.pathname.startsWith(groupsPath); */
  }

  return (
    <Grid container item sx={{ width: '100%', backgroundColor: 'background.paper' }} mt={1}>
      <Grid item xs={12}>
        <List sx={{ width: '100%' }}>
          <DashboardSidenavItem
            title={t('dashboard.sideMenu.overview')}
            handleClick={() => onExit(() => {})}
            isSelected={isOVerviewSelected}
            icon={DashboardCustomize}
          />
          <DashboardSidenavItem
            title={t('dashboard.sideMenu.users')}
            handleClick={() => onExit(() => {})}
            isSelected={isRoleSelected}
            icon={PeopleAlt}
          />
          <DashboardSidenavItem
            title={t('dashboard.sideMenu.groups')}
            handleClick={() => onExit(() => {})}
            isSelected={isGroupSelected}
            icon={SupervisedUserCircle}
          />
        </List>
      </Grid>
    </Grid>
  );
}
