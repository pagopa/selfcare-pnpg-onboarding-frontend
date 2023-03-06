import { Card, Grid, Typography } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { PnPGInstitutionResource } from '../../../../types';

type Props = {
  party?: PnPGInstitutionResource;
  legalAddress?: string;
  zipCode?: string;
};

export default function PartyInfoOverview({ party, legalAddress, zipCode }: Props) {
  const { t } = useTranslation();

  const selectedInstitutionPnPg = history.state.state;

  const infoStyles = {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.fontSize,
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          py: 3,
          px: 1,
          backgroundColor: '#EEEEEE',
          border: 'none',
        }}
      >
        <Grid container alignItems={'flex-start'} wrap="nowrap">
          <Grid container item xs={6} alignItems={'flex-start'} spacing={1} pr={2}>
            <Grid item xs={4}>
              <Typography variant="body2">{t('dashboard.infoOverview.typology')}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {party?.institutionType}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2">{t('dashboard.infoOverview.category')}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {party?.category ?? zipCode} {/* TODO {party?.category} */}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2">{t('dashboard.infoOverview.businessName')}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {party?.name ?? selectedInstitutionPnPg?.businessName}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={6} alignItems={'flex-start'} spacing={1} pr={2}>
            <Grid item xs={4}>
              <Typography variant="body2">{t('dashboard.infoOverview.fiscalCode')}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {party?.fiscalCode ?? selectedInstitutionPnPg?.businessTaxId}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2">{t('dashboard.infoOverview.primaryPecEmail')}</Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {party?.mailAddress}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2">
                {t('dashboard.infoOverview.registeredOffice')}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
                {legalAddress}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
