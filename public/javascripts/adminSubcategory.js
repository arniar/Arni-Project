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
        const response = await fetch('/admin/subCategory/table', {
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
                const response = await fetch('/admin/subCategory/offer', {
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
            const response = await fetch(`/admin/subCategory/search?value=${encodeURIComponent(searchValue)}`, {
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
    const loader = document.querySelector('.loader');
    const container = document.querySelector('.container');
    
    document.querySelector('#catCreateForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default button behavior if it's in a form
        loader.classList.remove('active');
        container.classList.add('active');
    });

    let editBtn = document.querySelectorAll('.edit');
    editBtn.forEach((btn) => {
        let editForm = btn.closest('td').querySelector('.edt-modal__overlay');
        btn.addEventListener('click', () => {
            editForm.classList.remove('active'); // Toggle `active` instead of remove (usually logical)


            const edtModal = {
                cropper: null,
                elements: {
                    overlay: btn.closest('td').querySelector('#edtModalOverlay'),
                    form:  btn.closest('td').querySelector('#edtCreateForm'),
                    imageInput: btn.closest('td').querySelector('#edtImageInput'),
                    cropImage:  btn.closest('td').querySelector('#edtCropImage'),
                    croppedData:  btn.closest('td').querySelector('#edtCroppedData')
                },
        
                open() {
                    this.elements.overlay.classList.add('edt-modal__overlay--active');
                },
        
                close() {
                    this.elements.overlay.classList.remove('edt-modal__overlay--active');
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
                            preview: '.edt-crop__preview',
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
        
            edtModal.init();
        });
    });
    let editClose = document.querySelectorAll('.edt-modal__close-btn')
    editClose.forEach((btn) => {
        btn.addEventListener('click', () => {
            btn.closest('td').querySelector('.edt-modal__overlay').classList.add('active');
        });
    });
    let editCancel= document.querySelectorAll('.cat-btn--cancel')
    editCancel.forEach((btn) => {
        btn.addEventListener('click', () => {
            btn.closest('td').querySelector('.edt-modal__overlay').classList.add('active');
        });
    });

    let editForm = document.querySelectorAll('.edt-form');
    editForm.forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default button behavior if it's in a form
            loader.classList.remove('active');
            container.classList.add('active');
        });
    })

    let inactivateBtn = document.querySelectorAll('.makeInactive');

    inactivateBtn.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            try {
                // Show confirmation dialog
                const isConfirmed = confirm('Are you sure you want to inactivate this main category?');
    
                // Proceed only if the user confirms
                if (!isConfirmed) {
                    return; // Exit if the user clicks "Cancel"
                }
    
                // Get the ID from the closest row or td
                let id = btn.closest('tr').querySelector('.id').value; 
                
                // Create formData object
                let formData = {
                    id: id,
                };
    
                // Send a PATCH request to the backend
                const response = await fetch('/admin/subCategory/inactivate', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
    
                // Check if the response is OK
                if (!response.ok) {
                    throw new Error(`Network error: ${response.statusText}`);
                }
    
                // Reload the page after a successful response
                location.reload();
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to inactivate the category. Please try again.');
            }
        });
    });

    let activateBtn = document.querySelectorAll('.makeActive');

    activateBtn.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            try {
                // Show confirmation dialog
                const isConfirmed = confirm('Are you sure you want to activate this main category?');
    
                // Proceed only if the user confirms
                if (!isConfirmed) {
                    return; // Exit if the user clicks "Cancel"
                }
    
                // Get the ID from the closest row or td
                let id = btn.closest('tr').querySelector('.id').value; 
                
                // Create formData object
                let formData = {
                    id: id,
                };
    
                // Send a PATCH request to the backend
                const response = await fetch('/admin/subCategory/activate', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
    
                // Check if the response is OK
                if (!response.ok) {
                    throw new Error(`Network error: ${response.statusText}`);
                }
    
                // Reload the page after a successful response
                location.reload();
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to activate the category. Please try again.');
            }
        });
    });
       
    let permanentDelete = document.querySelectorAll('.permanentDelete');

permanentDelete.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
        try {
            // First confirmation dialog
            const isConfirmed = confirm('Are you sure you want to delete this main category permanently?');
            if (!isConfirmed) {
                return; // Exit if the user cancels
            }

            // Second confirmation dialog
            const isConfirmed2 = confirm('It will delete all products in it. Are you sure you want to proceed?');
            if (!isConfirmed2) {
                return; // Exit if the user cancels
            }

            // Get the ID from the closest row
            let id = btn.closest('tr').querySelector('.id').value;

            // Create formData object
            let formData = {
                id: id,
            };

            // Send DELETE request
            const response = await fetch('/admin/subCategory/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            // Check if the response is OK
            if (!response.ok) {
                throw new Error(`Network error: ${response.statusText}`);
            }

            // Reload the page after successful deletion
            location.reload();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete the category. Please try again.');
        }
    });
});

});
