import { MatRow } from "./Mat.model";

export interface Jwt {
    jwt?: string;
}

export interface User {
    id?:          number;
    username?:    string;
    password?:    string;
    userProfile?: UserProfile;
    userRoles?:   UserRole[];
    enable:       boolean;
}

export interface UserProfile {
    id?:          number;
    firstName?:   string;
    lastName?:    string;
    phoneNumber?: string;
    email?:       string;
    address?:     string;
    city?:        string;
    state?:       string;
    zip?:         string;
    alias?:       string;
}

export interface UserRole {
    id?:    number;
    name?:  string;
    level?: number;
}

export interface Route {
    id?:     number;
    path?:   string;
    method?: string;
    secure?: boolean;
    roles?:  UserRole[];
}

export default class UserRow implements MatRow
{
    id?:                   number;
    username?:              string;
    email?:                 string;
    enable?:                boolean;
    userRoles?:             string;

    constructor(id: number, username: string, email: string, enable: boolean, userRoles: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.enable = enable;
        this.userRoles = userRoles;
    }
}

export class Player {
    id!: number;
    alias!: string;
    
    constructor(user: User) {
        this.id = user.id!;
        this.alias = user.userProfile!.alias!;
    }
}