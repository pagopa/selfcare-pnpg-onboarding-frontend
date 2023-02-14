import { ApiRequestType, IResponseType, TypeofApiResponse } from '@pagopa/ts-commons/lib/requests';
import { isRight, toError } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { ENV } from './env';

export const extractResponsee = async <R>(
  response: t.Validation<
    TypeofApiResponse<ApiRequestType<any, any, any, IResponseType<any, any, any>>>
  >,
  successHttpStatus: number,
  onRedirectToLogin: () => void,
  badRequestHttpStatus: number | null = 400,
  notValidTokenHttpStatus: number | null = 401,
  notAuthorizedTokenHttpStatus: number | null = 403,
  emptyResponseHttpStatus: number | null = 404
): Promise<R> => {
  if (isRight(response)) {
    if (response.right.status === successHttpStatus) {
      return response.right.value;
    } else if (notValidTokenHttpStatus && response.right.status === notValidTokenHttpStatus) {
      onRedirectToLogin();
      window.setTimeout(() => window.location.assign(ENV.URL_FE.LOGOUT), 2000);
      return new Promise(() => null);
    } else if (
      notAuthorizedTokenHttpStatus &&
      response.right.status === notAuthorizedTokenHttpStatus
    ) {
      throw new Error(`Operation not allowed!`);
    } else if (emptyResponseHttpStatus && response.right.status === emptyResponseHttpStatus) {
      return new Promise((resolve) => resolve(null as unknown as R));
    } else if (badRequestHttpStatus && response.right.status === badRequestHttpStatus) {
      return response.right.status;
    } else {
      console.error(JSON.stringify(response.right));
      const error = new Error(
        `Unexpected HTTP status! Expected ${successHttpStatus} obtained ${response.right.status}`
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line functional/immutable-data
      error.httpStatus = response.right.status;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line functional/immutable-data
      error.httpBody = response.right.value;
      throw error;
    }
  } else {
    console.error('Something gone wrong while fetching data');
    console.error(JSON.stringify(response.left));
    throw toError(response.left);
  }
};
