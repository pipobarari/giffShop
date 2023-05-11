import { RootState } from '../../store';

export const selectGifs = (state: RootState) => state.gifStore.gifs;