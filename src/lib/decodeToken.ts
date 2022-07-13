import jwt_decode from 'jwt-decode';
import { DecodeToken } from 'modules/authentication/interface/authentication.interface';

export const decodeToken = (token: string): DecodeToken | null => {
    try {
        return jwt_decode(token);
    } catch (e) {
        return null;
    }
};
