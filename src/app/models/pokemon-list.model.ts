import { Pokemon } from './pokemon.model';

export class PokemonList {
    count: number;
    next?: string;
    previous?: string;
    results: Pokemon[];
}