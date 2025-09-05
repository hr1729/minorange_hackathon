// Form validation rules
export const formRules = {
  // Email validation
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address"
    }
  },
  
  // Password validation
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters"
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      message: "Password must contain uppercase, lowercase, number and special character"
    }
  },

  // Name validation
  name: {
    required: "Name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters"
    },
    maxLength: {
      value: 50,
      message: "Name cannot exceed 50 characters"
    }
  }
}

// Helper functions for validation
export const validateField = (value, rules) => {
  if (rules.required && !value) {
    return rules.required
  }

  if (rules.minLength && value.length < rules.minLength.value) {
    return rules.minLength.message
  }

  if (rules.maxLength && value.length > rules.maxLength.value) {
    return rules.maxLength.message
  }

  if (rules.pattern && !rules.pattern.value.test(value)) {
    return rules.pattern.message
  }

  return null
}
