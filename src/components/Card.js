import React, { useEffect, useState } from "react";
import axios from "axios";
import '../assets/styles/style.css';
import Image from "next/image";

const colours = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};

function getBackgroundColor(type) {
    return colours[type] || '';
}

function toSentenceCase(text) {
    if (typeof text !== 'string' || text.length === 0) {
        return text; 
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}



const Card = ({ pokemonName, image }) => {
    const [pokemonTypes, setPokemonTypes] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState("");

    useEffect(() => {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then((response) => {
            const types = response.data.types.map((type) => type.type.name);
            setPokemonTypes(types);

            if (types.length > 0) {
                const type = types[0].toLowerCase();
                setBackgroundColor(getBackgroundColor(type));
            }
        });
    }, [pokemonName]);

    return (
        <div className="w-100 border radius-card py-3 h-100 text-white " style={{ backgroundColor }}>
            <div className="d-flex justify-content-between">
                <div className="ps-4 set-section-left"  >
                    <div className="h5">{toSentenceCase(pokemonName)}</div>
                    {pokemonTypes.map((type, index) => (
                        <div className=" border text-center w-75 set-border-desc mt-1 mt-sm-1 py-sm-1" style={{ backgroundColor: `rgba(0, 0, 0, 0.1)` }} key={index}>{type}</div>
                    ))}
                </div>
                <div className="set-section-right">
                    <div className="w-100 float-end set-background"  >
                        <Image
                            src={image}
                            alt={pokemonName}
                            className="set-image"
                            height={100}
                            width={100}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
