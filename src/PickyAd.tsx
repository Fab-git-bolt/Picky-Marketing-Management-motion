import { Sequence } from "remotion";
import "./brand/fonts";
import type { Format } from "./brand/formats";
import type { Angle, Lang } from "./copy";
import { getCopy } from "./copy";
import { Soundtrack } from "./audio/Soundtrack";
import { Frame } from "./components/Frame";
import { SceneCounter } from "./components/SceneCounter";
import { SceneFade } from "./scenes/SceneFade";
import { EndScene, HookScene, LabelsScene, ProblemScene, PromiseScene, SpecScene } from "./scenes/Scenes";
import { TIMELINE } from "./scenes/timeline";

export type PickyAdProps = {
  angle: Angle;
  format: Format;
  lang: Lang;
};

/** Gabarit commun : même découpage, textes selon l'angle et la langue. */
export const PickyAd: React.FC<PickyAdProps> = ({ angle, format, lang }) => {
  const { story, bricks } = getCopy(lang, angle);
  const scene = (key: keyof typeof TIMELINE, node: React.ReactNode, exit = true) => (
    <Sequence key={key} name={key} from={TIMELINE[key].from} durationInFrames={TIMELINE[key].duration}>
      <SceneFade duration={TIMELINE[key].duration} exit={exit}>
        {node}
      </SceneFade>
    </Sequence>
  );
  return (
    <Frame format={format}>
      <Soundtrack story={story} />
      <SceneCounter />
      {scene("hook", <HookScene story={story} />)}
      {scene("problem", <ProblemScene story={story} />)}
      {scene("spec", <SpecScene story={story} bricks={bricks} />)}
      {scene("promise", <PromiseScene story={story} />)}
      {scene("labels", <LabelsScene story={story} />)}
      {scene("end", <EndScene story={story} />, false)}
    </Frame>
  );
};
