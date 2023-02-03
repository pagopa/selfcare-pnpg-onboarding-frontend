import { Typography, Box, Grid, CardContent, Card, useTheme, Tooltip, Fab } from '@mui/material';
import { ProductAvatar } from '@pagopa/mui-italia';
import ArrowForward from '@mui/icons-material/ArrowForward';

type Props = {
  cardTitle: React.ReactNode;
  urlLogo: string;
  btnAction?: () => void;
};

export default function ActiveProductCard({ cardTitle, urlLogo, btnAction }: Props) {
  const theme = useTheme();

  return (
    <Card
      raised
      sx={{
        borderRadius: theme.spacing(2),
      }}
    >
      <CardContent sx={{ display: 'flex' }}>
        <Grid container>
          <Grid item xs={12} display="flex" alignItems="flex-start">
            <Box display="flex" flexDirection="column" justifyContent="center" mr={2}>
              <ProductAvatar
                logoUrl={urlLogo}
                size={'large'}
                logoBgColor={'#0066CC'}
                logoAltText={``}
              />
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="center">
              {cardTitle && (
                <Grid sx={{ width: '100px' }} display="flex" alignItems={'center'} mt={1}>
                  <Tooltip title={cardTitle} placement="top" arrow={true}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '26px',
                        fontWeight: '600',
                        height: '100%',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical' as const,
                        WebkitLineClamp: 2,
                        marginTop: 2,
                      }}
                    >
                      {cardTitle}
                    </Typography>
                  </Tooltip>
                </Grid>
              )}
              <Fab
                sx={{ alignSelf: 'end', marginLeft: 5 }}
                size="medium"
                color="primary"
                onClick={btnAction}
              >
                <ArrowForward />
              </Fab>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
