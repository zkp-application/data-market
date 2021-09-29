import { useWasm } from 'react-wasm';
// import wasm from '@/lib/lib.wasm';
// const wasm = '@/lib/bytes.wasm';
const wasm = 'https://olso.space/go-wasm-cat-game-on-canvas/game.wasm';

const importObject = {
  imports: {
    go: {
      createKey: (value) => {
        console.log(value);
      },
    },
  },
};

export const useImg = () => {
  // const res = useWasm({
  //   url: wasm,
  // });
  // fetch(wasm)
  //   .then((response) => response.arrayBuffer())
  //   .then((bytes) => WebAssembly.instantiate(bytes, importObject, { go: {} }))
  //   .then((results) => {
  //     console.log('do something', results);
  //   });
  // return res;
};
