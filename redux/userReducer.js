import { createReducer } from "@reduxjs/toolkit";
import {
  registerUser,
  addTracker,
  updateLocation,
  getFollowingLocations,
  toggleVisibility,
  addZone,
  deleteZone,
  getLog,
  loadUser,
  deleteTracker,
  createSubscription,
  getSubscription,
} from "./userActions";

export const userReducer = createReducer(
  {
    user: {},
    followingLocations: [],
    logs: [],
    zones: [],
    code: "",
    deviceId: "", 
    loading: false,
    error: null,
    subscription: null,
  },
  (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.code = action.payload.code;
        state.deviceId = action.payload.deviceId;
        state.zones = action.payload.zones;
        state.logs = action.payload.logs;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.code = action.payload.code;
        state.zones = action.payload.zones;
        state.logs = action.payload.logs;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTracker.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTracker.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(addTracker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTracker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTracker.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(deleteTracker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFollowingLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFollowingLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.followingLocations = action.payload;
      })
      .addCase(getFollowingLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleVisibility.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleVisibility.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(toggleVisibility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addZone.pending, (state) => {
        state.loading = true;
      })
      .addCase(addZone.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(addZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteZone.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteZone.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.zones = action.payload.zones;
      })
      .addCase(deleteZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLog.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(getLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(getSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
);