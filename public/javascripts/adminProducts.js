const addProduct = document.getElementById('add-product');
const addForm = document.getElementById('add-form');
const closeBtn = document.getElementById('close-btn-start');
addProduct.addEventListener('click',()=>{
     addForm.classList.remove('make-visible');
})
closeBtn.addEventListener('click',()=>{
     addForm.classList.add('make-visible');
})

const editProduct = document.querySelectorAll('.edit-product-btn');
const editForm = document.getElementById('edit-form');
const closeBtnEdit = document.getElementById('close-btn-edit');

editProduct.forEach((product)=>{
    product.addEventListener('click',()=>{
        editForm.classList.remove('make-visible');
    })
})
closeBtnEdit.addEventListener('click',()=>{
    editForm.classList.add('make-visible');
})


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/admin/admin-products/table', {
            method: 'POST',
        });
       console.log(response);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const html = await response.text();
        console.log('Fetched HTML:', html);
        const tbody = document.getElementById('tbody');
        if (tbody) {
            tbody.innerHTML = html;
        } else {
            console.error('tbody element not found');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});

        function previewImage(event, previewId) {
            const reader = new FileReader();
            reader.onload = function() {
                const preview = document.getElementById(previewId);
                preview.src = reader.result;
                preview.style.display = 'block';
            }
            reader.readAsDataURL(event.target.files[0]);
        }
 