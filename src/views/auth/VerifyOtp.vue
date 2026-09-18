<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
    <div
      class="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {{$t('sign_in.verifyOtp_title')}}
        </h1>
        <p class="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
          {{$t('sign_in.verifyOtp_subtitle')}}
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ auth.phone || phoneNumber }}</span>
        </p>
      </div>

      <!-- Form -->
      <form class="space-y-6" @submit.prevent="handleVerifyOtp">
        <!-- OTP Input -->
        <div class="flex justify-center" dir="ltr">
          <v-otp-input
            ref="otpInput"
            v-model="otp"
            input-classes="otp-input"
            separator=""
            :num-inputs="4"
            :should-auto-focus="true"
            input-type="number"
            @on-change="handleOnChange"
            @on-complete="handleOnComplete"
            :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
          />
        </div>

        <!-- Error Message من الـ store -->
        <div class="min-h-[24px]">
          <p v-if="auth.error" class="text-xs md:text-sm text-red-500 mt-1 text-center">{{ auth.error }}</p>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="auth.loading || otp.length < 4"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none transition-colors disabled:bg-gray-400"
          >
            <span v-if="!auth.loading">{{$t('sign_in.verify')}}</span>
            <span v-else>
              <!-- Loading Spinner -->
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          </button>
        </div>
      </form>

      <!-- Resend Code -->
      <div class="text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{$t('sign_in.didnt_receive_code')}}
          <button
            @click="resendCode"
            :disabled="resendCooldown > 0"
            class="font-medium text-primary dark:text-primary-dark hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {{$t('sign_in.resend_code')}} <span v-if="resendCooldown > 0">({{ resendCooldown }}s)</span>
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import VOtpInput from 'vue3-otp-input';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'VerifyOtpView',
  components: { VOtpInput },
  data() {
    return {
      otp: '',
      phoneNumber: '',
      resendCooldown: 60,
      auth: useAuthStore()
    };
  },
  methods: {
    handleOnChange(value) {
      this.otp = value;
    },

    handleOnComplete(value) {
      this.otp = value;
      this.handleVerifyOtp();
    },

    async handleVerifyOtp() {
      if (this.otp.length < 4) return;

      // usage of the action from the store
      const success = await this.auth.verifyOtp(this.otp);

      if (success) {
        this.$toast.success(this.auth.message || this.$t('sign_in.otp_verified_success'));

        // redirect based on isNewAdvertiser presence
        if(this.auth.isNewAdvertiser) {
          this.$router.push({ name: 'completeProfile' });
        } else {
          this.$router.push({ name: 'dashboard' });
        }
      } else {
        this.$refs.otpInput.clearInput();
        this.otp = '';
      }
    },

    startCooldown() {
      this.resendCooldown = 60;
      const interval = setInterval(() => {
        this.resendCooldown--;
        if (this.resendCooldown <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    },

    async resendCode() {
      if (this.resendCooldown > 0) return;

      // usage of the action from the store
      const success = await this.auth.sendOtp(this.auth.phone || this.phoneNumber);

      if (success) {
        this.startCooldown();
      } else {
        this.$toast.error(this.$t('sign_in.network_error'));
      }
    }
  },

  created() {
    this.phoneNumber = this.$route.query.phone || 'your phone';
    this.startCooldown();
  }
};
</script>

<style lang="postcss">
.otp-input {
  width: 45px;
  height: 45px;
  padding: 5px;
  margin: 0 5px;
  font-size: 20px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  text-align: center;
  transition: all 0.3s;

  @apply dark:bg-gray-800 dark:border-gray-600 dark:text-white;
}
.otp-input:focus {
  @apply ring-2 ring-primary border-primary outline-none;
  @apply dark:ring-primary-dark dark:border-primary-dark;
}
</style>
