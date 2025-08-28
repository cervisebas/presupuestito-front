import { PersonResponse } from './PersonResponse';

export interface ClientResponse {
    clientId: number;
    personId: PersonResponse;
}
