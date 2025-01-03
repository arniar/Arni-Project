const toggleBtn = document.querySelector('.toggle-btn');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

// Toggle sidebar on button click
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Reset sidebar on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});

// Fetch initial table data on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/admin/admin-category/table', {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const html = await response.text();
        const tbody = document.getElementById('tbody');
        if (tbody) {
            tbody.innerHTML = html;
        } else {
            console.error('tbody element not found');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }

    // Add Offer Button Logic
    document.querySelectorAll('.add-offer').forEach((btn) => {
        btn.addEventListener('click', () => {
            const parentRow = btn.closest('tr');
            const offerForm = parentRow?.querySelector('.add-offer-container');
            if (offerForm) {
                offerForm.classList.remove('active');
                btn.classList.add('active');
            }
        });
    });

    // Close Offer Form Logic
    document.querySelectorAll('.add-offer-close-btn').forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => {
            const offerForm = closeBtn.closest('.add-offer-container');
            if (offerForm) {
                offerForm.classList.add('active');
            }
            const parentRow = closeBtn.closest('tr');
            const offerBtn = parentRow?.querySelector('.add-offer');
            if (offerBtn) {
                offerBtn.classList.remove('active');
            }
        });
    });

    // Submit Offer Form Logic
    document.querySelectorAll('.add-offer-form').forEach((form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const offerValue = form.querySelector('#add-offer-input')?.value;
            const id = form.querySelector('#myHiddenInput')?.value;

            const formContent = { offer: offerValue, Id: id };

            try {
                const response = await fetch('/admin/mainCategoryOffer', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formContent)
                });

                if (!response.ok) {
                    throw new Error(`Network error: ${response.statusText}`);
                }

                location.reload();
            } catch (error) {
                console.error('Form submission error:', error);
            }
        });
    });

    // Search Functionality
    const search = document.getElementById('searchBar');
    search.addEventListener('input', async () => {
        const searchValue = search.value;

        try {
            const response = await fetch(`/admin/adminCategory-search?value=${encodeURIComponent(searchValue)}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const html = await response.text();
            const tbody = document.getElementById('tbody');
            if (tbody) {
                tbody.innerHTML = html;
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    });

    // Cat Modal Logic
    const catModal = {
        cropper: null,
        elements: {
            overlay: document.getElementById('catModalOverlay'),
            form: document.getElementById('catCreateForm'),
            imageInput: document.getElementById('catImageInput'),
            cropImage: document.getElementById('catCropImage'),
            croppedData: document.getElementById('catCroppedData')
        },

        open() {
            this.elements.overlay.classList.add('cat-modal__overlay--active');
        },

        close() {
            this.elements.overlay.classList.remove('cat-modal__overlay--active');
            if (this.cropper) {
                this.cropper.destroy();
                this.elements.cropImage.style.display = 'none';
            }
            this.elements.form.reset();
        },

        init() {
            this.elements.imageInput.addEventListener('change', this.handleImageSelect.bind(this));
            this.elements.form.addEventListener('submit', this.handleSubmit.bind(this));
        },

        handleImageSelect(e) {
            const file = e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                this.elements.imageInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.elements.cropImage.src = e.target.result;
                this.elements.cropImage.style.display = 'block';

                if (this.cropper) this.cropper.destroy();

                this.cropper = new Cropper(this.elements.cropImage, {
                    aspectRatio: 1,
                    viewMode: 2,
                    preview: '.cat-crop__preview',
                    responsive: true,
                    autoCropArea: 0.8,
                    cropBoxResizable: true,
                    zoomable: true
                });
            };
            reader.readAsDataURL(file);
        },

        handleSubmit(e) {
            e.preventDefault();

            if (!this.cropper) {
                alert('Please select and crop an image');
                return;
            }

            try {
                const canvas = this.cropper.getCroppedCanvas();
                const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                this.elements.croppedData.value = croppedDataUrl;

                console.log('Form submitted with cropped image');
                this.elements.form.submit();
                this.close();
            } catch (error) {
                alert('Error processing image: ' + error.message);
            }
        }
    };

    catModal.init();

    // Add Category Modal Button Logic
    const addForm = document.querySelector('#catModalOverlay');
    document.querySelector('.add-category-btn').addEventListener('click', () => {
        addForm.classList.remove('active');
    });
    document.querySelector('.cat-btn--cancel').addEventListener('click', () => {
        addForm.classList.add('active');
    });
    document.querySelector('.cat-modal__close-btn').addEventListener('click', () => {
        addForm.classList.add('active');
    });
    const loader = document.querySelector('.loader')
    const container = document.querySelector('.container')
    document.querySelector('.cat-btn--submit').addEventListener('submit', () => {
        preventDefault
        loader.classList.remove('active');
        container.classList.add('active');
    })
});
