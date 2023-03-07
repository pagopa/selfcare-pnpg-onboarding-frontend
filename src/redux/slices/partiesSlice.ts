import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InstitutionPnPGResource } from '../../api/generated/b4f-dashboard-pnpg/InstitutionPnPGResource';
import { InstitutionPnPGResourceArray } from '../../api/generated/b4f-dashboard-pnpg/InstitutionPnPGResourceArray';
import type { RootState } from '../store';

interface PartiesState {
  list?: InstitutionPnPGResourceArray;
  selected?: InstitutionPnPGResource;
  selectedPartyLogoUrl?: string;
}

const initialState: PartiesState = {};

/* eslint-disable functional/immutable-data */
export const partiesSlice = createSlice({
  name: 'parties',
  initialState,
  reducers: {
    setPartiesList: (state, action: PayloadAction<InstitutionPnPGResourceArray>) => {
      state.list = action.payload;
    },
    setPartySelected: (state, action: PayloadAction<InstitutionPnPGResource | undefined>) => {
      state.selected = action.payload;
      // state.selectedPartyLogoUrl = action.payload?.urlLogo;   // TODO urlLogo
    },
    setPartySelectedPartyLogo: (state, action: PayloadAction<string | undefined>) => {
      state.selectedPartyLogoUrl = `${action.payload}?${new Date()}`;
      /* if (state.list) {
        state.list.filter((p) => p.id === state.selected?.id).forEach((p) => p).forEach((p) => (p.urlLogo = state.selectedPartyLogoUrl)); // TODO urlLogo
      } */
    },
  },
});

export const partiesActions = partiesSlice.actions;
export const partiesReducer = partiesSlice.reducer;

export const partiesSelectors = {
  selectPartiesList: (state: RootState): InstitutionPnPGResourceArray | undefined =>
    state.parties.list,
  selectPartySelected: (state: RootState): InstitutionPnPGResource | undefined =>
    state.parties.selected,
  selectPartySelectedLogo: (state: RootState): string | undefined =>
    state.parties.selectedPartyLogoUrl,
};
