import { UserProfile, UserRole } from "./Authenticator.model";
import { MatRow } from "./Mat.model";

export interface Question {
    id?:             number;
    question?:       string;
    category?:       string;
    possibleAnswer?: string[];
    orderBy?:        number;
    answer?:         Answer;
    selectedAnswer?: string[];
}

export interface Answer {
    id?:                    number;
    correctAnswer?:         string[];
    pointPerCorrectAnswer?: number;
}

export class QuestionRow implements MatRow {
    id?:             number;
    question?:       string;
    category?:       string;
    orderBy?:        number;
}

export interface Lobby {
    id?:                    string;
    name?:                  string;
    description?:           string;
    currentGame?:           string;
    password?:              string;
    currentNumberOfPlayer?: number;
    maxPlayer?:             number;
    lobbyGame?:             LobbyGame;
    battleshipGame?:        BattleshipGame;
}

export interface BattleshipGame {
    maxPlayer?:             number;
    currentNumberOfPlayer?: number;
    gridSize?:              number;
    maxNumberOfShip?:       number;
    boards?:                Board[];
}

export interface Board {
    player?:              Host;
    currentNumberOfShip?: number;
    matrix?:              Array<string[]>;
}

export interface Host {
    id?:          number;
    username?:    string;
    password?:    string;
    userProfile?: UserProfile;
    userRoles?:   UserRole[];
}

export interface LobbyGame {
    host?:           Host;
    playerList?:     Host[];
    spectatingList?: Host[];
    conversation?:   string[];
}
