const funeralTableBody = document.getElementById('funeralTableBody');
const funeralForm = document.getElementById('funeralForm');

function toggleForm() {
    const form = document.getElementById('funeral-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addFuneral() {
    const mosque = document.getElementById('mosque').value;
    const time = document.getElementById('time').value;
    const menCount = document.getElementById('menCount').value;
    const womenCount = document.getElementById('womenCount').value;
    const childrenCount = document.getElementById('childrenCount').value;
    const notes = document.getElementById('notes').value;

    const row = funeralTableBody.insertRow();
    row.insertCell(0).textContent = mosque;
    row.insertCell(1).textContent = time;
    row.insertCell(2).textContent = menCount;
    row.insertCell(3).textContent = womenCount;
    row.insertCell(4).textContent = childrenCount;
    row.insertCell(5).textContent = notes;

    const editCell = row.insertCell(6);
    const editButton = document.createElement('button');
    editButton.textContent = 'تعديل';
    editButton.onclick = () => editFuneral(row);
    editCell.appendChild(editButton);

    const deleteCell = row.insertCell(7);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'حذف';
    deleteButton.onclick = () => deleteFuneral(row);
    deleteCell.appendChild(deleteButton);

    funeralForm.reset();
    toggleForm();
}

function editFuneral(row) {
    const cells = row.cells;
    document.getElementById('mosque').value = cells[0].textContent;
    document.getElementById('time').value = cells[1].textContent;
    document.getElementById('menCount').value = cells[2].textContent;
    document.getElementById('womenCount').value = cells[3].textContent;
    document.getElementById('childrenCount').value = cells[4].textContent;
    document.getElementById('notes').value = cells[5].textContent;
    row.remove();
    toggleForm();
}

function deleteFuneral(row) {
    row.remove();
}

function printTable() {
    const originalContent = document.body.innerHTML;
    const printContent = document.getElementById('funeral-list').innerHTML;

    // إخفاء أزرار التعديل والحذف قبل الطباعة
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = printContent;
    tempDiv.querySelectorAll('button').forEach(button => button.style.display = 'none');

    document.body.innerHTML = tempDiv.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
}

function addNewMosque() {
    const mosqueName = prompt('أدخل اسم الجامع الجديد:');
    if (mosqueName) {
        const mosqueSelect = document.getElementById('mosque');
        const newOption = document.createElement('option');
        newOption.value = mosqueName;
        newOption.textContent = mosqueName;
        mosqueSelect.appendChild(newOption);
    }
}