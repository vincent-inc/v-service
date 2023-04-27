export interface Jwt {
    jwt: string;
}

export interface User {
    id:          number;
    username:    string;
    password:    string;
    userProfile: UserProfile;
    userRoles:   UserRole[];
}

export interface UserProfile {
    id:          number;
    firstName:   string;
    lastName:    string;
    phoneNumber: string;
    email:       string;
    address:     string;
    city:        string;
    state:       string;
    zip:         string;
}

export interface UserRole {
    id?:    number;
    name:  string;
    level: number;
}

export interface Route {
    id?:     number;
    path:   string;
    method: string;
    secure: boolean;
    roles:  UserRole[];
}
