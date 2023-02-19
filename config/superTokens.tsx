import SuperTokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword'

SuperTokens.init({
    appInfo: {
      appName: `${process.env.APP_NAME}`,
      apiDomain: `${process.env.API_DOMAIN}`,
      apiBasePath: '/auth',
    },
    recipeList: [
      ThirdPartyEmailPassword.init(),
      Session.init(),
    ],

})