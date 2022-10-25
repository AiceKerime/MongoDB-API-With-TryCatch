let idEdit = null

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
                    <td>${item.date}</td>
                    <td>${item.boolean}</td>
                    <td>
                        <button type="submit" onclick="editData(${JSON.stringify(item)})" class="btn btn-primary"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
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

const saveData = () => {
    const string = document.getElementById('string').value
    const integer = document.getElementById('integer').value
    const float = document.getElementById('float').value
    const date = document.getElementById('date').value
    const boolean = document.getElementById('boolean').value

    if (idEdit == null) {
        fetch('http://localhost:3006/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json '
            },
            body: JSON.stringify({ string, integer, float, date, boolean })
        }).then((response) => response.json()).then((data) => {
            readData()
        }).catch((err) => {
            alert('Failed to add data ')
        })
    } else {
        fetch(`http://localhost:3006/users/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json '
            },
            body: JSON.stringify({ string, integer, float, date, boolean })
        }).then((response) => response.json()).then((data) => {
            readData()
        })
        idEdit = null
    }

    document.getElementById('string').value = ''
    document.getElementById('integer').value = ''
    document.getElementById('float').value = ''
    document.getElementById('date').value = ''
    document.getElementById('boolean').value = ''
    return false
}

const editData = (users) => {
    idEdit = users._id
    document.getElementById('string').value = users.string
    document.getElementById('integer').value = users.integer
    document.getElementById('float').value = users.float
    document.getElementById('date').value = users.date
    document.getElementById('boolean').value = users.boolean
}

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

document.getElementById("form-users").addEventListener("submit", function (event) {
    event.preventDefault()
    saveData()
});

readData()