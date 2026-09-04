import { Grain } from "@/components/Grain";
import { Shell } from "@/components/Shell";
import { Hero } from "@/components/Hero";
import { Beat } from "@/components/beats/Beat";
import { ProofStrip } from "@/components/ProofStrip";
import { Closing } from "@/components/Closing";
import { Footer } from "@/components/Footer";
import { copy } from "@/content/copy";

export default function Home() {
  return (
    <Shell>
      <Grain />
      <main className="page">
        <Hero />
        {copy.beats.map((beat, i) => (
          <Beat key={beat.name} beat={beat} side={i % 2 === 0 ? "left" : "right"} />
        ))}
        <ProofStrip />
        <Closing />
        <Footer />
      </main>
    </Shell>
  );
}
