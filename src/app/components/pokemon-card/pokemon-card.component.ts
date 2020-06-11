import { Component, OnInit, Input } from '@angular/core';
import { Pokemon } from 'src/app/models/pokemon.model';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent implements OnInit {
  @Input() pokemon: Pokemon;

  constructor(private pokemonService: PokemonService, private router: Router) { }

  ngOnInit(): void {
    this.pokemonService.getPokemon(this.pokemon.id).subscribe( (p: Pokemon) => {
      this.pokemon = p;
      console.log(p);
    });
  }

  seePokemon(pokemonId: number){
    this.router.navigate(['pokemon', pokemonId]);
  }
}
