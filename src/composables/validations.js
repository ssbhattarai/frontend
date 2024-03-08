import { computed } from 'vue';

export function useCustomValidations() {
  // Validation Functions

  const minLength = (propertyType, length) => {
    return (v) => (v && v.length >= length) || `${propertyType} must be at least ${length} characters`;
  };

  const dateFormat = (propertyType) => {
    return (v) => /^(\d{4})(\/|-|.|\s|\\)(\d{1,2})\2(\d{1,2})$/.test(v) || `${propertyType} को मिती को धाँचा मिलेन `;
  };

  const urlFormat = (propertyType) => {
    return (v) => /[(https?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(v) || `${propertyType} को धाँचा मिलेन`;
  };

  // Computed Property for Rules

  const rules = computed(() => ({
    required: (value) => !!value || 'This field is required',

    english_name: (value) => !!/^[a-zA-Z ]*$/.test(value) || 'अंग्रेजी अक्षरहरू मात्र स्वीकार गरिन्छ',

    password: (v) =>
      /^.*(?=.*[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/.test(
        v
      ) ||
      "Password must contain one lowercase, one uppercase, one special character",

    maxLength: (value, length) => (value.length > length ? `Maximum ${length} characters` : true),
    email: (v) =>
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(v) || "Invalid email format",
  }));

  // Return Functions and Computed Property

  return {
    minLength,
    dateFormat,
    urlFormat,
    rules,
  };
}
