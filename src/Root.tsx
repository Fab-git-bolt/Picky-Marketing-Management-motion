import { Composition } from "remotion";
import { FORMATS, type Format } from "./brand/formats";
import { DURATION_IN_FRAMES, FPS } from "./brand/tokens";
import type { Angle } from "./copy";
import { PickyAd, type PickyAdProps } from "./PickyAd";

const ANGLES: Angle[] = ["manque-a-gagner", "revenu-sans-risque"];
const FORMAT_LIST: Format[] = ["4:5", "1:1", "9:16"];

/**
 * Une composition par angle × format, ID « <angle>-<format> »
 * (ex. manque-a-gagner-4x5). Les props restent modifiables au rendu :
 *   npx remotion render manque-a-gagner-4x5 out/x.mp4 --props='{"lang":"fr"}'
 * Les dimensions suivent toujours la prop `format`.
 */
export const RemotionRoot: React.FC = () => (
  <>
    {ANGLES.flatMap((angle) =>
      FORMAT_LIST.map((format) => {
        const spec = FORMATS[format];
        const defaultProps: PickyAdProps = { angle, format, lang: "fr" };
        return (
          <Composition
            key={`${angle}-${spec.slug}`}
            id={`${angle}-${spec.slug}`}
            component={PickyAd}
            durationInFrames={DURATION_IN_FRAMES}
            fps={FPS}
            width={spec.width}
            height={spec.height}
            defaultProps={defaultProps}
            calculateMetadata={({ props }) => ({
              width: FORMATS[props.format].width,
              height: FORMATS[props.format].height,
            })}
          />
        );
      }),
    )}
  </>
);
