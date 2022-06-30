export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  DateTime: number
  JSONObject: any
}

/** 应用权限&访问相关的信息 */
export type AppAccessInfo = {
  __typename?: 'AppAccessInfo'
  /** 应用是否可以访问 */
  access?: Maybe<Scalars['Boolean']>
  /** 应用访问key，重置后失效 */
  accessKey?: Maybe<Scalars['String']>
  app_id: Scalars['Int']
  /** 是否已经归档（不可以再编辑应用&应用词条） */
  archived?: Maybe<Scalars['Boolean']>
  /** 是否已经删除 */
  deleted?: Maybe<Scalars['Boolean']>
  name?: Maybe<Scalars['String']>
  /** 是否支持进行词条推送 */
  push?: Maybe<Scalars['Boolean']>
}

/** 应用基本信息 */
export type AppItem = {
  __typename?: 'AppItem'
  /** 是否可访问 */
  access?: Maybe<Scalars['Boolean']>
  app_id?: Maybe<Scalars['Int']>
  /** 创建者 */
  creator?: Maybe<UserInfo>
  creatorId?: Maybe<Scalars['Int']>
  description?: Maybe<Scalars['String']>
  /** 支持的语言 */
  languages?: Maybe<Array<Maybe<LanguageTypeEnum>>>
  name?: Maybe<Scalars['String']>
  /** 应用截图 */
  pictures?: Maybe<Array<Maybe<Scalars['String']>>>
  /** 是否支持词条推送 */
  push?: Maybe<Scalars['Boolean']>
  type?: Maybe<AppTypeEnum>
}

/** 应用类型枚举 */
export enum AppTypeEnum {
  Contact = 'CONTACT',
  Education = 'EDUCATION',
  Efficiency = 'EFFICIENCY',
  Finance = 'FINANCE',
  Game = 'GAME',
  Music = 'MUSIC',
  Other = 'OTHER',
  Tool = 'TOOL',
}

/** 词条基本信息 */
export type EntryItem = {
  __typename?: 'EntryItem'
  archive?: Maybe<Scalars['Boolean']>
  createdAt?: Maybe<Scalars['DateTime']>
  deleted?: Maybe<Scalars['Boolean']>
  entry_id: Scalars['Int']
  key?: Maybe<Scalars['String']>
  langs?: Maybe<Scalars['JSONObject']>
  modifyRecords?: Maybe<Array<Maybe<RecordItem>>>
  public?: Maybe<Scalars['Boolean']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

/** 应用支持的语言枚举 */
export enum LanguageTypeEnum {
  Chinese = 'CHINESE',
  English = 'ENGLISH',
  Thai = 'THAI',
  Vietnamese = 'VIETNAMESE',
}

export type Mutation = {
  __typename?: 'Mutation'
  /** 归档一个应用（归档后不能再编辑） */
  archivedApp?: Maybe<Scalars['Boolean']>
  /** 切换词条的公有/私有状态 */
  changeEntryPublicStatus?: Maybe<Scalars['Boolean']>
  /** 检测邮箱是否可用 */
  checkEmailValidation?: Maybe<Scalars['Boolean']>
  /** 创建应用 */
  createApp?: Maybe<Scalars['Int']>
  /** 创建词条，默认情况下都为公共词条 */
  createEntry?: Maybe<Scalars['Int']>
  /** 删除一个应用（逻辑删除），删除后应用对客户不可见 */
  deleteApp?: Maybe<Scalars['Boolean']>
  /** 邮箱&密码登录 */
  login?: Maybe<Scalars['String']>
  /** 刷新应用accessKey */
  refreshAccessKey?: Maybe<Scalars['Boolean']>
  /** 用户邮箱&密码注册 */
  register?: Maybe<Scalars['String']>
  resetPassword?: Maybe<Scalars['Boolean']>
  /** 发送重设密码链接 */
  sendResetPasswordEmail?: Maybe<Scalars['Boolean']>
  updateEntry?: Maybe<Scalars['Boolean']>
  /** 编辑用户信息 */
  updateUserInfo?: Maybe<Scalars['Boolean']>
}

export type MutationArchivedAppArgs = {
  id: Scalars['Int']
}

export type MutationChangeEntryPublicStatusArgs = {
  appId: Scalars['Int']
  entryId: Scalars['Int']
  public: Scalars['Boolean']
}

export type MutationCheckEmailValidationArgs = {
  email: Scalars['String']
}

export type MutationCreateAppArgs = {
  description?: InputMaybe<Scalars['String']>
  languages: Array<LanguageTypeEnum>
  name: Scalars['String']
  pictures: Array<Scalars['String']>
  type: AppTypeEnum
}

export type MutationCreateEntryArgs = {
  appId: Scalars['Int']
  key?: InputMaybe<Scalars['String']>
  langs?: InputMaybe<Scalars['JSONObject']>
}

export type MutationDeleteAppArgs = {
  id: Scalars['Int']
}

export type MutationLoginArgs = {
  email: Scalars['String']
  password: Scalars['String']
}

export type MutationRefreshAccessKeyArgs = {
  id: Scalars['Int']
}

export type MutationRegisterArgs = {
  email: Scalars['String']
  password: Scalars['String']
}

export type MutationResetPasswordArgs = {
  oldPassword: Scalars['String']
  password: Scalars['String']
}

export type MutationSendResetPasswordEmailArgs = {
  email: Scalars['String']
}

export type MutationUpdateEntryArgs = {
  entryId: Scalars['Int']
  key?: InputMaybe<Scalars['String']>
  langs?: InputMaybe<Scalars['JSONObject']>
}

export type MutationUpdateUserInfoArgs = {
  avatar?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  nickName?: InputMaybe<Scalars['String']>
  phone?: InputMaybe<Scalars['String']>
  role?: InputMaybe<UserRoleEnum>
}

export type Query = {
  __typename?: 'Query'
  /** 根据应用id获取应用权限&访问相关的信息 */
  getAccessKeyByAppId?: Maybe<AppAccessInfo>
  /** 通过应用id获取应用基本信息 */
  getAppInfoById?: Maybe<AppItem>
  /** 获取当前用户创建的应用列表 */
  getCurrentApps?: Maybe<Array<Maybe<AppItem>>>
  /** 获取当前登录用户的基本信息 */
  getCurrentUser?: Maybe<UserInfo>
  /** 获取所有公共词条（分页） */
  pageAllPublicEntries?: Maybe<Array<Maybe<EntryItem>>>
  /** 获取应用所有词条（分页） */
  pageAppEntries?: Maybe<Array<Maybe<EntryItem>>>
}

export type QueryGetAccessKeyByAppIdArgs = {
  id: Scalars['Int']
}

export type QueryGetAppInfoByIdArgs = {
  id: Scalars['Int']
}

export type QueryPageAllPublicEntriesArgs = {
  pageNo: Scalars['Int']
  pageSize: Scalars['Int']
}

export type QueryPageAppEntriesArgs = {
  appId: Scalars['Int']
  pageNo: Scalars['Int']
  pageSize: Scalars['Int']
}

/** 词条操作记录 */
export type RecordItem = {
  __typename?: 'RecordItem'
  createdAt?: Maybe<Scalars['DateTime']>
  entryEntry_id?: Maybe<Scalars['Int']>
  prevLangs?: Maybe<Scalars['JSONObject']>
  record_id: Scalars['Int']
}

/** 用户基本信息 */
export type UserInfo = {
  __typename?: 'UserInfo'
  /** 用户头像 */
  avatar?: Maybe<Scalars['String']>
  /** 邮件 */
  email?: Maybe<Scalars['String']>
  /** 用户账户 */
  name?: Maybe<Scalars['String']>
  /** 昵称 */
  nickName?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  /** 角色 */
  role?: Maybe<UserRoleEnum>
  /** 用户id */
  user_id?: Maybe<Scalars['Int']>
}

/** 用户角色枚举 */
export enum UserRoleEnum {
  Developer = 'DEVELOPER',
  Manager = 'MANAGER',
  Other = 'OTHER',
  Translator = 'TRANSLATOR',
}
