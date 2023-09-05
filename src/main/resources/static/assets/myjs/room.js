const roomForm = document.getElementById('roomForm');
const eCheckBoxCategories = document.getElementsByName('categories');

roomForm.onsubmit = async (e) => {
    e.preventDefault();
    let data = getDataFromForm(roomForm);
    data = {
        ...data,
        type: {
            id: data.type
        },
        idCategories: Array.from(eCheckBoxCategories)
            .filter(e => e.checked)
            .map(e => e.value)
    }

    const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if(res.ok){
        alert('THanh cong')
    }
}
function getDataFromForm(form) {
    // event.preventDefault()
    const data = new FormData(form);
    return Object.fromEntries(data.entries())
}