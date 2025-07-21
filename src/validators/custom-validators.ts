import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  
  static turkishPhone(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^(\+90|0)?5\d{9}$/;
    if (control.value && !phoneRegex.test(control.value)) {
      return { turkishPhone: { value: control.value } };
    }
    return null;
  }

  static turkishTC(control: AbstractControl): ValidationErrors | null {
    const tc = control.value;
    if (!tc || tc.length !== 11) {
      return { turkishTC: { value: tc } };
    }

    // Turkish TC number validation algorithm
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(tc[i]);
    }
    
    if (sum % 10 !== parseInt(tc[10])) {
      return { turkishTC: { value: tc } };
    }

    let oddSum = 0, evenSum = 0;
    for (let i = 0; i < 9; i++) {
      if (i % 2 === 0) {
        oddSum += parseInt(tc[i]);
      } else {
        evenSum += parseInt(tc[i]);
      }
    }

    if ((oddSum * 7 - evenSum) % 10 !== parseInt(tc[9])) {
      return { turkishTC: { value: tc } };
    }

    return null;
  }

  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;

    const errors: any = {};
    
    if (!hasUpperCase) errors.upperCase = true;
    if (!hasLowerCase) errors.lowerCase = true;
    if (!hasNumeric) errors.numeric = true;
    if (!hasSpecialChar) errors.specialChar = true;
    if (!isValidLength) errors.minLength = true;

    return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
  }

  static plateNumber(control: AbstractControl): ValidationErrors | null {
    // Turkish license plate format: 34 ABC 123 or 34 AB 1234
    const plateRegex = /^(0[1-9]|[1-7][0-9]|8[01])\s[A-Z]{2,3}\s\d{2,4}$/;
    if (control.value && !plateRegex.test(control.value)) {
      return { plateNumber: { value: control.value } };
    }
    return null;
  }

  static noSpecialChars(control: AbstractControl): ValidationErrors | null {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (control.value && specialCharRegex.test(control.value)) {
      return { noSpecialChars: { value: control.value } };
    }
    return null;
  }

  static matchPassword(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordKey);
      const confirmPassword = control.get(confirmPasswordKey);

      if (!password || !confirmPassword) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }

      // Clear the error if passwords match
      if (confirmPassword.errors?.['passwordMismatch']) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }

      return null;
    };
  }

  static forbiddenWords(forbiddenWords: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value.toLowerCase();
      const foundWord = forbiddenWords.find(word => 
        value.includes(word.toLowerCase())
      );
      
      if (foundWord) {
        return { forbiddenWord: { word: foundWord } };
      }
      
      return null;
    };
  }
}
