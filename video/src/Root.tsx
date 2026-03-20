import React from "react";
import { Composition } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { FPS, H, SCENE_FRAMES, TOTAL_FRAMES, TRANS_FRAMES, W } from "./constants";

const Main: React.FC = () => {
  return (
    <>
      <Audio src={staticFile("music.wav")} volume={0.3} loop />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
          <Scene1 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
          <Scene2 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
          <Scene3 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
          <Scene4 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
          <Scene5 />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AIAgentsExplainer"
      component={Main}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};
