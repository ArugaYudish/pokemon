import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/styles/style.css';
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

function getRandomBackgroundColor() {
    const colorKeys = Object.keys(colours);
    const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    return colours[randomColorKey];
}

function toSentenceCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function Detail({ pokemonDetail }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('about');
    const [evolutions, setEvolutions] = useState([]);
    const { name, types, species, height, weight, abilities, stats, moves, id } = pokemonDetail;
    const backgroundColor = types.length > 0 ? getBackgroundColor(types[0].type.name.toLowerCase()) : 'defaultColor';

    useEffect(() => {
        async function fetchPokemonEvolution(pokemonId) {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/${pokemonId}/`);
                const evolutionData = response.data;
                setEvolutions(evolutionData);
            } catch (error) {
                console.error('Error fetching Pokemon evolution:', error);
            }
        }

        if (pokemonDetail.id) {
            fetchPokemonEvolution(pokemonDetail.id);
        }
    }, [pokemonDetail.id]);

    const [triggerData, setTriggerData] = useState(null);

    const fetchTriggerData = async (triggerUrl) => {
        try {
            const response = await axios.get(triggerUrl);
            setTriggerData(response.data);
        } catch (error) {
            console.error("Failed to fetch trigger data:", error);
        }
    };

    useEffect(() => {
        if (evolutions && evolutions.chain && evolutions.chain.evolves_to) {
            evolutions.chain.evolves_to.forEach((evolvesTo) => {
                evolvesTo.evolution_details.forEach((evolutionDetail) => {
                    if (evolutionDetail.trigger.url) {
                        fetchTriggerData(evolutionDetail.trigger.url);
                    }
                });
            });
        }
    }, [evolutions]);

    return (
        <div className="" style={{ backgroundColor: backgroundColor }}>
            <div className="pokemon-detail">
                <div className="container text-white">
                    <div className="d-flex justify-content-between pt-4">
                        <div>
                            <div>
                                <div className="h1">{toSentenceCase(name)}</div>
                                <div className="d-flex">
                                    {types.map((type, index) => (
                                        <div
                                            key={index}
                                            className="border set-border-desc px-4 py-1 me-2"
                                            style={{ backgroundColor: `rgba(0, 0, 0, 0.1)` }}
                                        >
                                            {type.type.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="d-none d-sm-block d-flex justify-content-center align-items-center">
                            <Image className="set-background" src={pokemonDetail.sprites.front_default} alt={name} height={150} />
                        </div>
                        <div className="my-auto fw-bold">#{id}</div>
                    </div>
                    <div className="d-block d-sm-none d-flex justify-content-center align-items-center">
                        <Image className="set-background set-image-detail" src={pokemonDetail.sprites.front_default} alt={name} height={150} />
                    </div>
                </div>
            </div>
            <div className="border-top detail-radius bg-white">
                <div className="container py-3 px-3 px-sm-0">
                    <ul className="nav nav-underline d-flex justify-content-between border-bottom">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                                style={{ color: activeTab === 'about' ? 'black' : 'grey' }}
                                onClick={() => setActiveTab('about')}
                            >
                                About
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'baseStats' ? 'active' : ''}`}
                                style={{ color: activeTab === 'baseStats' ? 'black' : 'grey' }}
                                onClick={() => setActiveTab('baseStats')}
                            >
                                Base Stats
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'evolution' ? 'active' : ''}`}
                                style={{ color: activeTab === 'evolution' ? 'black' : 'grey' }}
                                onClick={() => setActiveTab('evolution')}
                            >
                                Evolution
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'moves' ? 'active' : ''}`}
                                style={{ color: activeTab === 'moves' ? 'black' : 'grey' }}
                                onClick={() => setActiveTab('moves')}
                            >
                                Moves
                            </a>
                        </li>
                    </ul>
                    <div className="py-2">
                        {activeTab === 'about' && (
                            <div >
                                <div className="row py-1">
                                    <div className="col-3 col-sm-1" >Species</div>
                                    <div className="col-9 col-sm-11 fw-bolder" >  {toSentenceCase(pokemonDetail.species.name)}</div>

                                </div>
                                <div className="row py-1"  >
                                    <div className="col-3 col-sm-1" > Height</div>
                                    <div className="col-9 col-sm-11 fw-bolder"> {pokemonDetail.height} cm</div>
                                </div>

                                <div className="row py-1"  >
                                    <div className="col-3 col-sm-1" > Weight</div>
                                    <div className="col-9 col-sm-11 fw-bolder"> {pokemonDetail.weight} kg</div>
                                </div>

                                <div className="row py-1"  >
                                    <div className="col-3 col-sm-1" > Abilities</div>
                                    <div className="col-9 col-sm-11 fw-bolder"> {toSentenceCase(pokemonDetail.abilities.map((ability) => toSentenceCase(ability.ability.name)).join(', '))}</div>
                                </div>


                            </div>
                        )}

                        {activeTab === 'baseStats' && (
                            <div>
                                <div>
                                    {pokemonDetail.stats.map((stat) => {
                                        const percentage = (stat.base_stat / 255) * 100;
                                        const statName = stat.stat.name
                                            .replace("special-attack", "sp-atk")
                                            .replace("special-defense", "sp-def");
                                        return (
                                            <div key={stat.stat.name} className="row" >
                                                <div className="col-3 col-sm-1 py-1" >
                                                    {toSentenceCase(statName)}
                                                </div>
                                                <div className="col-2 col-sm-1 py-1 fw-bolder" >
                                                    {stat.base_stat}
                                                </div>
                                                <div className="progress col-7  col-sm-10 my-auto" style={{ height: `5px` }}>
                                                    <div
                                                        className="progress-bar bg-success "
                                                        role="progressbar"
                                                        aria-valuenow={stat.base_stat}
                                                        aria-valuemin="0"
                                                        aria-valuemax="255"
                                                        style={{ width: `${percentage}%` }}
                                                    >
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}


                        {activeTab === 'evolution' && (
                            <div>
                                {evolutions &&
                                    evolutions.chain &&
                                    evolutions.chain.evolves_to.map((evolvesTo, evolvesToIndex) => (
                                        <div key={evolvesToIndex}>

                                            <div className="py-1" >
                                                <div className="border set-border-desc px-4 py-1 text-white" style={{ display: 'inline-block', backgroundColor: '#A98FF3' }} >
                                                    {toSentenceCase(evolvesTo.species.name)}
                                                </div>
                                            </div>
                                            {evolvesTo.evolves_to.map((innerEvolvesTo, innerEvolvesToIndex) => (
                                                <div className="border set-border-desc px-4 py-1 my-2 text-white" style={{ display: 'inline-block', backgroundColor: '#6390F0' }} key={innerEvolvesToIndex}>
                                                    <div className="" >{toSentenceCase(innerEvolvesTo.species.name)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                            </div>
                        )}

                        {activeTab === 'moves' && (
                            <div>
                                {pokemonDetail.moves.slice(0, 6).map((move) => (
                                    <div key={move.move.name} className="border set-border-desc px-4 py-1 my-1 text-white" style={{ backgroundColor: getRandomBackgroundColor(), display: 'inline-block' }}>
                                        {toSentenceCase(move.move.name)}
                                        {move.move.image && (
                                            <Image src={move.move.image} alt={move.move.name} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div >
    );
}

export async function getServerSideProps({ params }) {
    const { pokemonName } = params;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = response.data;
    return {
        props: { pokemonDetail: data },
    };
}

export default Detail;


// import React, { useEffect, useState } from "react";
// import { useRouter } from 'next/router';
// import axios from "axios";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../assets/styles/style.css';

// const colours = {
//     normal: '#A8A77A',
//     fire: '#EE8130',
//     water: '#6390F0',
//     electric: '#F7D02C',
//     grass: '#7AC74C',
//     ice: '#96D9D6',
//     fighting: '#C22E28',
//     poison: '#A33EA1',
//     ground: '#E2BF65',
//     flying: '#A98FF3',
//     psychic: '#F95587',
//     bug: '#A6B91A',
//     rock: '#B6A136',
//     ghost: '#735797',
//     dragon: '#6F35FC',
//     dark: '#705746',
//     steel: '#B7B7CE',
//     fairy: '#D685AD',
// };

// function getBackgroundColor(type) {
//     return colours[type] || '';
// }
// function getRandomBackgroundColor() {
//     const colorKeys = Object.keys(colours);
//     const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
//     return colours[randomColorKey];
// }
// const randomBackgroundColor = getRandomBackgroundColor();


// function toSentenceCase(text) {
//     return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
// }


// function Detail({ pokemonDetail }) {
//     const router = useRouter();
//     const [activeTab, setActiveTab] = useState('about');
//     const [evolutions, setEvolutions] = useState([]);
//     const { name, types, species, height, weight, abilities, stats, moves, id } = pokemonDetail;
//     const backgroundColor = types.length > 0 ? getBackgroundColor(types[0].type.name.toLowerCase()) : 'defaultColor';



//     if (router.isFallback) {
//         return <div>Loading...</div>;
//     }

//     useEffect(() => {
//         async function fetchPokemonEvolution(pokemonId) {
//             try {
//                 const response = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/${pokemonId}/`);
//                 const evolutionData = response.data;
//                 setEvolutions(evolutionData);
//             } catch (error) {
//                 console.error('Error fetching Pokemon evolution:', error);
//             }
//         }

//         fetchPokemonEvolution(pokemonDetail.id);
//     }, [pokemonDetail.id]);

//     const [triggerData, setTriggerData] = useState(null);

//     const fetchTriggerData = async (triggerUrl) => {
//         try {
//             const response = await axios.get(triggerUrl);
//             setTriggerData(response.data);
//         } catch (error) {
//             console.error("Failed to fetch trigger data:", error);
//         }
//     };

//     useEffect(() => {
//         if (evolutions && evolutions.chain && evolutions.chain.evolves_to) {
//             evolutions.chain.evolves_to.forEach((evolvesTo) => {
//                 evolvesTo.evolution_details.forEach((evolutionDetail) => {
//                     if (evolutionDetail.trigger.url) {
//                         fetchTriggerData(evolutionDetail.trigger.url);
//                     }
//                 });
//             });
//         }
//     }, [evolutions]);


//     return (


//         <div className="" style={{ backgroundColor: backgroundColor }}>

//             <div className="pokemon-detail" >

//                 <div className="container text-white " >
//                     <div className="d-flex justify-content-between pt-4" >
//                         <div>
//                             <div>
//                                 <div className="h1" > {toSentenceCase(name)}</div>
//                                 <div className="d-flex" >
//                                     {types.map((type) => (
//                                         <div className="border  set-border-desc px-4 py-1 me-2 " style={{ backgroundColor: `rgba(0, 0, 0, 0.1)` }} >
//                                             {type.type.name}
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="d-none d-sm-block d-flex justify-content-center align-items-center ">
//                             <img className="set-background" src={pokemonDetail.sprites.front_default} alt={name} height={150} />
//                         </div>

//                         <div className="my-auto fw-bold" >#{id}</div>

//                     </div>

//                     <div className="d-block d-sm-none d-flex justify-content-center align-items-center ">
//                         <img className="set-background set-image-detail" src={pokemonDetail.sprites.front_default} alt={name} height={150} />
//                     </div>

//                 </div>

//             </div>
//             <div className="border-top detail-radius bg-white ">
//                 <div className="container py-3 px-3 px-sm-0 " >
//                     <ul className="nav nav-underline d-flex justify-content-between border-bottom">
//                         <li className="nav-item">
//                             <a
//                                 className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
//                                 style={{ color: activeTab === 'about' ? 'black' : 'grey' }}
//                                 onClick={() => setActiveTab('about')}
//                             >
//                                 About
//                             </a>
//                         </li>

//                         <li className="nav-item">
//                             <a
//                                 className={`nav-link ${activeTab === 'baseStats' ? 'active' : ''}`}
//                                 style={{ color: activeTab === 'baseStats' ? 'black' : 'grey' }}
//                                 onClick={() => setActiveTab('baseStats')}
//                             >
//                                 Base Stats
//                             </a>
//                         </li>

//                         <li className="nav-item">
//                             <a
//                                 className={`nav-link ${activeTab === 'evolution' ? 'active' : ''}`}
//                                 style={{ color: activeTab === 'evolution' ? 'black' : 'grey' }}
//                                 onClick={() => setActiveTab('evolution')}
//                             >
//                                 Evolution
//                             </a>
//                         </li>

//                         <li className="nav-item">
//                             <a
//                                 className={`nav-link ${activeTab === 'moves' ? 'active' : ''}`}
//                                 style={{ color: activeTab === 'moves' ? 'black' : 'grey' }}
//                                 onClick={() => setActiveTab('moves')}
//                             >
//                                 Moves
//                             </a>
//                         </li>
//                     </ul>


//                     <div className="py-2" >

//                         {activeTab === 'about' && (
//                             <div >
//                                 <div className="row py-1">
//                                     <div className="col-3 col-sm-1" >Species</div>
//                                     <div className="col-9 col-sm-11 fw-bolder" >  {toSentenceCase(pokemonDetail.species.name)}</div>

//                                 </div>
//                                 <div className="row py-1"  >
//                                     <div className="col-3 col-sm-1" > Height</div>
//                                     <div className="col-9 col-sm-11 fw-bolder"> {pokemonDetail.height} cm</div>
//                                 </div>

//                                 <div className="row py-1"  >
//                                     <div className="col-3 col-sm-1" > Weight</div>
//                                     <div className="col-9 col-sm-11 fw-bolder"> {pokemonDetail.weight} kg</div>
//                                 </div>

//                                 <div className="row py-1"  >
//                                     <div className="col-3 col-sm-1" > Abilities</div>
//                                     <div className="col-9 col-sm-11 fw-bolder"> {toSentenceCase(pokemonDetail.abilities.map((ability) => toSentenceCase(ability.ability.name)).join(', '))}</div>
//                                 </div>


//                             </div>
//                         )}

//                         {activeTab === 'baseStats' && (
//                             <div>
//                                 <div>
//                                     {pokemonDetail.stats.map((stat) => {
//                                         const percentage = (stat.base_stat / 255) * 100;
//                                         const statName = stat.stat.name
//                                             .replace("special-attack", "sp-atk")
//                                             .replace("special-defense", "sp-def");
//                                         return (
//                                             <div key={stat.stat.name} className="row" >
//                                                 <div className="col-3 col-sm-1 py-1" >
//                                                     {toSentenceCase(statName)}
//                                                 </div>
//                                                 <div className="col-2 col-sm-1 py-1 fw-bolder" >
//                                                     {stat.base_stat}
//                                                 </div>
//                                                 <div className="progress col-7  col-sm-10 my-auto" style={{ height: `5px` }}>
//                                                     <div
//                                                         className="progress-bar bg-success "
//                                                         role="progressbar"
//                                                         aria-valuenow={stat.base_stat}
//                                                         aria-valuemin="0"
//                                                         aria-valuemax="255"
//                                                         style={{ width: `${percentage}%` }}
//                                                     >
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 </div>
//                             </div>
//                         )}


//                         {activeTab === 'evolution' && (
//                             <div>
//                                 {evolutions &&
//                                     evolutions.chain &&
//                                     evolutions.chain.evolves_to.map((evolvesTo, evolvesToIndex) => (
//                                         <div key={evolvesToIndex}>

//                                             <div className="py-1" >
//                                                 <div className="border set-border-desc px-4 py-1 text-white" style={{ display: 'inline-block', backgroundColor: '#A98FF3' }} >
//                                                     {toSentenceCase(evolvesTo.species.name)}
//                                                 </div>
//                                             </div>
//                                             {evolvesTo.evolves_to.map((innerEvolvesTo, innerEvolvesToIndex) => (
//                                                 <div className="border set-border-desc px-4 py-1 my-2 text-white" style={{ display: 'inline-block', backgroundColor: '#6390F0' }} key={innerEvolvesToIndex}>
//                                                     <div className="" >{toSentenceCase(innerEvolvesTo.species.name)}</div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     ))}
//                             </div>
//                         )}

//                         {activeTab === 'moves' && (
//                             <div>
//                                 {pokemonDetail.moves.slice(0, 6).map((move) => (
//                                     <div>
//                                         <div className="border set-border-desc px-4 py-1 my-1 text-white" style={{ backgroundColor: getRandomBackgroundColor(), display: 'inline-block' }} key={move.move.name}>
//                                             {toSentenceCase(move.move.name)}
//                                             {move.move.image && (
//                                                 <img src={move.move.image} alt={move.move.name} />
//                                             )}
//                                         </div>
//                                     </div>

//                                 ))}
//                             </div>
//                         )}

//                     </div>
//                 </div>

//             </div>





//             {/* Tampilkan informasi lainnya seperti statistik dasar, evolusi, dan gerakan */}
//         </div >
//     );
// }

// export async function getServerSideProps({ params }) {
//     const { pokemonName } = params;
//     const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
//     const data = response.data;
//     return {
//         props: { pokemonDetail: data },
//     };
// }

// export default Detail; // Pastikan Anda mengekspor komponen React ini sebagai ekspor default
