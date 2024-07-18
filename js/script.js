let tasks = [];
let idSortAsc = true;
let subjectSortAsc = true;
let textSortAsc = true;
let statusSortAsc = true;
let creationDateSortAsc = true;
let completionDateSortAsc = true;
const taskForm = document.getElementById('taskForm');
const taskTableBody = document.getElementById('taskTableBody');
const generateRandomButton = document.getElementById('generateRandom');

taskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const subject = document.getElementById('subject').value;
    const text = document.getElementById('text').value;
    const status = document.getElementById('status').value;
    const creationDate = document.getElementById('creationDate').value;
    const completionDate = document.getElementById('completionDate').value;

    const id = getNextId();
    const newTask = {
        id: id,
        subject: subject,
        text: text,
        status: status,
        creationDate: creationDate,
        completionDate: completionDate
    };

    tasks.push(newTask);

    taskForm.reset();
    renderTable();
});

generateRandomButton.addEventListener('click', function() {
    generateRandomTasks(10);
    renderTable();
});

function renderTable() {
    taskTableBody.innerHTML = '';

    tasks.forEach(task => {
        const row = taskTableBody.insertRow();

        const properties = ['id', 'subject', 'text', 'status', 'creationDate', 'completionDate'];

        properties.forEach(property => {
            row.insertCell().textContent = task[property];
        });

        const optionsCell = row.insertCell();

        const editButton = document.createElement('button');
        editButton.textContent = 'Editovat';
        editButton.addEventListener('click', function() {
            fillForm(task);
        });
        optionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Odstranit';
        deleteButton.addEventListener('click', function() {
            deleteTask(task.id);
        });
        optionsCell.appendChild(deleteButton);
    });
}

function fillForm(task) {
    const formFields = ['subject', 'text', 'status', 'creationDate', 'completionDate'];

    formFields.forEach(field => {
        document.getElementById(field).value = task[field];
    });

    document.getElementById('taskForm').setAttribute('data-task-id', task.id);
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTable();
}
function generateRandomTasks(num) {
    const startingId = getNextId();
    const firstNames = ['Adam', 'Alex', 'Alice', 'Anna', 'Bob', 'Chris', 'David', 'Emma', 'Frank', 'Grace'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];

    for (let i = 0; i < num; i++) {
        const id = startingId + i;
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const subject = `Předmět ${id}`; 
        const text = `${firstName} ${lastName}`;
        const statusOptions = ['Nový', 'Probíhající', 'Dokončený'];
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        const creationDate = getRandomDate(new Date(2020, 0, 1), new Date());
        const completionDate = status === 'Dokončený' ? getRandomDate(new Date(2020, 0, 1), new Date()) : '';

        const newTask = {
            id: id,
            subject: subject,
            text: text,
            status: status,
            creationDate: creationDate,
            completionDate: completionDate
        };

        tasks.push(newTask);
    }
}

function generateRandomNames(num) {
    const names = [];
    const firstNames = ['Adam', 'Alex', 'Alice', 'Anna', 'Bob', 'Chris', 'David', 'Emma', 'Frank', 'Grace'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];

    for (let i = 0; i < num; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName}`; 
        names.push(fullName);
    }

    return names;
}

function getRandomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
}
function getNextId() {
    if (tasks.length === 0) {
        return 1;
    }
    const maxId = Math.max(...tasks.map(task => task.id));
    return maxId + 1;
}
const headers = document.querySelectorAll('#taskTable th');

headers.forEach((header, index) => {
    header.addEventListener('click', function() {
        sortTasks(index);
        renderTable();
    });
});

function sortTasks(columnIndex) {
    switch (columnIndex) {
        case 0:
            tasks.sort((a, b) => idSortAsc ? a.id - b.id : b.id - a.id);
            idSortAsc = !idSortAsc;
            break;
        case 1:
            tasks.sort((a, b) => subjectSortAsc ? a.subject.localeCompare(b.subject, undefined, { numeric: true }) : b.subject.localeCompare(a.subject, undefined, { numeric: true }));
            subjectSortAsc = !subjectSortAsc;
            break;
        case 2:
            tasks.sort((a, b) => textSortAsc ? a.text.localeCompare(b.text, undefined, { numeric: true }) : b.text.localeCompare(a.text, undefined, { numeric: true }));
            textSortAsc = !textSortAsc;
            break;
        case 3:
            tasks.sort((a, b) => statusSortAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status));
            statusSortAsc = !statusSortAsc;
            break;
        case 4:
            tasks.sort((a, b) => creationDateSortAsc ? new Date(a.creationDate) - new Date(b.creationDate) : new Date(b.creationDate) - new Date(a.creationDate));
            creationDateSortAsc = !creationDateSortAsc;
            break;
        case 5:
            tasks.sort((a, b) => {
                if (!a.completionDate && b.completionDate) return completionDateSortAsc ? 1 : -1;
                if (!b.completionDate && a.completionDate) return completionDateSortAsc ? -1 : 1;
                return completionDateSortAsc ? new Date(a.completionDate) - new Date(b.completionDate) : new Date(b.completionDate) - new Date(a.completionDate);
            });
            completionDateSortAsc = !completionDateSortAsc;
            break;
        default:
            break;
    }
}
renderTable();