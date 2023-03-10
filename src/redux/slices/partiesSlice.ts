import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartyPnpg } from '../../types';
import type { RootState } from '../store';

interface PartiesState {
  list?: Array<PartyPnpg>;
  selected?: PartyPnpg;
  selectedPartyLogoUrl?: string;
}

const initialState: PartiesState = {};

/* eslint-disable functional/immutable-data */
export const partiesSlice = createSlice({
  name: 'parties',
  initialState,
  reducers: {
    setPartiesList: (state, action: PayloadAction<Array<PartyPnpg>>) => {
      state.list = action.payload;
    },
    setPartySelected: (state, action: PayloadAction<PartyPnpg | undefined>) => {
      state.selected = action.payload;
      state.selectedPartyLogoUrl = action.payload?.urlLogo;
    },
    setPartySelectedPartyLogo: (state, action: PayloadAction<string | undefined>) => {
      state.selectedPartyLogoUrl = `${action.payload}?${new Date()}`;
      if (state.list) {
        state.list
          .filter((p) => p.id === state.selected?.id)
          .forEach((p) => (p.urlLogo = state.selectedPartyLogoUrl));
      }
    },
  },
});

export const partiesActions = partiesSlice.actions;
export const partiesReducer = partiesSlice.reducer;

export const partiesSelectors = {
  selectPartiesList: (state: RootState): Array<PartyPnpg> | undefined => state.parties.list,
  selectPartySelected: (state: RootState): PartyPnpg | undefined => state.parties.selected,
  selectPartySelectedLogo: (state: RootState): string | undefined =>
    state.parties.selectedPartyLogoUrl,
};
