// Sidebar toggle functionality
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Modal functionality
const modal = document.getElementById('blockUserModal');
const blockButtons = document.querySelectorAll('.block-user-btn');
const closeModal = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const confirmBtn = document.querySelector('.confirm-btn');
let currentUserId = null;

function openModal(userId) {
    modal.classList.add('active');
    currentUserId = userId;
    document.getElementById('blockReason').value = '';
}

function closeModalHandler() {
    modal.classList.remove('active');
    currentUserId = null;
}

blockButtons.forEach(button => {
    button.addEventListener('click', () => {
        const userId = button.getAttribute('data-user-id');
        openModal(userId);
    });
});

closeModal.addEventListener('click', closeModalHandler);
cancelBtn.addEventListener('click', closeModalHandler);

// Close modal if clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});

confirmBtn.addEventListener('click', () => {
    const reason = document.getElementById('blockReason').value;
    if (reason.trim() === '') {
        alert('Please provide a reason for blocking the user.');
        return;
    }
    
    // Here you would typically send this data to your server
    console.log('Blocking user:', currentUserId, 'Reason:', reason);
    closeModalHandler();
});