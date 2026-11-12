import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Ocean from "@/components/ocean/Ocean";
import Fish from "@/components/ocean/Fish";
import DepthMeter from "@/components/ocean/DepthMeter";
import Surface from "@/components/sections/Surface";
import Shallows from "@/components/sections/Shallows";
import Voyage from "@/components/sections/Voyage";
import Treasures from "@/components/sections/Treasures";
import Gear from "@/components/sections/Gear";
import Abyss from "@/components/sections/Abyss";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Ocean />
      <Nav />
      <DepthMeter />
      <Fish />
      <main className="relative z-10 md:pr-12 lg:pr-20">
        <Surface />
        <Shallows />
        <Voyage />
        <Treasures />
        <Gear />
        <Abyss />
      </main>
    </>
  );
}
