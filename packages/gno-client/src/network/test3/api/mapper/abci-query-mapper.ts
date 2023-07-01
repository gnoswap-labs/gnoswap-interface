import { GnoClientResponse } from '../../../../api';
import { AbciQuery } from '../response';

export class AbciQueryMapper {
  public static toAbciQuery = (
    response: AbciQuery,
  ): GnoClientResponse.AbciQuery => {
    const mappedResponse = { ...response };
    const queryData = mappedResponse.response.ResponseBase?.Data;
    if (queryData !== null) {
      const plainData = Buffer.from(queryData, 'base64').toString();
      mappedResponse.response.ResponseBase.Data = plainData;;
    }

    return mappedResponse.response;
  }
}