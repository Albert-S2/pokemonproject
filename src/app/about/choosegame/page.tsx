"use client";
import { useRouter } from 'next/navigation';

export default function ChooseGamePage() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/about/swordshield');
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <h1 className="text-3xl text-center">
        Choose Game
      </h1>
      <img src="/sword.jpg" alt="Sword and Shield" className="mt-4 w-100 h-auto " />
      <h2>Pokémon Sword / Pokémon Shield</h2>
    </div>
  );
}