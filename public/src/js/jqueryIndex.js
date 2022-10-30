let editID = null
let params = {
    limit: 3,
    page: 1,
}
let link = new URLSearchParams(params).toString()

$(document).ready(() => {
    readData()

    $("#form-users").submit((event) => {
        event.preventDefault()
        saveData()
    });

    $("#form-search").submit((event) => {
        event.preventDefault()
        const page = 1
        const string = $('#searchString').val()
        const integer = $('#searchInteger').val()
        const float = $('#searchFloat').val()
        const startDate = $('#searchStart').val()
        const endDate = $('#searchEnd').val()
        const boolean = $('#searchBoolean').val()
        params = { ...params, string, integer, float, startDate, endDate, boolean, page }
        readData()
    });
})

// VIEW OR GETTING DATA
const readData = () => {
    $.ajax({
        method: "GET",
        url: "http://localhost:3006/users"
    }).done((data) => {
        params = { ...params, totalPages: data.totalPages }
        let html = ''
        let offset = (parseInt(params.page) - 1) * params.limit
        console.log(offset)
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
        $('#table-users').html(html)
        pagination()
    }).fail((err) => {
        alert('Failed to get response')
    })
}

// ADD & Edit
const saveData = () => {
    const string = $('#string').val()
    const integer = $('#integer').val()
    const float = $('#float').val()
    const date = $('#date').val()
    const boolean = $('#boolean').val()

    if (editID == null) {
        $.ajax({
            method: "POST",
            url: "http://localhost:3006/users/add",
            dataType: "json",
            data: { string, integer, float, date, boolean }
        }).done((data) => {
            readData()
        }).fail((err) => {
            alert('Failed to add data')
        })
    } else {
        $.ajax(`http://localhost:3006/users/edit/${editID}`, {
            method: 'PUT',
            url: "http://localhost:3006/users/add",
            dataType: "json",
            data: { string, integer, float, date, boolean }
        }).done((data) => {
            readData()
        }).fail((err) => {
            alert('Failed to add data')
        })
        editID = null
    }
 
    $('#string').val('')
    $('#integer').val('')
    $('#float').val('')
    $('#date').val('')
    $('#boolean').val('')
}

// EDIT
const editData = (user) => {
    editID = user._id
    $('#string').val(user.string)
    $('#integer').val(user.integer)
    $('#float').val(user.float)
    $('#date').val(moment(user.date).format('YYYY-MM-DD'))
    $('#boolean').val(user.boolean)
}

// DELETE
const deleteData = (id) => {
    $.ajax({
        method: 'DELETE',
        url: `http://localhost:3006/users/delete/${id}`,
        dataType: "json"
    }).done((data) => {
        readData()
    }).fail(() => {
        alert('Failed to delete data')
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
    $('#pagination').html(pagination)
}

function changePage(page) {
    params = { ...params, page }
    readData()
}

// RESET DATA
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