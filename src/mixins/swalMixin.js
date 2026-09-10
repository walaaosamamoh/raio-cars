import Swal from 'sweetalert2'

export const swalMixin = {
  methods: {
    $swalSuccess(message, title = 'Success') {
      const isDark = this.$store?.state?.theme === 'dark' ||
                    document.documentElement.classList.contains('dark');

      return Swal.fire({
        icon: 'success',
        title,
        text: message,
        background: isDark ? '#1f2937' : '#fff',
        color: isDark ? '#fff' : '#000',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-xl border dark:border-gray-600',
          confirmButton: 'px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200'
        },
        buttonsStyling: false
      });
    },

    $swalWarning(message, title = 'Warning') {
      const isDark = this.$store?.state?.theme === 'dark' ||
                    document.documentElement.classList.contains('dark');

      return Swal.fire({
        icon: 'warning',
        title,
        text: message,
        background: isDark ? '#1f2937' : '#fff',
        color: isDark ? '#fff' : '#000',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-xl border dark:border-gray-600',
          confirmButton: 'px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors duration-200'
        },
        buttonsStyling: false
      });
    },

    $swalConfirm(title, text, confirmText = 'Delete') {
      const isDark = this.$store?.state?.theme === 'dark' ||
                    document.documentElement.classList.contains('dark');

      return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        background: isDark ? '#1f2937' : '#fff',
        color: isDark ? '#fff' : '#000',
        confirmButtonText: confirmText,
        cancelButtonText: this.$t('common.cancel'),
        customClass: {
          popup: 'rounded-xl border dark:border-gray-600',
          confirmButton: 'px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium mr-2',
          cancelButton: 'px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium mr-2'
        },
        buttonsStyling: false
      });
    }
  }
}
