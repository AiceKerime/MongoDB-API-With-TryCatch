let editID = null
let params = {
    limit: 3,
    page: 1
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
        console.log(params.page, 'page')
        console.log(data.totalPages, 'totalPages')
        console.log(params.limit, 'limit')
        console.log(offset, 'offset')
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
    $.ajax({
        method: 'GET',
        url: `http://localhost:3006/users`
    }).done((data) => {
        let pagination = `
    <ul class="pagination">
        <li class="page-item${params.page <= 1 ? ' disabled' : ''}">
            <a class="page-link" id="dataPage" href="javascript:void(0)" onclick="changePage(${parseInt(params.page) - 1})" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>`
        console.log(params.totalPages, 'params.total')
        console.log(params.page, `params.page`)
        for (let i = 1; i <= params.totalPages; i++) {
            pagination += `
        <li class="page-item${i == params.page ? ' active' : ''}"><a class="page-link" id="dataPage" href="javascript:void(0)" id="angka" onclick="changePage(${i})">${i}</a></li>`
        }
        pagination += `<li class="page-item${params.page == params.totalPages ? ' disabled' : ''}">
            <a class="page-link" href="javascript:void(0)" onclick="changePage(${parseInt(params.page) + 1})" id="dataPage" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    </ul>
    `
        $('#pagination').html(pagination)
    }).fail(() => {
        alert('Failed to delete data')
    })
}

const changePage = (page) => {
    params = { ...params, page }
    console.log(page, 'Change Page')
    readData()
}

// RESET DATA
const resetData = () => {
    $("#form-search").trigger('reset')
    readData()
}

$('th').click(function () {
    var table = $(this).parents('table').eq(0)
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc) { rows = rows.reverse() }
    for (var i = 0; i < rows.length; i++) { table.append(rows[i]) }
})
function comparer(index) {
    return function (a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}
function getCellValue(row, index) { return $(row).children('td').eq(index).text() }