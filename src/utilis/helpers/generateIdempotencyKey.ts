import { v4 as uuidv4 } from 'uuid';

export function generateIdempotencyKey() : string {
    return uuidv4(); // ⇨ 'b18794e8-5d0d-417c-b361-ba38e78411b4'
}