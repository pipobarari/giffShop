import { DispatchType, setGifs } from "../reducers/gif-reducer/gifReducer"; 
import { gifProvider } from "../provider/gif/gif.provider";

export const startSetGif = (searchTerm: string): any => {
  return async (dispatch: DispatchType) => {
    const gifList = await gifProvider(searchTerm);

    dispatch(setGifs(gifList || []));
  };
};
