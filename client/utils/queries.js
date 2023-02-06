import {gql} from '@apollo/client';

export const QUERY_TASKS = gql`
  query getTasks($creator: String) {
    tasks(creator: $creator) {
      id
      title
      description
      createdAt
      creator
      completedOn
      coins
      xp,
      daily,
      negative
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      id
      username
      email
      xp
      coins
      level
    }
  }
`;

export const QUERY_REWARDS = gql`
  query getRewards($creator: String) {
    rewards(creator: $creator) {
      id
      title
      description
      cost
      creator
      createdAt
    }
  }
`;
