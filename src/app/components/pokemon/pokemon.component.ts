import { Component, OnInit } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css']
})
export class PokemonComponent implements OnInit {
  pokemon: Pokemon;
  pokemonId: number;

  constructor(private pokemonService: PokemonService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe( params => {
      this.pokemonId = params['id'];
    });
  }

  ngOnInit(): void {
    this.pokemonService.getPokemon(this.pokemonId).subscribe( (p: Pokemon) => {
      this.pokemon = p;
    });
  }

}
