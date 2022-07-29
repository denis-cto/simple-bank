import { ILimitListElementResponse, ILimitListElement, ILimits } from '../models';

const sendLimits = async (param: any, ctx: any, typeAction?: string) =>{
  let actionName = 'v1.services.absence-limits.StuffUnit.command.AssignLimits';

  let requestObj;
  if(param.personsDictionaryId){
    requestObj = getLimitsObj(param.absenceLimits,
      'EMPLOYEE',
      param.personsDictionaryId,
      param.validFrom,
      param.validTo,
      param
      );
  } else {
    requestObj = param;
  }

  switch (typeAction){
    case 'commit' : actionName = actionName + '_commit'; break;
    case 'compensate' : actionName = actionName + '_compensate'; break;
    default: break;
  }
  const response = await ctx.call(actionName, requestObj);

  if (response.message.length <= 0) {
    throw Error(response.error);
  } else {
    return response.data ? response.data : [];
  }
};


const getLimitsObj = (absenceLimits: ILimitListElementResponse[],
  limitType: string,
  id: string | undefined,
  validFrom: string | undefined,
  validTo: string | undefined | null,
  comments: string): ILimits => {
  const absenceLimitsArr: ILimitListElement[] = [];

  if (!validFrom || !id) {
    throw Error(`Record (${id}) does not have: validFrom or id`);
  }


  const limits: ILimits = {
    period: null,
    entityId: id,
    entityType: limitType,
    absenceLimits: absenceLimitsArr,
    comments: comments || '',
  };

  return limits;
};

export default sendLimits;
