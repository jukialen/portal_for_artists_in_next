import { gql } from 'graphql-request';
import { client } from './constants/client';
let bcrypt = require('bcryptjs');

const CreateArtist = gql`
  mutation CreateArtist($username: String!, $pseudonym: String!, $email: String!, $password: String!) {
    newArtist: createArtist(data: { username: $username, pseudonym: $pseudonym email: $email, password: $password }) {
      id
    }
  }
`;

export const createUser = async (username, pseudonym, email, password) => {
  await client.request(
    CreateArtist,
    {
      username, pseudonym, email, password: await bcrypt.hash(password, 12),
    }
  );
}
