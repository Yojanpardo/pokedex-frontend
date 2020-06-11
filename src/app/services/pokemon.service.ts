import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private environ: Environment = new Environment();

  constructor(private http: HttpClient) { }

  getPokemons(){
    return this.http.get(this.environ.myPokemonApi);
  }
}
