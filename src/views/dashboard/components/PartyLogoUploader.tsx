import { Grid, Box } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { uniqueId } from 'lodash';
import { TFunction, useTranslation } from 'react-i18next';
import PartyLogo from './PartyLogo';
import { PartyDescription } from './PartyDescription';

type Props = {
  partyId: string;
};

const getLabelLinkText = (t: TFunction<'translation', undefined>) =>
  document.querySelector('#partyLogo')?.children[0].tagName === 'svg'
    ? t('dashboard.partyLogo.upload')
    : t('dashboard.partyLogo.modify');

export function PartyLogoUploader({ partyId }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  /*
  const urlLogo = useAppSelector(partiesSelectors.selectPartySelectedLogo);
  const dispatch = useAppDispatch();
  const setUrlLogo = (urlLogo?: string) =>
    dispatch(partiesActions.setPartySelectedPartyLogo(urlLogo)); */

  const [labelLink, setLabelLink] = useState<string>(getLabelLinkText(t));
  // const addError = useErrorDispatcher();
  const [uploadedFiles, setUploadedFiles] = useState<Array<File>>([]);

  /*
  useEffect(() => {
    if (urlLogo && partyId) {
      setTimeout(() => setLabelLink(getLabelLinkText(t)), 600);
    }
  }, [urlLogo, partyId]); 

  const maxLength = 400;
  const minLegth = 300; 

  const onFileRejected = (files: Array<FileRejection>) => {
    addError({
      id: 'WRONG_FILE_EXTENSION',
      blocking: false,
      error: new Error(),
      techDescription: `Wrong File Extension : ${files[0]}`,
      displayableTitle: t('overview.partyLogo.uploadError.title'),
      displayableDescription: t('overview.partyLogo.uploadError.description'),
      toNotify: false,
      onRetry: open,
    });
  }; */

  const { getRootProps, getInputProps, open } = useDropzone({
    onDropAccepted: (files: Array<File>) => {
      setLoading(true);
      setUploadedFiles(files);
      setLabelLink(files[0].name);
      const requestId = uniqueId();
      trackEvent('DASHBOARD_PARTY_CHANGE_LOGO', { party_id: partyId, request_id: requestId });

      /*
      DashboardApi.uploadLogo(partyId, files[0])
        .then(() => {
          setUrlLogo(urlLogo);
          setLoading(false);
          setLabelLink(t('overview.partyLogo.modify'));
          trackEvent('DASHBOARD_PARTY_CHANGE_LOGO_SUCCESS', {
            party_id: partyId,
            request_id: requestId,
          });
        })
        .catch((reason: any) => {
          trackEvent('DASHBOARD_PARTY_CHANGE_LOGO_FAILURE', {
            party_id: partyId,
            request_id: requestId,
          });
          setLoading(false);
          addError({
            id: 'FILE_UPLOAD_ERROR',
            blocking: false,
            error: reason,
            techDescription: 'An error occurred while uploading new logo',
            displayableTitle: t('overview.partyLogo.modifyError.title'),
            displayableDescription: t('overview.partyLogo.modifyError.description'),
            toNotify: false,
            onRetry: open,
          });
          setLabelLink(t('overview.partyLogo.upload'));
        });
    },
    onDropRejected: onFileRejected,
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    accept: 'image/png',
    getFilesFromEvent: (event: DropEvent): Promise<Array<File | DataTransferItem>> => {
      const files = (event.target as any).files || (event as any).dataTransfer.files;
      const file = files[0];
      if (!file) {
        return new Promise((resolve) => resolve([]));
      }
      return new Promise((resolve, error) => {
        if (file.type !== 'image/png') {
          error();
          return;
        }
        const image = new Image();

        // eslint-disable-next-line functional/immutable-data
        image.onload = function () {
          // eslint-disable-next-line functional/immutable-data
          file.width = image.width;
          // eslint-disable-next-line functional/immutable-data
          file.height = image.height;
          resolve([file]);
        };

        // eslint-disable-next-line functional/immutable-data
        image.src = URL.createObjectURL(file);
      }).catch((_reason) => {
        onFileRejected(files);
        return [];
      }) as Promise<Array<File | DataTransferItem>>;
    },
    validator: (file) => {
      if (
        (file as any).height > maxLength ||
        (file as any).height < minLegth ||
        (file as any).height !== (file as any).width
      ) {
        return {
          code: 'height-width',
          message: `Image width and height must be equal with a value betwenn 300-400`,
        };
      }
      return null;
      */
    },
  });

  return (
    <Grid container direction="row">
      <Box
        {...getRootProps({ className: 'dropzone' })}
        display="flex"
        justifyItems={'center'}
        alignItems={'center'}
      >
        <Box>
          <input {...getInputProps()} />
          <PartyLogo loading={loading} urlLogo={undefined} /> {/* TODO */}
        </Box>
        <Box>
          <PartyDescription
            labelLink={labelLink}
            open={open}
            loading={loading}
            files={uploadedFiles}
          />
        </Box>
      </Box>
    </Grid>
  );
}
