import { Ability } from './ability.model';

export class Pokemon {
    id: number;
    name: string;
    url: string;
    imageUri: string;
    types: any[];
    abilities: Ability[];
    weight: number;
}
