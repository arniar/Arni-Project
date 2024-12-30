// 📝 Common Utility Function for Validation Feedback
function setError(element, message) {
    const messageElement = document.getElementById(`${element.id}Message`);
    messageElement.textContent = message;
    element.classList.add('iAfter');
}

function clearError(element) {
    const messageElement = document.getElementById(`${element.id}Message`);
    messageElement.textContent = '';
    element.classList.remove('iAfter');
}
// 📧 Email Validation
const emailOrPhone = document.getElementById('emailOrPhone');
        const emailOrPhoneMessage = document.getElementById('emailOrPhoneMessage');
        let emailOrPhoneError = false;

        function validateEmailOrPhone() {
            let value = emailOrPhone.value.trim();
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Email regex
            let phoneRegex = /^[+]?[0-9]{10,15}$/;  // Phone number regex

            if (value === '') {
                setError(emailOrPhone, 'Email or Phone Number is required');
                emailOrPhoneError = true;
            } else if (!emailRegex.test(value) && !phoneRegex.test(value)) {
                setError(emailOrPhone, 'Invalid email or phone number format');
                emailOrPhoneError = true;
            } else {
                clearError(emailOrPhone);
                emailOrPhoneError = false;
            }
        }

        function validateEmailOrPhone2() {
            if (!emailOrPhoneError) {
                return;
            }
            let value = emailOrPhone.value.trim();
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let phoneRegex = /^[+]?[0-9]{10,15}$/;

            if (value === '') {
                setError(emailOrPhone, 'Email or Phone Number is required');
                emailOrPhoneError = true;
            } else if (!emailRegex.test(value) && !phoneRegex.test(value)) {
                setError(emailOrPhone, 'Invalid email or phone number format');
                emailOrPhoneError = true;
            } else {
                clearError(emailOrPhone);
                emailOrPhoneError = false;
            }
        }

        emailOrPhone.addEventListener('blur', validateEmailOrPhone);
        emailOrPhone.addEventListener('input', validateEmailOrPhone2);