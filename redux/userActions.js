import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../config";

// Register User
export const registerUser = createAsyncThunk(
  "user/register",
  async ({ deviceId,pushToken }, thunkAPI) => {
    try {
      const response = await axios.post(`${server}/user/register`, {
        deviceId,
        pushToken
      });
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Load User
export const loadUser = createAsyncThunk(
  "user/load",
  async ({ deviceId }, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/user/load-user/${deviceId}`);
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Add Tracker
export const addTracker = createAsyncThunk(
  "user/addTracker",
  async ({ deviceId, code, nickname }, thunkAPI) => {
    try {
      const response = await axios.post(`${server}/user/add-tracker`, {
        deviceId,
        code,
        nickname,
      });
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Delete Tracker
export const deleteTracker = createAsyncThunk(
  "user/deleteTracker",
  async ({ deviceId, trackerId }, thunkAPI) => {
    try {
      const response = await axios.post(`${server}/user/delete-tracker`, {
        deviceId,
        trackerId,
      });
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Update Location
export const updateLocation = createAsyncThunk(
  "user/updateLocation",
  async ({ deviceId, latitude, longitude }, thunkAPI) => {
    try {
      const response = await axios.put(`${server}/user/update-location`, {
        deviceId,
        latitude,
        longitude,
      });
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Get Following Locations
export const getFollowingLocations = createAsyncThunk(
  "user/getFollowingLocations",
  async ({ deviceId }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${server}/user/following-locations/${deviceId}`
      );
      return response.data.followingLocations;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Toggle Visibility
export const toggleVisibility = createAsyncThunk(
  "user/toggleVisibility",
  async ({ deviceId, visibility }, thunkAPI) => {
    try {
      const response = await axios.patch(`${server}/user/toggle-visibility`, {
        deviceId,
        visibility,
      });
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Add Zone
export const addZone = createAsyncThunk(
  "user/addZone",
  async ({ deviceId, title, latitude, longitude, zoneRadius }, thunkAPI) => {
    try {
      const response = await axios.post(`${server}/user/add-zone`, {
        deviceId,
        title,
        latitude,
        longitude,
        zoneRadius,
      });
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Delete Zone
export const deleteZone = createAsyncThunk(
  "user/deleteZone",
  async ({ deviceId, zoneId }, thunkAPI) => {
    try {
      const response = await axios.delete(`${server}/user/delete-zone`, {
        data: { deviceId, zoneId },
      });
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Get Log
export const getLog = createAsyncThunk(
  "user/getLog",
  async ({ deviceId }, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/user/get-log`, {
        params: { deviceId },
      });
      return response.data.followingLogs;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Create Subscription
export const createSubscription = createAsyncThunk(
  "user/createSubscription",
  async ({ deviceId, paymentId, paymentStore, expirationDate, lastPaymentDate,packageName }, thunkAPI) => {
    console.log(deviceId, paymentId, paymentStore, expirationDate, lastPaymentDate,packageName)
    try {
      const response = await axios.post(`${server}/user/create-subscription`, {
        deviceId,
        paymentId,
        paymentStore,
        expirationDate,
        lastPaymentDate,
        packageName
      });
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

// Get Subscription
export const getSubscription = createAsyncThunk(
  "user/getSubscription",
  async ({ deviceId }, thunkAPI) => {
    try {
      const response = await axios.get(`${server}/user/get-subscription/${deviceId}`);
      return response.data.subscription;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);
