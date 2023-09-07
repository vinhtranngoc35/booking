const roomForm = document.getElementById('roomForm');
const eCheckBoxCategories = document.getElementsByName('categories');
let roomSelected = {};
const formBody = document.getElementById('formBody');
const tBody = document.getElementById('tBody');
let categories;
let types;
let rooms = [];

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
            .map(e => e.value),
        id: roomSelected.id
    }
    if(data.idCategories.length === 0){
        alert('chon di');
        return;
    }

    let message = "Created"
    if (roomSelected.id) {
        await editRoom(data);
        message = "Edited"
    } else {
        await createRoom(data)
    }

    alert(message);
    renderTable();
    $('#staticBackdrop').modal('hide');

}

function getDataFromForm(form) {
    // event.preventDefault()
    const data = new FormData(form);
    return Object.fromEntries(data.entries())
}

async function getCategoriesSelectOption() {
    const res = await fetch('api/categories');
    return await res.json();
}

async function getTypesSelectOption() {
    const res = await fetch('api/types');
    return await res.json();
}

window.onload = async () => {
    categories = await getCategoriesSelectOption();
    types = await getTypesSelectOption();
    renderTable()

    renderForm(formBody, getDataInput());
}


function getDataInput() {
    return [
        {
            label: 'Name',
            name: 'name',
            value: roomSelected.name,
            required: true,
            pattern: "^[A-Za-z ]{6,20}",
            message: "Username must have minimum is 6 characters and maximum is 20 characters",
        },
        {
            label: 'Type',
            name: 'type',
            value: roomSelected.typeId,
            type: 'select',
            required: true,
            options: categories,
            message: 'Please choose Type'
        },
        {
            label: 'Price',
            name: 'price',
            value: roomSelected.price,
            pattern: "[1-9][0-9]{1,10}",
            message: 'Price errors',
            required: true
        },
        {
            label: 'Description',
            name: 'description',
            value: roomSelected.description,
            pattern: "^[A-Za-z ]{6,120}",
            message: "Description must have minimum is 6 characters and maximum is 20 characters",
            required: true
        },

    ];
}


async function findRoomById(id) {
    const res = await fetch('/api/rooms/' + id);
    return await res.json();
}


async function showEdit(id) {
    $('#staticBackdropLabel').text('Edit Room');
    clearForm();
    roomSelected = await findRoomById(id);
    roomSelected.categoryIds.forEach(idCategory => {
        for (let i = 0; i < eCheckBoxCategories.length; i++) {
            if (idCategory === +eCheckBoxCategories[i].value) {
                eCheckBoxCategories[i].checked = true;
            }
        }
    })
    renderForm(formBody, getDataInput());
}


async function getRooms() {
    const res = await fetch('/api/rooms');
    return await res.json();
}

function renderItemStr(item, index) {
    return `<tr>
                    <td>
                        ${index + 1}
                    </td>
                    <td>
                        ${item.name}
                    </td>
                    <td>
                        ${item.description}
                    </td>
                    <td>
                        ${item.price}
                    </td>
                    <td>
                        ${item.type}
                    </td>
                    <td>
                        ${item.categories}
                    </td>
                     
                    <td>
                        <a class="btn btn-primary text-white  edit " data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Edit</a>
                        <a class="btn btn-warning text-white delete" data-id="${item.id}">Delete</a>
                    </td>
                </tr>`
}

function renderTBody(items) {
    let str = '';
    items.forEach((e, i) => {
        str += renderItemStr(e, i);
    })
    tBody.innerHTML = str;
}

async function renderTable() {
    const pageable = await getRooms();
    rooms = pageable.content;
    renderTBody(rooms);
    addEventEditAndDelete();
}

const addEventEditAndDelete = () => {
    const eEdits = tBody.querySelectorAll('.edit');
    const eDeletes = tBody.querySelectorAll('.delete');
    for (let i = 0; i < eEdits.length; i++) {
        console.log(eEdits[i].id)
        eEdits[i].addEventListener('click', () => {
            showEdit(eEdits[i].dataset.id);
        })
    }
}

function clearForm() {
    roomForm.reset();
    roomSelected = {};
}

function showCreate() {
    $('#staticBackdropLabel').text('Create Room');
    clearForm();
    renderForm(formBody, getDataInput())
}

async function editRoom(data) {
    const res = await fetch('/api/rooms/' + data.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

async function createRoom(data) {
    const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}


