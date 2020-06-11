import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private environ: Environment = new Environment();

  constructor(private http: HttpClient) { }

  getPokemons(url: string = this.environ.myPokemonApi){
    return this.http.get(url);
  }

  getPokemon(pokemonId: number){
    return this.http.get(`${this.environ.myPokemonApi}/${pokemonId}`);
  }
}
