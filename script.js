// الحصول على العناصر من DOM
const funeralTableBody = document.getElementById('funeralTableBody');
const funeralForm = document.getElementById('funeralForm');
const showAllCheckbox = document.getElementById('showAll');

// تحميل البيانات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', loadFunerals);

// وظيفة إظهار/إخفاء نموذج إضافة جنازة
function toggleForm() {
    const form = document.getElementById('funeral-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// وظيفة إضافة جامع جديد
function addNewMosque() {
    const mosqueName = prompt('أدخل اسم الجامع الجديد:');
    if (mosqueName) {
        const mosqueSelect = document.getElementById('mosque');
        const newOption = document.createElement('option');
        newOption.value = mosqueName;
        newOption.textContent = mosqueName;
        mosqueSelect.appendChild(newOption);
        saveMosques();
    }
}

// وظيفة إضافة مقبرة جديدة
function addNewCemetery() {
    const cemeteryName = prompt('أدخل اسم المقبرة الجديدة:');
    if (cemeteryName) {
        const cemeterySelect = document.getElementById('cemetery');
        const newOption = document.createElement('option');
        newOption.value = cemeteryName;
        newOption.textContent = cemeteryName;
        cemeterySelect.appendChild(newOption);
        saveCemeteries();
    }
}

// وظيفة حفظ قائمة الجوامع في LocalStorage
function saveMosques() {
    const mosqueSelect = document.getElementById('mosque');
    const mosques = Array.from(mosqueSelect.options).map(option => option.value);
    localStorage.setItem('mosques', JSON.stringify(mosques));
}

// وظيفة حفظ قائمة المقابر في LocalStorage
function saveCemeteries() {
    const cemeterySelect = document.getElementById('cemetery');
    const cemeteries = Array.from(cemeterySelect.options).map(option => option.value);
    localStorage.setItem('cemeteries', JSON.stringify(cemeteries));
}

// وظيفة تحميل قائمة الجوامع من LocalStorage
function loadMosques() {
    const mosques = JSON.parse(localStorage.getItem('mosques'));
    if (mosques && mosques.length > 0) {
        const mosqueSelect = document.getElementById('mosque');
        mosqueSelect.innerHTML = ''; // مسح الخيارات الحالية
        mosques.forEach(mosque => {
            const option = document.createElement('option');
            option.value = mosque;
            option.textContent = mosque;
            mosqueSelect.appendChild(option);
        });
    }
}

// وظيفة تحميل قائمة المقابر من LocalStorage
function loadCemeteries() {
    const cemeteries = JSON.parse(localStorage.getItem('cemeteries'));
    if (cemeteries && cemeteries.length > 0) {
        const cemeterySelect = document.getElementById('cemetery');
        cemeterySelect.innerHTML = ''; // مسح الخيارات الحالية
        cemeteries.forEach(cemetery => {
            const option = document.createElement('option');
            option.value = cemetery;
            option.textContent = cemetery;
            cemeterySelect.appendChild(option);
        });
    }
}

// وظيفة إضافة جنازة
function addFuneral() {
    const idNumber = document.getElementById('idNumber').value.trim();
    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    const mosque = document.getElementById('mosque').value;
    const time = document.getElementById('time').value;
    const cemetery = document.getElementById('cemetery').value;
    const gender = document.getElementById('gender').value;
    const graveNumber = document.getElementById('graveNumber').value.trim();
    const rowNumber = document.getElementById('rowNumber').value.trim();
    const status = document.getElementById('status').value;
    const notes = document.getElementById('notes').value.trim();

    // التحقق من عدم تكرار رقم الهوية
    let funerals = JSON.parse(localStorage.getItem('funerals')) || [];
    if (funerals.some(funeral => funeral.idNumber === idNumber)) {
        alert('رقم الهوية موجود بالفعل. يرجى إدخال رقم هوية مختلف.');
        return;
    }

    const funeral = {
        idNumber,
        name,
        age,
        mosque,
        time,
        cemetery,
        gender,
        graveNumber,
        rowNumber,
        status,
        notes,
        date: new Date().toLocaleDateString()
    };

    // إضافة الجنازة إلى LocalStorage
    funerals.push(funeral);
    localStorage.setItem('funerals', JSON.stringify(funerals));

    // تحديث الجدول
    displayFunerals();

    // إعادة تعيين النموذج وإخفائه
    funeralForm.reset();
    toggleForm();
}

// وظيفة عرض الجنائز في الجدول
function displayFunerals() {
    funeralTableBody.innerHTML = '';
    let funerals = JSON.parse(localStorage.getItem('funerals')) || [];

    // التحقق من خيار عرض جميع الجنائز
    if (!showAllCheckbox.checked) {
        // تصفية الجنائز لتظهر جنائز اليوم فقط
        const today = new Date().toLocaleDateString();
        funerals = funerals.filter(funeral => funeral.date === today);
    }

    funerals.forEach((funeral, index) => {
        const row = funeralTableBody.insertRow();
        row.insertCell(0).textContent = funeral.idNumber;
        row.insertCell(1).textContent = funeral.name;
        row.insertCell(2).textContent = funeral.age;
        row.insertCell(3).textContent = funeral.mosque;
        row.insertCell(4).textContent = funeral.time;
        row.insertCell(5).textContent = funeral.cemetery;
        row.insertCell(6).textContent = funeral.gender;
        row.insertCell(7).textContent = funeral.graveNumber;
        row.insertCell(8).textContent = funeral.rowNumber;
        row.insertCell(9).textContent = funeral.status;
        row.insertCell(10).textContent = funeral.notes;

        const editCell = row.insertCell(11);
        const editButton = document.createElement('button');
        editButton.textContent = 'تعديل';
        editButton.onclick = () => editFuneral(index);
        editCell.appendChild(editButton);

        const deleteCell = row.insertCell(12);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف';
        deleteButton.onclick = () => deleteFuneral(index);
        deleteCell.appendChild(deleteButton);
    });
}

// وظيفة تحميل الجنائز من LocalStorage عند فتح الصفحة
function loadFunerals() {
    loadMosques();      // تحميل قائمة الجوامع أولاً
    loadCemeteries();   // تحميل قائمة المقابر
    displayFunerals();
}

// وظيفة تعديل جنازة
function editFuneral(index) {
    let funerals = JSON.parse(localStorage.getItem('funerals')) || [];
    const funeral = funerals[index];

    document.getElementById('idNumber').value = funeral.idNumber;
    document.getElementById('name').value = funeral.name;
    document.getElementById('age').value = funeral.age;
    document.getElementById('mosque').value = funeral.mosque;
    document.getElementById('time').value = funeral.time;
    document.getElementById('cemetery').value = funeral.cemetery;
    document.getElementById('gender').value = funeral.gender;
    document.getElementById('graveNumber').value = funeral.graveNumber;
    document.getElementById('rowNumber').value = funeral.rowNumber;
    document.getElementById('status').value = funeral.status;
    document.getElementById('notes').value = funeral.notes;

    // إزالة الجنازة من القائمة لتعديلها
    funerals.splice(index, 1);
    localStorage.setItem('funerals', JSON.stringify(funerals));

    displayFunerals();
    toggleForm();
}

// وظيفة حذف جنازة
function deleteFuneral(index) {
    let funerals = JSON.parse(localStorage.getItem('funerals')) || [];
    if (confirm('هل أنت متأكد من حذف هذه الجنازة؟')) {
        funerals.splice(index, 1);
        localStorage.setItem('funerals', JSON.stringify(funerals));
        displayFunerals();
    }
}

// وظيفة طباعة جدول الجنائز
function printTable() {
    const originalContent = document.body.innerHTML;
    const printContent = document.getElementById('funeral-list').innerHTML;

    // إنشاء عنصر مؤقت لإخفاء أزرار التعديل والحذف
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = printContent;
    tempDiv.querySelectorAll('button').forEach(button => button.style.display = 'none');

    document.body.innerHTML = tempDiv.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;

    // إعادة تحميل البيانات بعد الطباعة
    loadFunerals();
}

// وظيفة تنزيل البيانات كملف CSV
function downloadData() {
    let csvContent = "رقم الهوية,الاسم,العمر,اسم الجامع,الفترة,المقبرة,الجنس,رقم القبر,رقم الصف,الحالة,ملاحظات\n";
    let funerals = JSON.parse(localStorage.getItem('funerals')) || [];

    // التحقق من خيار عرض جميع الجنائز
    if (!showAllCheckbox.checked) {
        // تصفية الجنائز لتظهر جنائز اليوم فقط
        const today = new Date().toLocaleDateString();
        funerals = funerals.filter(funeral => funeral.date === today);
    }

    funerals.forEach(funeral => {
        const data = [
            funeral.idNumber,
            funeral.name,
            funeral.age,
            funeral.mosque,
            funeral.time,
            funeral.cemetery,
            funeral.gender,
            funeral.graveNumber,
            funeral.rowNumber,
            funeral.status,
            funeral.notes
        ];
        // تضمين القيم بين علامات تنصيص مزدوجة للتعامل مع الفواصل داخل النصوص
        csvContent += '"' + data.join('","') + '"\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    const fileName = `funerals_${new Date().toLocaleDateString()}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// تحديث عرض الجنائز عند تغيير خيار "عرض جميع الجنائز"
showAllCheckbox.addEventListener('change', displayFunerals);

// وظيفة فتح صفحة متابعة الحالة
function openStatusPage() {
    window.open('status.html', '_blank');
}
