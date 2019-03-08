import axios from "axios";
import { server } from "../../../utils/server";

export const getPokemons = () => {
  return {
    type: "GET_POKEMONS",
    payload: axios({
      method: "get",
      url: `${server.url}/api/v1/pokemons?page=1&perPage=10`
    })
  };
};

export const getPokemonFilter = body => {
  return {
    type: "GET_POKEMON_FILTER",
    payload: axios({
      method: "post",
      url: `${server.url}/api/v1/pokemons/filter?page=1&perPage=10`,
      data: body
    })
  };
};

export const morePokemon = page => {
  return {
    type: "MORE_POKEMON",
    payload: axios({
      method: "get",
      url: `${server.url}/api/v1/pokemons?page=${page}&perPage=10`
    })
  };
};

export const morePokemonFilter = page => {
  return {
    type: "MORE_POKEMON_FILTER",
    payload: axios({
      method: "get",
      url: `${server.url}/api/v1/pokemons/filter?page=${page}&perPage=10`
    })
  };
};

export const searchPokemon = body => {
  return {
    type: "SEARCH_POKEMON",
    payload: axios({
      method: "get",
      url: `${server.url}/api/v1/pokemons?search=${body}&page=1&perPage=10`
    })
  };
};

export const getPokemon = id => {
  return {
    type: "GET_POKEMON",
    payload: axios({
      method: "get",
      url: `${server.url}/api/v1/pokemons/${id}`
    })
  };
};

export const storePokemon = (body, token) => {
  return {
    type: "STORE_POKEMON",
    payload: axios({
      method: "post",
      url: `${server.url}/api/v1/pokemons`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const updatePokemon = (body, token, id) => {
  return {
    type: "UPDATE_POKEMON",
    payload: axios({
      method: "put",
      url: `${server.url}/api/v1/pokemons/${id}`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const deletePokemon = (token, id) => {
  return {
    type: "DELETE_POKEMON",
    payload: axios({
      method: "delete",
      url: `${server.url}/api/v1/pokemons/${id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};
