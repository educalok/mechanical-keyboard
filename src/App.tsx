import React, {useState, useEffect, useRef, ReactNode} from 'react';
import './App.css';
import keyboardSound from './assets/keytype.mp3';

type Props = {
  children: ReactNode;
};

const useSetState = (initialState: string[] = []) => {
  const [state, setState] = useState(new Set(initialState));
  const add = (item: string) => setState((state) => new Set(state.add(item)));
  const remove = (item: string) =>
    setState((state) => {
      state.delete(item);
      return new Set(state);
    });
  return {set: state, add, remove, has: (char: string) => state.has(char)};
};

const useSound = (url: string) => {
  const sound = useRef(new Audio(url));
  return {
    play: () => sound.current.play(),
    stop: () => {
      sound.current.pause();
      sound.current.currentTime = 0;
    },
  };
};

const Key = ({char, span, active}: {char: string; span?: boolean; active: boolean}) => {
  return (
    <div className={['key', span && 'span', active && 'active'].filter(Boolean).join(' ')}>
      <div className="side" />
      <div className="top" />
      <div className="char">{char}</div>
    </div>
  );
};

const Column: React.FC<Props> = ({children}) => <div className="column">{children}</div>;

const Row: React.FC<Props> = ({children}) => <div className="row">{children}</div>;

const App = () => {
  const {play, stop} = useSound(keyboardSound);

  const {add, remove, has} = useSetState([]);

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      add(e.key);
      stop();
      play();
    });
    document.addEventListener('keyup', (e) => remove(e.key));
  }, []);

  const keys = (chars: string[], spans: boolean[] = []) => chars.map((char, i) => <Key key={char} char={char} span={spans[i] || false} active={has(char)} />);

  return (
    <div className="keyboard">
      <Column>
        <Row>{keys(['7', '8', '9'])}</Row>
        <Row>{keys(['4', '5', '6'])}</Row>
        <Row>{keys(['1', '2', '3'])}</Row>
        <Row>{keys(['0', '.'], [true, false])}</Row>
      </Column>
      <Column>{keys(['+', '-'], [true, true])}</Column>
      <div className="shade" />
      <div className="cover" />
    </div>
  );
};

export default App;
