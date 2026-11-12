import { lokiPassword, lokiUsername } from 'constants/links';

export const lokiAuth = Buffer.from(`${lokiUsername}:${lokiPassword}`).toString('base64');
