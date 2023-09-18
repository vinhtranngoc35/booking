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
        id: roomSelected.id,
        files: idImages.map(e => {
            return {
                id: e
            }
        })
    }
    if (data.idCategories.length === 0) {
        alert('chon di');
        return;
    }

    let message = "Created"
    if (roomSelected.id) {
        await myFetch({data, url: '/api/rooms/' + data.id, method: 'PUT'})
        message = "Edited"
    } else {
        await myFetch({data, url: '/api/rooms', method: 'POST'})
    }

    alert(message);
    await renderTable();
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
    await renderTable()

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
    await addEventEditAndDelete();
}

const addEventEditAndDelete = async () => {
    const eEdits = tBody.querySelectorAll('.edit');
    //const eDeletes = tBody.querySelectorAll('.delete');
    for (let i = 0; i < eEdits.length; i++) {
        console.log(eEdits[i].id)
        eEdits[i].addEventListener('click', () => {
            showEdit(eEdits[i].dataset.id);
        })
    }
}

function clearForm() {
    idImages = [];

    const imgEle = document.getElementById("images");
    const imageOld = imgEle.querySelectorAll('img');
    for (let i = 0; i < imageOld.length; i++) {
        imgEle.removeChild(imageOld[i])
    }
    const avatarDefault = document.createElement('img');
    avatarDefault.src = '../assets/img/avatars/1.png';
    avatarDefault.classList.add('avatar-preview');
    imgEle.append(avatarDefault)
    roomForm.reset();
    roomSelected = {};
}

function showCreate() {
    $('#staticBackdropLabel').text('Create Room');
    clearForm();
    renderForm(formBody, getDataInput())
}

let idImages = [];

async function previewImage(evt) {
    if(evt.target.files.length === 0){
        return;
    }
    idImages = [];

    const imgEle = document.getElementById("images");
    const imageOld = imgEle.querySelectorAll('img');
    for (let i = 0; i < imageOld.length; i++) {
        imgEle.removeChild(imageOld[i])
    }

    // When the image is loaded, update the img element's src
    const files = evt.target.files
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await previewImageFile(file, i);

        if (file) {
            // Create a new FormData object and append the selected file
            const formData = new FormData();
            formData.append("avatar", file);
            formData.append("fileType", "image");
            try {
                // Make a POST request to upload the image
                const response = await fetch("/api/files", {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result) {
                        const id = result.id;
                        idImages.push(id);

                    } else {
                        console.error('Image ID not found in the response.');
                    }
                } else {
                    // Handle non-OK response (e.g., show an error message)
                    console.error('Failed to upload image:', response.statusText);
                }
            } catch (error) {
                // Handle network or other errors
                console.error('An error occurred:', error);
            }
        }
    }
}

async function previewImageFile(file) {
    const reader = new FileReader();
    reader.onload = function () {
        const imgEle = document.getElementById("images");
        const img = document.createElement('img');
        img.src =reader.result;
        img.classList.add('avatar-preview');
        imgEle.append(img);

        // imgEle.ap.innerHTML = `
        //          <img class="avatar-preview" src="${urlImage}">
        //             <span class="icon-preview-delete">
        //               <i class="fa-solid fa-delete-left" onclick="onRemoveImage(index)"></i>
        //            </span>
        //     `;
        // imgEle.append(spanAPItemContainer)

    };
    reader.readAsDataURL(file);

}

function onRemoveImage(index) {
    idImages = idImages.filter((e, i) => i !== index);
    const imgEle = document.getElementById("file");
    const imageOld = imgEle.querySelectorAll('img');
    imgEle.removeChild(imageOld[index]);
}