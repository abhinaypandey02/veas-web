/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
};

export enum ChartSummaryType {
  Antardasha = 'Antardasha',
  Daily = 'Daily',
  Mahadasha = 'Mahadasha',
  Pratyantardasha = 'Pratyantardasha',
  Weekly = 'Weekly'
}

export type Chat = {
  __typename?: 'Chat';
  createdAt: Scalars['Float']['output'];
  message: Scalars['String']['output'];
  role: ChatRole;
};

export enum ChatRole {
  Assistant = 'Assistant',
  Summary = 'Summary',
  User = 'User'
}

export type CurrentMahadasha = {
  __typename?: 'CurrentMahadasha';
  end: Scalars['String']['output'];
  planet: Scalars['String']['output'];
  start: Scalars['String']['output'];
};

export type D1Planet = {
  __typename?: 'D1Planet';
  house: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  sign: Scalars['String']['output'];
};

export enum Gender {
  Female = 'Female',
  Male = 'Male',
  NonBinary = 'NonBinary'
}

export type GetSummaryInput = {
  type: ChartSummaryType;
};

export type Mutation = {
  __typename?: 'Mutation';
  onboardUser: Scalars['Float']['output'];
  submitFeedback: Scalars['Boolean']['output'];
  updateUser: Scalars['Boolean']['output'];
  updateUserChart: Scalars['Float']['output'];
};


export type MutationOnboardUserArgs = {
  input: OnboardUserInput;
};


export type MutationSubmitFeedbackArgs = {
  input: SubmitFeedbackInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserChartArgs = {
  input: UpdateUserChartInput;
};

export type OnboardUserInput = {
  dateOfBirth: Scalars['DateTimeISO']['input'];
  placeOfBirthLat: Scalars['Float']['input'];
  placeOfBirthLong: Scalars['Float']['input'];
  timezone: Scalars['Float']['input'];
};

export type PlanetsResponse = {
  __typename?: 'PlanetsResponse';
  currentMahadasha?: Maybe<CurrentMahadasha>;
  planets: Array<D1Planet>;
};

export type Query = {
  __typename?: 'Query';
  getChats: Array<Chat>;
  getCurrentUser?: Maybe<User>;
  getPlanets: PlanetsResponse;
  getSummary?: Maybe<Scalars['String']['output']>;
};


export type QueryGetSummaryArgs = {
  input: GetSummaryInput;
};

export type SubmitFeedbackInput = {
  score: Scalars['Float']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserChartInput = {
  dateOfBirth: Scalars['DateTimeISO']['input'];
  lat: Scalars['Float']['input'];
  long: Scalars['Float']['input'];
  placeOfBirth?: InputMaybe<Scalars['String']['input']>;
  timezoneOffset?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateUserInput = {
  gender?: InputMaybe<Gender>;
  name?: InputMaybe<Scalars['String']['input']>;
  placeOfBirth?: InputMaybe<Scalars['String']['input']>;
  timezoneOffset?: InputMaybe<Scalars['Float']['input']>;
};

export type User = {
  __typename?: 'User';
  dateOfBirth?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  gender?: Maybe<Gender>;
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  placeOfBirth?: Maybe<Scalars['String']['output']>;
  placeOfBirthLat?: Maybe<Scalars['Float']['output']>;
  placeOfBirthLong?: Maybe<Scalars['Float']['output']>;
  timezoneOffset?: Maybe<Scalars['Float']['output']>;
};

export type OnboardUserMutationVariables = Exact<{
  input: OnboardUserInput;
}>;


export type OnboardUserMutation = { __typename?: 'Mutation', onboardUser: number };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: boolean };

export type UpdateUserChartMutationVariables = Exact<{
  input: UpdateUserChartInput;
}>;


export type UpdateUserChartMutation = { __typename?: 'Mutation', updateUserChart: number };

export type SubmitFeedbackMutationVariables = Exact<{
  input: SubmitFeedbackInput;
}>;


export type SubmitFeedbackMutation = { __typename?: 'Mutation', submitFeedback: boolean };

export type GetSummaryQueryVariables = Exact<{
  input: GetSummaryInput;
}>;


export type GetSummaryQuery = { __typename?: 'Query', getSummary?: string | null };

export type GetPlanetsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPlanetsQuery = { __typename?: 'Query', getPlanets: { __typename?: 'PlanetsResponse', planets: Array<{ __typename?: 'D1Planet', name: string, sign: string, house: number }>, currentMahadasha?: { __typename?: 'CurrentMahadasha', planet: string, start: string, end: string } | null } };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', id: number, email: string, name: string, placeOfBirth?: string | null, timezoneOffset?: number | null, gender?: Gender | null, dateOfBirth?: any | null, placeOfBirthLat?: number | null, placeOfBirthLong?: number | null } | null };

export type GetChatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatsQuery = { __typename?: 'Query', getChats: Array<{ __typename?: 'Chat', message: string, role: ChatRole, createdAt: number }> };


export const OnboardUserDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "mutation", "name": { "kind": "Name", "value": "OnboardUser" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "OnboardUserInput" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "onboardUser" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "input" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } } }] }] } }] } as unknown as DocumentNode<OnboardUserMutation, OnboardUserMutationVariables>;
export const UpdateUserDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "mutation", "name": { "kind": "Name", "value": "UpdateUser" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "UpdateUserInput" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "updateUser" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "input" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } } }] }] } }] } as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const UpdateUserChartDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "mutation", "name": { "kind": "Name", "value": "UpdateUserChart" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "UpdateUserChartInput" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "updateUserChart" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "input" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } } }] }] } }] } as unknown as DocumentNode<UpdateUserChartMutation, UpdateUserChartMutationVariables>;
export const SubmitFeedbackDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "mutation", "name": { "kind": "Name", "value": "SubmitFeedback" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "SubmitFeedbackInput" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "submitFeedback" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "input" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } } }] }] } }] } as unknown as DocumentNode<SubmitFeedbackMutation, SubmitFeedbackMutationVariables>;
export const GetSummaryDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetSummary" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "GetSummaryInput" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "getSummary" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "input" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } } }] }] } }] } as unknown as DocumentNode<GetSummaryQuery, GetSummaryQueryVariables>;
export const GetPlanetsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetPlanets" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "getPlanets" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "planets" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "name" } }, { "kind": "Field", "name": { "kind": "Name", "value": "sign" } }, { "kind": "Field", "name": { "kind": "Name", "value": "house" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "currentMahadasha" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "planet" } }, { "kind": "Field", "name": { "kind": "Name", "value": "start" } }, { "kind": "Field", "name": { "kind": "Name", "value": "end" } }] } }] } }] } }] } as unknown as DocumentNode<GetPlanetsQuery, GetPlanetsQueryVariables>;
export const GetCurrentUserDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetCurrentUser" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "getCurrentUser" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "email" } }, { "kind": "Field", "name": { "kind": "Name", "value": "name" } }, { "kind": "Field", "name": { "kind": "Name", "value": "placeOfBirth" } }, { "kind": "Field", "name": { "kind": "Name", "value": "timezoneOffset" } }, { "kind": "Field", "name": { "kind": "Name", "value": "gender" } }, { "kind": "Field", "name": { "kind": "Name", "value": "dateOfBirth" } }, { "kind": "Field", "name": { "kind": "Name", "value": "placeOfBirthLat" } }, { "kind": "Field", "name": { "kind": "Name", "value": "placeOfBirthLong" } }] } }] } }] } as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetChatsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "GetChats" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "getChats" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "message" } }, { "kind": "Field", "name": { "kind": "Name", "value": "role" } }, { "kind": "Field", "name": { "kind": "Name", "value": "createdAt" } }] } }] } }] } as unknown as DocumentNode<GetChatsQuery, GetChatsQueryVariables>;