import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`;

export const ADD_TASK = gql`
  mutation addTask($title: String!, $description: String!, $coins: Int!, $xp: Int!, $daily: Boolean, $negative: Boolean) {
    addTask(title: $title, description: $description, coins: $coins, xp: $xp, daily: $daily, negative: $negative) {
      id
    }
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTask($id: String!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

export const COMPLETE_TASK = gql`
  mutation completeTask($id: String!) {
    completeTask(id: $id) {
      id
      completedOn
      title
      description
      coins
      xp
      daily
      negative
    }
  }
`;

export const DELETE_REWARD = gql`
  mutation deleteReward($id: String!) {
    deleteReward(id: $id) {
      id
    }
  }
`;

export const PURCHASE_REWARD = gql`
  mutation purchaseReward($id: String!) {
    purchaseReward(id: $id) {
      id
    }
  }
`;

export const ADD_REWARD = gql`
  mutation addReward($title: String!, $description: String!, $cost: Int!) {
    addReward(title: $title, description: $description, cost: $cost) {
      id
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String! $email: String! $password: String!) {
    addUser(
      username: $username
      email: $email
      password: $password
    ) {
      token
      user {
        id
      }
    }
  }
`;
