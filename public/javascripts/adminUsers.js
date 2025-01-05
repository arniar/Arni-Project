document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/admin/admin-users/table', {
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
});