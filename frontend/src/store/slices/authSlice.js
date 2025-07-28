import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (credentials.email && credentials.password) {
            resolve({
              user: {
                id: 1,
                name: 'John Doe',
                email: credentials.email,
                avatar: 'https://via.placeholder.com/150'
              },
              token: 'mock-jwt-token'
            });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1000);
      });

      // Store token in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (userData.email && userData.password) {
            resolve({
              user: {
                id: 1,
                name: `${userData.firstName} ${userData.lastName}`,
                email: userData.email,
                avatar: 'https://via.placeholder.com/150'
              },
              token: 'mock-jwt-token',
              message: 'Registration successful! Please verify your email.'
            });
          } else {
            reject(new Error('Registration failed'));
          }
        }, 1000);
      });

      // Store token in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyAccount = createAsyncThunk(
  'auth/verifyAccount',
  async (verificationData, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (verificationData.otp && verificationData.otp.length === 4) {
            resolve({
              message: 'Account verified successfully!',
              user: {
                id: 1,
                name: 'John Doe',
                email: 'user@example.com',
                avatar: 'https://via.placeholder.com/150',
                verified: true
              }
            });
          } else {
            reject(new Error('Invalid verification code'));
          }
        }, 1000);
      });

      // Update user in localStorage
      const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...existingUser, verified: true }));

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resendVerificationCode = createAsyncThunk(
  'auth/resendVerificationCode',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            message: 'Verification code sent successfully!'
          });
        }, 1000);
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (emailData, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (emailData.email) {
            resolve({
              message: 'Password reset code sent to your email!'
            });
          } else {
            reject(new Error('Email is required'));
          }
        }, 1000);
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyResetCode = createAsyncThunk(
  'auth/verifyResetCode',
  async (verificationData, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (verificationData.otp && verificationData.otp.length === 4) {
            resolve({
              message: 'Code verified successfully!',
              verified: true
            });
          } else {
            reject(new Error('Invalid verification code'));
          }
        }, 1000);
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (resetData.password && resetData.confirmPassword && resetData.password === resetData.confirmPassword) {
            resolve({
              message: 'Password reset successfully!'
            });
          } else {
            reject(new Error('Passwords do not match'));
          }
        }, 1000);
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            user: {
              ...profileData,
              id: 1
            }
          });
        }, 1000);
      });

      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');

      if (token && user) {
        // Simulate token validation
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({ user, token });
          }, 500);
        });

        return response;
      } else {
        throw new Error('No valid session found');
      }
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
  success: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.success = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = 'Login successful!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Verify Account
    builder
      .addCase(verifyAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.success = action.payload.message;
      })
      .addCase(verifyAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Resend Verification Code
    builder
      .addCase(resendVerificationCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendVerificationCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(resendVerificationCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Verify Reset Code
    builder
      .addCase(verifyResetCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyResetCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(verifyResetCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.success = 'Profile updated successfully!';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Check Auth Status
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  }
});

export const { logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer; 