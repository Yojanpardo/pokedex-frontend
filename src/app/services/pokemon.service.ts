import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private environ: Environment = new Environment();

  constructor(private http: HttpClient) { }

  getPokemons(url: string = `${this.environ.myPokemonApiContext}${this.environ.pokemonContext}`){
    return this.http.get(url);
  }

  getPokemon(pokemonId: number){
    return this.http.get(`${this.environ.myPokemonApiContext}${this.environ.pokemonContext}${pokemonId}`);
  }

  getPokemonSpecies(pokemonId: number){
    return this.http.get(`${this.environ.myPokemonApiContext}${this.environ.pokemonSpeciesContext}${pokemonId}`);
  }

  getEvolutionChain(id: number){
    return this.http.get(`${this.environ.myPokemonApiContext}${this.environ.evolutionChainContext}${id}`)
  }

  getPokemonByUrl(url: string){
    return this.http.get(url);
  }
}
