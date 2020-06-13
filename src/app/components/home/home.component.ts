import { Component, OnInit, Input } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { PokemonList } from 'src/app/models/pokemon-list.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  pokemonList = new PokemonList();
  isLoading: boolean;

  constructor(private pokemonService: PokemonService) {
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.pokemonService.getPokemons().subscribe((data: PokemonList) => {
      this.pokemonList = data;
      this.isLoading = false;
    });
  }

  getPokemons(url) {
    this.isLoading = true;
    this.pokemonService.getPokemons(url).subscribe((data: PokemonList) => {
      this.pokemonList = data;
      this.isLoading = false;
    });
  }
}
