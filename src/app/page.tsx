"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";

interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

interface EvolutionDetail {
  species_name: string;
  min_level: number | null;
  trigger: string | null;
  item: string | null;
}

interface PokemonData {
  name: string;
  sprite: string;
  types: string[];
  strongAgainst: string[];
  weakTo: string[];
  evolutions: EvolutionDetail[];
}

// Simple color mapping for Pokémon types
const typeColors: Record<string, string> = {
  grass: "#78C850",
  poison: "#A040A0",
  fire: "#F08030",
  water: "#6890F0",
  bug: "#A8B820",
  normal: "#A8A878",
  flying: "#A890F0",
  electric: "#F8D030",
  ground: "#E0C068",
  fairy: "#EE99AC",
  fighting: "#C03028",
  psychic: "#F85888",
  rock: "#B8A038",
  steel: "#B8B8D0",
  ice: "#98D8D8",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
};

export default function PokemonSearchPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // <-- Start empty
  const [data, setData] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setData(null);
      setError("");
      setLoading(false);
      return;
    }
    async function fetchPokemonData() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
        if (!res.ok) throw new Error("Pokémon not found");
        const pokemon = await res.json();

        const types: string[] = pokemon.types.map((t: PokemonType) => t.type.name);
        const sprite = pokemon.sprites.front_default;

        const strongAgainst: string[] = [];
        const weakTo: string[] = [];

        for (const t of types) {
          const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${t}`);
          const typeData = await typeRes.json();

          typeData.damage_relations.double_damage_to.forEach((d: { name: string }) => {
            if (!strongAgainst.includes(d.name)) strongAgainst.push(d.name);
          });

          typeData.damage_relations.double_damage_from.forEach((d: { name: string }) => {
            if (!weakTo.includes(d.name)) weakTo.push(d.name);
          });
        }

        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${query.toLowerCase()}`);
        const speciesData = await speciesRes.json();

        const evoChainRes = await fetch(speciesData.evolution_chain.url);
        const evoChainData = await evoChainRes.json();

        const evolutions: EvolutionDetail[] = [];
        let current = evoChainData.chain;
        while (current) {
          const evoDetails = current.evolution_details[0] || {};
          evolutions.push({
            species_name: current.species.name,
            min_level: evoDetails.min_level || null,
            trigger: evoDetails.trigger?.name || null,
            item: evoDetails.item?.name || null,
          });
          current = current.evolves_to[0] || null;
        }

        setData({ name: pokemon.name, sprite, types, strongAgainst, weakTo, evolutions });
      } catch (err: unknown) {
        setData(null);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch Pokémon data."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchPokemonData();
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setQuery(search.trim().toLowerCase());
    }
  };

  return (
    <div className="pokedex-bg">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/image1.jpg" />
      </Head>
      <div className="pokedex-header">
        <div className="pokedex-light blue" />
        <div className="pokedex-light white" />
        <div className="pokedex-light yellow" />
        <div className="pokedex-light green" />
        <h1 className="pokedex-title">Pokédex</h1>
      </div>
      {/* <div className="pokedex-bar" /> */}
      <div className="pokedex-main">
        <form onSubmit={handleSubmit} className="pokedex-form" autoComplete="off">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Enter Pokémon name"
            className="pokedex-input"
          />
          <button type="submit" className="pokedex-btn">
            Search
          </button>
        </form>
        <div className="pokedex-card-wrap">
          {loading && <p className="pokedex-loading">Loading...</p>}
          {error && <p className="pokedex-error">{error}</p>}
          {data && (
            <div className="pokedex-card">
              <div className="pokedex-screen" />
              <div className="pokedex-card-content">
                <Image
                  src={data.sprite}
                  alt={data.name}
                  width={120}
                  height={120}
                  className="pokedex-img"
                />
                <h2 className="pokedex-name">{data.name}</h2>
                <div className="pokedex-types">
                  {data.types.map(type => (
                    <span
                      key={type}
                      className="pokedex-type"
                      style={{ background: typeColors[type] || "#ccc" }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <div className="pokedex-section">
                  <strong className="pokedex-label">Strong Against:</strong>
                  <div className="pokedex-badges">
                    {data.strongAgainst.length > 0
                      ? data.strongAgainst.map(type => (
                          <span
                            key={type}
                            className="pokedex-badge"
                            style={{ background: typeColors[type] || "#ccc" }}
                          >
                            {type}
                          </span>
                        ))
                      : <span style={{ color: "#888" }}>None</span>
                    }
                  </div>
                </div>
                <div className="pokedex-section">
                  <strong className="pokedex-label">Weak To:</strong>
                  <div className="pokedex-badges">
                    {data.weakTo.length > 0
                      ? data.weakTo.map(type => (
                          <span
                            key={type}
                            className="pokedex-badge"
                            style={{ background: typeColors[type] || "#ccc" }}
                          >
                            {type}
                          </span>
                        ))
                      : <span style={{ color: "#888" }}>None</span>
                    }
                  </div>
                </div>
                <div className="pokedex-section">
                  <strong className="pokedex-label">Evolution Chain:</strong>
                  <ul className="pokedex-evolutions">
                    {data.evolutions.map((evo, idx) => (
                      <li key={idx}>
                        {evo.species_name}
                        {evo.min_level ? ` — Level ${evo.min_level}` : ""}
                        {evo.item ? ` — Item: ${evo.item}` : ""}
                        {evo.trigger && evo.trigger !== "level-up" ? ` — Trigger: ${evo.trigger}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .pokedex-bg {
          min-height: 100vh;
          background: #f9f9f9; /* or use #fff for pure white */
          font-family: monospace;
          padding: 0;
        }
        .pokedex-header {
          max-width: 500px;
          width: 100%;
          margin: 0 auto;
          border-radius: 18px 18px 0 0;
          background: #e3350d;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          padding: 0.7rem 1.5rem;
        }
        .pokedex-light {
          border-radius: 50%;
          border: 3px solid #fff;
          margin-right: 1rem;
          box-shadow: 0 0 8px #7fc7ff;
        }
        .pokedex-light.blue {
          width: 32px;
          height: 32px;
          background: radial-gradient(circle at 10px 10px, #7fc7ff 60%, #2a5c7f 100%);
        }
        .pokedex-light.white {
          width: 16px;
          height: 16px;
          background: #fff;
          border: 2px solid #333;
          margin-right: 0.5rem;
        }
        .pokedex-light.yellow {
          width: 16px;
          height: 16px;
          background: #f7d51d;
          border: 2px solid #333;
          margin-right: 0.5rem;
        }
        .pokedex-light.green {
          width: 16px;
          height: 16px;
          background: #4fc16e;
          border: 2px solid #333;
        }
        .pokedex-title {
          color: #fff;
          font-weight: bold;
          font-size: 2rem;
          margin-left: auto;
          letter-spacing: 2px;
          text-shadow: 1px 1px 4px #333;
        }
        .pokedex-bar {
          max-width: 500px;
          width: 100%;
          margin: 0 auto;
          background: #e3350d;
          height: 40px;
          border-radius: 0 0 18px 18px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.12);
        }
        .pokedex-main {
          max-width: 400px;
          width: 100%;
          margin: 2rem auto 0 auto;
          padding: 0; /* Remove horizontal padding */
        }
        .pokedex-form {
          display: flex;
          margin-bottom: 2rem;
          width: 100%;
        }
        .pokedex-input {
          padding: 0.75rem 1rem;
          font-size: 1.2rem;
          border-radius: 8px 0 0 8px;
          border: 2px solid #e3350d;
          outline: none;
          flex: 1;
          background: #fff;
        }
        .pokedex-btn {
          padding: 0.75rem 1.5rem;
          font-size: 1.2rem;
          border-radius: 0 8px 8px 0;
          border: 2px solid #e3350d;
          background: #e3350d;
          color: #fff;
          cursor: pointer;
          font-weight: bold;
        }
        .pokedex-card-wrap {
          width: 100%;
        }
        .pokedex-card {
          background: linear-gradient(135deg, #f7f7f7 80%, #e3350d 100%);
          border-radius: 0 0 18px 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          padding: 2rem;
          width: 100%;
          text-align: center;
          border: 3px solid #e3350d;
          position: relative;
          min-height: 350px;
        }
        .pokedex-screen {
          position: absolute;
          top: 1rem;
          left: 1rem;
          right: 1rem;
          bottom: 1rem;
          background: rgba(44, 62, 80, 0.07);
          border-radius: 12px;
          z-index: 0;
        }
        .pokedex-card-content {
          position: relative;
          z-index: 1;
        }
        .pokedex-img {
          width: 120px;
          height: 120px;
          margin-bottom: 1rem;
          border: 2px solid #e3350d;
          border-radius: 50%;
          background: #f7f7f7;
        }
        .pokedex-name {
          font-size: 2rem;
          font-weight: bold;
          color: #111; /* Change from #e3350d to black */
          margin-bottom: 0.5rem;
          text-transform: capitalize;
          text-shadow: 1px 1px 4px #333;
        }
        .pokedex-types {
          margin-bottom: 1rem;
        }
        .pokedex-type {
          display: inline-block;
          color: #fff;
          border-radius: 12px;
          padding: 0.3rem 1rem;
          margin: 0 0.3rem 0.3rem 0;
          font-weight: bold;
          font-size: 1rem;
          text-transform: capitalize;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .pokedex-section {
          text-align: left;
          margin-bottom: 1rem;
        }
        .pokedex-label {
          color: #e3350d;
          font-weight: bold;
          display: block;
          margin-bottom: 0.2rem;
        }
        .pokedex-badges {
          margin-top: 0.3rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .pokedex-badge {
          background: #ccc;
          color: #fff;
          border-radius: 8px;
          padding: 0.2rem 0.7rem;
          font-size: 0.95rem;
          text-transform: capitalize;
          box-shadow: 0 1px 4px rgba(0,0,0,0.10);
        }
        .pokedex-evolutions {
          margin: 0.5rem 0 0 1rem;
          padding: 0;
          list-style: disc;
        }
        .pokedex-loading {
          font-size: 1.2rem;
        }
        .pokedex-error {
          color: #e3350d;
          font-weight: bold;
          font-size: 1.2rem;
        }
        @media (max-width: 600px) {
          .pokedex-bg {
            background: #e3350d;
          }
          /* Custom scrollbar for mobile */
          .pokedex-bg::-webkit-scrollbar {
            width: 8px;
            background: #e3350d;
          }
          .pokedex-bg::-webkit-scrollbar-thumb {
            background: #f9f9f9;
            border-radius: 8px;
          }
          .pokedex-bg {
            scrollbar-color: #f9f9f9 #e3350d;
            scrollbar-width: thin;
          }
          .pokedex-header,
          .pokedex-bar {
            max-width: 100vw;
            border-radius: 0;
          }
          .pokedex-main {
            max-width: 100vw;
            margin: 2rem auto 0 auto;
            padding: 0; /* Remove horizontal padding */
          }
          .pokedex-card {
            padding: 1rem;
            min-height: 250px;
          }
          .pokedex-img {
            width: 80px;
            height: 80px;
          }
          .pokedex-name {
            font-size: 1.3rem;
          }
          .pokedex-type {
            font-size: 0.9rem;
            padding: 0.2rem 0.7rem;
          }
          .pokedex-badge {
            font-size: 0.85rem;
            padding: 0.15rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
