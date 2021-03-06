import { Component, OnInit } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { PokemonSpecies } from 'src/app/models/pokemon-species.model';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit {
  isLoading: boolean;
  pokemon: Pokemon;
  pokemonSpecies: PokemonSpecies;
  evolutions: Pokemon[];
  evolutionChain: any;
  isLoadingEvolutionChain: boolean;
  flavorText: string;
  flavorTextEntries: any[];
  pokemonFound: boolean;
  constructor(private pokemonService: PokemonService, private activatedRoute: ActivatedRoute) {

   }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.evolutions = [];
      this.isLoading = true;
      this.isLoadingEvolutionChain = true;
      this.pokemon = new Pokemon();
      this.pokemon.id = params['id'];
      this.getPokemon(this.pokemon.id);
    });
  }

  getPokemon(pokemonId: number) {
    if (localStorage.getItem(`pokemon${pokemonId}`)){
      this.pokemon = JSON.parse(localStorage.getItem(`pokemon${pokemonId}`));
      this.isLoading = false;
      this.pokemonFound = true;
      this.getPokemonSpecies(this.pokemon.id);
    } else {
      this.pokemonService.getPokemon(pokemonId).subscribe((p: Pokemon) => {
        this.pokemon = p;
        console.log(p);
        localStorage.setItem(`pokemon${pokemonId}`, JSON.stringify(p));
        this.getPokemonSpecies(this.pokemon.id);
      }, error => {
        console.log(error);
        this.isLoading = false;
        this.pokemonFound = false;
      });
    }
  }

  getPokemonSpecies(pokemonId: number) {
    if (localStorage.getItem(`pokemonSpecies${pokemonId}`)){
      this.pokemonSpecies = JSON.parse(localStorage.getItem(`pokemonSpecies${pokemonId}`));
      this.flavorText = localStorage.getItem(`flavor_text${pokemonId}`);
      const evolutionChainId = Number(localStorage.getItem(`evolution_chain_id${pokemonId}`));
      this.getEvolutionChain(evolutionChainId);
      this.isLoading = false;
      this.pokemonFound = true;
    } else {
      this.pokemonService.getPokemonSpecies(pokemonId).subscribe((p: PokemonSpecies) => {
        this.pokemonSpecies = p;
        p['flavor_text_entries'].forEach( entry => {
          if (entry['language']['name'] === 'en'){
            this.flavorText = entry['flavor_text'];
            localStorage.setItem(`flavor_text${pokemonId}`, this.flavorText);
          }
        });
        localStorage.setItem(`pokemonSpecies${pokemonId}`, JSON.stringify(p));
        const evolutionChainParts = this.pokemonSpecies['evolution_chain']['url'].split('/');
        const evolutionChainId = evolutionChainParts[evolutionChainParts.length - 2];
        localStorage.setItem(`evolution_chain_id${pokemonId}`, evolutionChainId);
        this.getEvolutionChain(evolutionChainId);
        this.isLoading = false;
        this.pokemonFound = true;
      });
    }
  }

  getEvolutionChain(evolutionChainId: number) {
    if (localStorage.getItem(`evolution_chain${evolutionChainId}`)){
      this.evolutionChain = JSON.parse(localStorage.getItem(`evolution_chain${evolutionChainId}`));
      this.loadEvolutions();
    }
    this.pokemonService.getEvolutionChain(evolutionChainId).subscribe(resp => {
      this.evolutionChain = resp;
      localStorage.setItem(`evolution_chain${evolutionChainId}`, JSON.stringify(this.evolutionChain));
      this.loadEvolutions();
    });
  }

  loadEvolutions() {
    if (localStorage.getItem(`evolutions${this.evolutionChain['id']}`)){
      this.evolutions = JSON.parse(localStorage.getItem(`evolutions${this.evolutionChain['id']}`));
      this.isLoadingEvolutionChain = false;
      return;
    }
    this.pokemonService.getPokemonByUrl(this.evolutionChain['chain']['species']['url']).subscribe((p: Pokemon) => {
      this.evolutions.push(p);
      if (this.evolutionChain['chain']['evolves_to'].length > 0){
        this.evolutionChain['chain']['evolves_to'].forEach(element => {
          this.pokemonService.getPokemonByUrl(element['species']['url']).subscribe((p: Pokemon) => {
            this.evolutions.push(p);
            if (element['evolves_to'].length > 0){
              element['evolves_to'].forEach(element2 => {
                this.pokemonService.getPokemonByUrl(element2['species']['url']).subscribe((p2: Pokemon) => {
                  this.evolutions.push(p2);
                  localStorage.setItem(`evolutions${this.evolutionChain['id']}`, JSON.stringify(this.evolutions));
                  this.isLoadingEvolutionChain = false;
                });
              });
            } else {
              localStorage.setItem(`evolutions${this.evolutionChain['id']}`, JSON.stringify(this.evolutions));
              this.isLoadingEvolutionChain = false;
            }
          });
        });
      } else {
        localStorage.setItem(`evolutions${this.evolutionChain['id']}`, JSON.stringify(this.evolutions));
        this.isLoadingEvolutionChain = false;
      }
    });
  }
}
