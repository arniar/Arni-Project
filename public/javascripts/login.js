// 📝 Common Utility Functions for Validation Feedback
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

// 📧 Email or Phone Validation
const emailOrPhone = document.getElementById('emailOrPhone');
let emailOrPhoneError = false;

function validateEmailOrPhone() {
    let value = emailOrPhone.value.trim();
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email regex
    let phoneRegex = /^[+]?[0-9]{10,15}$/; // Phone number regex

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

// Event Listeners for Validation
emailOrPhone.addEventListener('blur', validateEmailOrPhone);
emailOrPhone.addEventListener('input', validateEmailOrPhone);

// 👁️ Toggle Password Visibility
const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

form.addEventListener('submit', (e) => {
    validateEmailOrPhone(); // Call validation function explicitly
    
    console.log('Email/Phone Error:', emailOrPhoneError);
    
    if (emailOrPhoneError) {
        e.preventDefault(); // Prevent form submission if errors exist
        alert('Please fix validation errors before submitting.');
    } else {
        e.preventDefault(); // Always prevent default to control form submission via JavaScript

        // Prepare Form Data
        const formData = {
            emailOrPhone: emailOrPhone.value.trim(),
            password: password.value.trim()
        };

        console.log('Form submitted successfully!');

        fetch('/login/loginAuth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Sending JSON data
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                return response.text(); // Read the response body as text
            } else {
                throw new Error('Failed to authenticate. Please try again.');
            }
        })
        .then(data => {
            console.log('Response from server:', data);
            if (data === "done") {
                window.location.href = '/landing'; // Redirect to landing page
            } else if (data === "new") {
                window.location.reload();; 

            } 
            else if(data === "undone"){
                window.location.reload(); //
            }
        })
        
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while logging in. Please try again.');
        });
    }
});

