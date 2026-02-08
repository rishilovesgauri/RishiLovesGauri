import { GameConfig } from '../types/gameSpec';
import { GameWalkDemo } from './GameWalkDemo';

type GamePlaceholderProps = {
  config?: GameConfig;
  onAccept?: () => void;
  onReject?: () => void;
};

export function GamePlaceholder(props: GamePlaceholderProps) {
  const { config, onAccept, onReject } = props;
  const width: number = config?.canvasWidth ?? 640;
  const height: number = config?.canvasHeight ?? 360;

  return (
    <div className="game-placeholder">
      <GameWalkDemo onAccept={onAccept} onReject={onReject} />
    </div>
  );
}


