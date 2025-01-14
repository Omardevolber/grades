// grade.js

// دالة تسجيل الخروج
function logout() {
    sessionStorage.clear(); // مسح جميع بيانات الجلسة
    window.location.href = 'index.html'; // إعادة التوجيه إلى صفحة التسجيل
}

// رابط API الخاص بك
const fetchApiUrl = "https://s7qtq56dvg.execute-api.us-east-1.amazonaws.com/prod/fetch";

const resultDiv = document.getElementById('result');
const spinner = document.getElementById('spinner');
const usernameSpan = document.getElementById('username');

function fetchData() {
    const username = sessionStorage.getItem('userId'); // الحصول على اسم المستخدم من sessionStorage

    if (!username) {
        resultDiv.innerHTML = `<p class="error">لا يوجد اسم مستخدم في sessionStorage.</p>`;
        window.location.href = 'index.html'; // إعادة التوجيه إلى صفحة التسجيل
        return;
    }

    // عرض اسم المستخدم في الهيدر
    usernameSpan.textContent = username;

    spinner.style.display = 'block';

    fetch(fetchApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username })
    })
    .then(response => response.json())
    .then(apiResponse => {
        spinner.style.display = 'none';
        console.log("Response from Lambda:", apiResponse);

        if (!apiResponse.body) {
            resultDiv.innerHTML = `<p class="error">لا توجد نتائج لتظهر الآن.</p>`;
            return;
        }

        let parsedData;
        try {
            parsedData = JSON.parse(apiResponse.body);
        } catch(e) {
            resultDiv.innerHTML = `<p class="error">خطأ في تحليل البيانات: ${e}</p>`;
            return;
        }

        if (!parsedData.success) {
            resultDiv.innerHTML = `<p class="error">لا توجد نتائج للعرض لهذا المستخدم.</p>`;
            return;
        }

        const data = parsedData.data;

        if (!data || Object.keys(data).length === 0) {
            resultDiv.innerHTML = `<p class="error">لا توجد بيانات لعرضها.</p>`;
            return;
        }

        // مسح المحتوى السابق
        resultDiv.innerHTML = "";

        // المرور على كل مادة
        for (let subject in data) {
            if (data.hasOwnProperty(subject)) {
                const grades = data[subject];

                // إنشاء كونتينر للمادة
                const subjectContainer = document.createElement('div');
                subjectContainer.classList.add('subject-container');

                // إنشاء عنوان للمادة
                const subjectHeader = document.createElement('h3');
                subjectHeader.textContent = `${subject} :مادة `;
                subjectContainer.appendChild(subjectHeader);

                // إنشاء جدول للدرجات
                const table = document.createElement('table');
                table.classList.add('grades-table');

                // رأس الجدول
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');

                const thDate = document.createElement('th');
                thDate.textContent = "تاريخ النتيجة";
                const thGrade = document.createElement('th');
                thGrade.textContent = "الدرجة";

                headerRow.appendChild(thDate);
                headerRow.appendChild(thGrade);
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // جسم الجدول
                const tbody = document.createElement('tbody');

                grades.forEach(gradeEntry => {
                    const row = document.createElement('tr');

                    const tdDate = document.createElement('td');
                    tdDate.textContent = gradeEntry.date || "غير متوفر";

                    const tdGrade = document.createElement('td');
                    tdGrade.textContent = gradeEntry.grade || "غير متوفر";

                    row.appendChild(tdDate);
                    row.appendChild(tdGrade);
                    tbody.appendChild(row);
                });

                table.appendChild(tbody);
                subjectContainer.appendChild(table);

                // إضافة الكونتينر إلى النتيجة
                resultDiv.appendChild(subjectContainer);
            }
        }
    })
    .catch(err => {
        console.error("Fetch error:", err);
        spinner.style.display = 'none';
        resultDiv.innerHTML = `<p class="error">حدث خطأ أثناء جلب البيانات: ${err.message}</p>`;
    });
}

// استدعاء fetchData فور تحميل الصفحة
window.addEventListener('load', fetchData);
