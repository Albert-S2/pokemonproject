"use client";

export default function SwordShieldPage() {
  const bulbasaur = {
    "Pokedex Number": 1,
    "Name": "Bulbasaur",
    "Form/Variant": "Normal",
    "Type 1": "Grass",
    "Type 2": "Poison",
    "Strong Against": [
      "Water",
      "Ground",
      "Rock",
      "Fairy",
      "Grass"
    ],
    "Weak To": [
      "Fire",
      "Flying",
      "Ice",
      "Psychic"
    ],
    "Evolution Stage": "Basic",
    "Evolution Method": "Level 16",
    "Evolves From": null,
    "Evolves Into": "Ivysaur"
  };

  return (
    <div className="border p-4 max-w-lg mx-auto mt-8">
      <h1 className="text-3xl text-center mb-4">{bulbasaur.Name}</h1>
      <p><strong>Pokedex Number:</strong> {bulbasaur["Pokedex Number"]}</p>
      <p><strong>Form/Variant:</strong> {bulbasaur["Form/Variant"]}</p>
      <p><strong>Type:</strong> {bulbasaur["Type 1"]} / {bulbasaur["Type 2"]}</p>
      <p><strong>Strong Against:</strong> {bulbasaur["Strong Against"].join(", ")}</p>
      <p><strong>Weak To:</strong> {bulbasaur["Weak To"].join(", ")}</p>
      <p><strong>Evolution Stage:</strong> {bulbasaur["Evolution Stage"]}</p>
      <p><strong>Evolution Method:</strong> {bulbasaur["Evolution Method"]}</p>
      <p><strong>Evolves From:</strong> {bulbasaur["Evolves From"] || "None"}</p>
      <p><strong>Evolves Into:</strong> {bulbasaur["Evolves Into"] || "None"}</p>
    </div>
  );
}