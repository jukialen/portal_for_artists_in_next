import { gql } from 'graphql-request';
import { client } from './constants/client';

const GetUserByEmail = gql`
  query GetUserByEmail($email: String!) {
    user: nextUser(where: { email: $email }, stage: DRAFT) {
      id
      password
    }
  }
`;

export const signIn = async (email, password) => {
  console.log(email)
  const { user } = await client.request(GetUserByEmail, {
    email,
  });
  
  console.log(user, email, password);
  return {
    id: user.id,
    username: email,
    email,
  };
}