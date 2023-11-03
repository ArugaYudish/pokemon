import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import '../assets/styles/style.css';

function Index({ pokemonData }) {
    return (
        <div className="container py-4">
            <div className="h2 text-black fw-bold ">Pokedex</div>
            <div className="row">
                {pokemonData.map((pokemon, index) => (
                    <div key={index} className="col-6 col-sm-4 col-lg-3 my-2">
                        <Link className="text-decoration-none text-white"  href={`/detail/${pokemon.name}`} passHref>
                            <Card
                                pokemonName={pokemon.name}
                                image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export async function getServerSideProps() {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=32");
    const data = response.data.results;
    return {
        props: { pokemonData: data },
    };
}

export default Index;
