import { gql } from 'graphql-request';
import { client } from './constants/client';

const GetArtist = gql`
  query GetArtist($email: String!) {
    user: artist(where: { email: $email }, stage: DRAFT) {
      id
      pseudonym
      username
    }
  }
`;

export const signIn = async (email, password) => {
  console.log(email)
  const { user } = await client.request(GetArtist, {
    email,
    password
  });
  
  console.log(user, email, password);
  return {
    id: user.id,
    username: user.username,
    email,
    pseudonym: user.pseudonym
  };
}