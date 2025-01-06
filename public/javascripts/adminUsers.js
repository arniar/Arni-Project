document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/admin/users/table', {
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

    let blockBtn = document.querySelectorAll('.block-user-btn');

    blockBtn.forEach((btn)=>{
        btn.addEventListener('click', async (e) => {
           let form = btn.closest('tr').querySelector('.modal-overlay')
           form.classList.remove('hide')
        })
    })

    let closeBtn = document.querySelectorAll('.close-modal')
    closeBtn.forEach((btn)=>{
        btn.addEventListener('click', async (e) => {
            let form = btn.closest('tr').querySelector('.modal-overlay')
            form.classList.add('hide')
         })
    })

    let cancelBtn = document.querySelectorAll('.cancel-btn')
    cancelBtn.forEach((btn)=>{
        btn.addEventListener('click', async (e) => {
            let form = btn.closest('tr').querySelector('.modal-overlay')
            form.classList.add('hide')
         })
    })
});