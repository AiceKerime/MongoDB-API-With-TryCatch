let editID = null
let params = {
    page: 1
}

// VIEW OR GETTING DATA
const readData = () => {
    fetch(`http://localhost:3006/users?${new URLSearchParams(params).toString()}`).then((response) => {
        if (!response.ok) {
            throw new Erorr(`HTTP error! status: ${response.status}`)
        }
        return response.json()
    }).then((data) => {
        params = { ...params, totalPages: data.totalPages }
        let html = ''
        let offset = data.offset
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
                        <button onclick='editData(${JSON.stringify(item)})' class="btn btn-custom"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                        <button id="delete" onclick="deleteData('${item._id}')" class="btn btn-danger"><i class="fa-solid fa-trash"></i> Delete</button>
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ string, integer, float, date, boolean })
        }).then((response) => response.json())
            .then((data) => {
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
    // console.log(user)
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

document.getElementById("form-search").addEventListener("submit", (event) => {
    event.preventDefault()
    const page = 1
    const string = document.getElementById('searchString').value
    const integer = document.getElementById('searchInteger').value
    const float = document.getElementById('searchFloat').value
    const startDate = document.getElementById('searchStart').value
    const endDate = document.getElementById('searchEnd').value
    const boolean = document.getElementById('searchBoolean').value
    params = { ...params, string, integer, float, startDate, endDate, boolean, page }
    readData()
});


// RESET & REMOVE FUNCTION
function resetData() {
    document.getElementById("form-search").reset()
    readData()
}

function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll(".table-sortable th").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");

        sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
});

readData()