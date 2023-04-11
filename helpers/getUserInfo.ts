import Session from 'supertokens-web-js/recipe/session';

export const getUserInfo = async () => {
  if (await Session.doesSessionExist()) {
    const userId = await Session.getUserId();
    const accessTokenPayload = await Session.getAccessTokenPayloadSecurely();

    return {
      userId,
      accessTokenPayload,
    };
  }

  throw new Error(`User isn't authorised.`);
};
