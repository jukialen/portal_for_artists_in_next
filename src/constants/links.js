export const backUrl = process.env.NEXT_PUBLIC_PAGE;
export const projectUrlWithOutPrefix = process.env.NEXT_PUBLIC_SUPABASE_URL_WITHOUT_PREFIX;
export const projectUrl = `https://${projectUrlWithOutPrefix}`;
export const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const access_token = process.env.NEXT_PUBLIC_SUPABASE_ACCESS_TOKEN;
const supabaseStorageUrl = `${projectUrl}/storage/v1/object/public`;
export const supabaseStorageProfileUrl = `${supabaseStorageUrl}/profiles`;

export const mailerApiKey = process.env.NEXT_PUBLIC_MAILERSEND_API_KEY;
export const GTM_ID = process.env.NEXT_PUBLIC_G_TAG;

export const feedbackEmail = process.env.NEXT_PUBLIC_FEEDBACK_EMAIL;
export const feedbackEmailTemplateId = process.env.NEXT_PUBLIC_FEEDBACK_TEMPLATE_ID;
export const newUserRed = '/new-user';

export const darkMode = 'dark';
