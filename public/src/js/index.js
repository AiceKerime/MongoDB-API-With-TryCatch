let editID = null

// VIEW OR GETTING DATA
const readData = () => {
    fetch('http://localhost:3006/users')
        .then((response) => response.json())
        .then((data) => {
            let html = ''
            data.data.forEach((item, index) => {
                html += `
                <tr>
                    <td>${index + 1}</td>
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

// SEARCH
const search = () => { }

// PAGINATION
const pagination = () => {

}

document.getElementById("form-users").addEventListener("submit", (event) => {
    event.preventDefault()
    saveData()
});

readData()