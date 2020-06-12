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
      this.getPokemonSpecies(this.pokemon.id);
    });
  }

  getPokemon(pokemonId: number) {
    this.pokemonService.getPokemon(pokemonId).subscribe((p: Pokemon) => {
      this.pokemon = p;
    });
  }

  getPokemonSpecies(pokemonId: number) {
    this.pokemonService.getPokemonSpecies(pokemonId).subscribe((p: PokemonSpecies) => {
      this.pokemonSpecies = p;
      this.getEvolutionChain();
    });
  }

  getEvolutionChain() {
    const evolutionChainParts = this.pokemonSpecies['evolution_chain']['url'].split('/');
    const evolutionChainId = evolutionChainParts[evolutionChainParts.length - 2];
    this.pokemonService.getEvolutionChain(evolutionChainId).subscribe(resp => {
      this.evolutionChain = resp;
      this.loadEvolutions();
      this.isLoading = false;
    });
  }

  loadEvolutions() {
    this.pokemonService.getPokemonByUrl(this.evolutionChain['chain']['species']['url']).subscribe((p: Pokemon) => {
      this.evolutions.push(p);
      this.evolutionChain['chain']['evolves_to'].forEach(element => {
        this.pokemonService.getPokemonByUrl(element['species']['url']).subscribe((p: Pokemon) => {
          this.evolutions.push(p);
          element['evolves_to'].forEach(element2 => {
            this.pokemonService.getPokemonByUrl(element2['species']['url']).subscribe((p2: Pokemon) => {
              this.evolutions.push(p2);
              this.isLoadingEvolutionChain = false;
            });
          });
        });
      });
    });
    
  }
}
