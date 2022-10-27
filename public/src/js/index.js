let editID = null
let params = {
    limit: 3,
    page: 1,
}
let link = new URLSearchParams(params).toString()

// VIEW OR GETTING DATA
const readData = () => {
    fetch('http://localhost:3006/users').then((response) => {
        if (!response.ok) {
            throw new Erorr(`HTTP error! status: ${response.status}`)
        }
        return response.json()
    })
        .then((data) => {
            params = { ...params, totalPages: data.data.totalPages }
            let html = ''
            let offset = (parseInt(params.page) - 1) * params.limit
            fetch(`http://localhost:3006/users?${new URLSearchParams(params).toString()}`).then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status ${response.status}`)
                }
                return response.json()
            })
                .then((data) => {
                    params = { ...params, totalPages: data.totalPages }
                    let html = ''
                    let offset = (parseInt(params.page) - 1) * params.limit
                    data.data.forEach((item, index) => {
                        html += `
                <tr>
                    <td>${index + offset + 1}</td>
                    <td>${item.string}</td>
                    <td>${item.integer}</td>
                    <td>${item.float}</td>
                    <td>${moment(item.date).format('DD MMMM YYYY')}</td>
                    <td>${item.boolean}</td>
                    <td>
                        <button type="submit" onclick='editData(${JSON.stringify(item)})' class="btn btn-custom"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                        <button type="submit" onclick="deleteData('${item._id}')" class="btn btn-danger"><i class="fa-solid fa-trash"></i> Delete</button>
                    </td>
                </tr>
                `
                    })
                    document.getElementById('table-users').innerHTML = html
                    pagination()
                })
                .catch((err) => {
                    alert('Failed to get response')
                })
        })
}

// ADD
const saveData = () => {
    const string = document.getElementById('string').value
    const integer = document.getElementById('integer').value
    const float = document.getElementById('float').value
    const date = document.getElementById('date').value
    const boolean = document.getElementById('boolean').value

    if (editID == null) {
        fetch('http://localhost:3006/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json '
            },
            body: JSON.stringify({ string, integer, float, date, boolean })
        }).then((response) => response.json()).then((data) => {
            readData()
        })
    } else {
        fetch(`http://localhost:3006/users/edit/${editID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ string, integer, float, date, boolean })
        }).then((response) => response.json()).then((data) => {
            readData()
        })
        editID = null
    }

    document.getElementById('string').value = ''
    document.getElementById('integer').value = ''
    document.getElementById('float').value = ''
    document.getElementById('date').value = ''
    document.getElementById('boolean').value = ''
}

// EDIT
const editData = (user) => {
    editID = user._id
    document.getElementById('string').value = user.string
    document.getElementById('integer').value = user.integer
    document.getElementById('float').value = user.float
    document.getElementById('date').value = moment(user.date).format('YYYY-MM-DD')
    document.getElementById('boolean').value = user.boolean
}

// DELETE
const deleteData = (id) => {
    fetch(`http://localhost:3006/users/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => response.json()).then((data) => {
        readData()
    })
}

// PAGINATION
const pagination = () => {
    let pagination = `
    <ul class="pagination">
        <li class="page-item${params.page <= 1 ? ' disabled' : ''}">
            <a class="page-link" id="halaman" href="javascript:void(0)" onclick="changePage(${parseInt(params.page) - 1})" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>`
    console.log(params.totalPages)
    for (let i = 1; i <= params.totalPages; i++) {
        pagination += `
        <li class="page-item${i == params.page ? ' active' : ''}"><a class="page-link" id="halaman" href="javascript:void(0)" id="angka" onclick="changePage(${i})">${i}</a></li>`
    }
    pagination += `<li class="page-item${params.page == params.totalPages ? ' disabled' : ''}">
            <a class="page-link" href="javascript:void(0)" onclick="changePage(${parseInt(params.page) + 1})" id="halaman" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    </ul>
    `
    document.getElementById('pagination').innerHTML = pagination
}

function changePage(page) {
    params = { ...params, page }
    readData()
}

document.getElementById("form-users").addEventListener("submit", (event) => {
    event.preventDefault()
    saveData()
});

readData()