import { Grid, Box } from '@mui/material';
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone';
import { useContext, useEffect, useState } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { uniqueId } from 'lodash';
import { TFunction, useTranslation } from 'react-i18next';
import { fetchWithLogs } from '../../../lib/api-utils';
import { UserContext } from '../../../lib/context';
import { getFetchOutcome } from '../../../lib/error-utils';
import { PartyDescription } from './PartyDescription';
import PartyLogo from './PartyLogo';

type Props = {
  partyId?: string;
};

const getLabelLinkText = (t: TFunction<'translation', undefined>) =>
  document.querySelector('#partyLogo')?.children[0].tagName === 'svg'
    ? t('dashboard.partyLogo.upload')
    : t('dashboard.partyLogo.modify');

export function PartyLogoUploader({ partyId }: Props) {
  const { t } = useTranslation();
  const { setRequiredLogin } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [urlLogo, setUrlLogo] = useState<string>();

  const [labelLink, setLabelLink] = useState<string>(getLabelLinkText(t));
  const [uploadedFiles, setUploadedFiles] = useState<Array<File>>([]);

  useEffect(() => {
    if (urlLogo && partyId) {
      setTimeout(() => setLabelLink(getLabelLinkText(t)), 600);
    }
  }, [urlLogo, partyId]);

  const maxLength = 400;
  const minLegth = 300;

  const onFileRejected = (files: Array<FileRejection>) => {
    console.log('error:', files); // TODO
  };

  const uploadLogo = async () => {
    const response = await fetchWithLogs(
      {
        endpoint: 'DASHBOARD_SAVE_INSTITUTION_LOGO',
        endpointParams: {
          institutionId: '01501320442',
        },
      },
      {
        method: 'PUT',
        params: {
          logo: uploadedFiles[0],
        },
      },
      () => setRequiredLogin(true)
    );

    const outcome = getFetchOutcome(response);

    if (outcome === 'success') {
      setUrlLogo(urlLogo);
      setLoading(false);
      setLabelLink(t('overview.partyLogo.modify'));
      trackEvent('DASHBOARD_PARTY_CHANGE_LOGO_SUCCESS', {
        party_id: partyId,
      });
    } else {
      trackEvent('DASHBOARD_PARTY_CHANGE_LOGO_FAILURE', {
        party_id: partyId,
      });
      setLoading(false);
      setLabelLink(t('overview.partyLogo.upload'));
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDropAccepted: (files: Array<File>) => {
      setLoading(true);
      setUploadedFiles(files);
      setLabelLink(files[0].name);
      const requestId = uniqueId();
      trackEvent('DASHBOARD_PARTY_CHANGE_LOGO', { party_id: partyId, request_id: requestId });
      uploadLogo().catch((e) => e);
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
