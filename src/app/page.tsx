import { Grain } from "@/components/Grain";
import { Shell } from "@/components/Shell";
import { Disperse } from "@/components/Disperse";
import { Scramble } from "@/components/Scramble";
import { SceneRoot } from "@/components/scene/SceneRoot";
import { Hero } from "@/components/Hero";
import { PinnedBeats } from "@/components/beats/PinnedBeats";
import { ProofStrip } from "@/components/ProofStrip";
import { Closing } from "@/components/Closing";
import { Footer } from "@/components/Footer";
import { copy } from "@/content/copy";

export default function Home() {
  return (
    <Shell>
      <SceneRoot />
      <Grain />
      <Disperse>
      <Scramble>
      <main className="page">
        <Hero />
        <PinnedBeats beats={copy.beats} />
        <ProofStrip />
        <Closing />
        <Footer />
      </main>
      </Scramble>
      </Disperse>
    </Shell>
  );
}
