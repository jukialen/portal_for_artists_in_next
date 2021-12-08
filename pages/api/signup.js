import { gql } from 'graphql-request';
import { client } from './constants/client';

const CreateNextUserByEmail = gql`
  mutation CreateNextUserByEmail($username: String!, $pseudonym: String!, $email: String!, $password: String!) {
    newUser: createNextUser(data: { username: $username, pseudonym: $pseudonym email: $email, password: $password }) {
      id
    }
  }
`;

export const createUser = async (username, pseudonym, email, password) => {
  await client.request(
    CreateNextUserByEmail,
    {
      username, pseudonym, email, password
    }
  );
}
