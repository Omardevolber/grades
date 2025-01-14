document.getElementById('indexForm').addEventListener('submit', function(e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageElement = document.getElementById('message');

    // تنظيف الرسائل السابقة
    messageElement.innerText = '';
    messageElement.style.color = 'red';

    // التحقق من صحة المدخلات
    if (!username || !password) {
        messageElement.innerText = 'يرجى ملء جميع الحقول المطلوبة.';
        return;
    }

    // إعداد بيانات تسجيل الدخول
    const data = { username, password };

    // استبدل هذا URL برابط الـ API الخاص بك
    const apiUrl = 'https://enfwd06lxd.execute-api.us-east-1.amazonaws.com/prod/signin'; // <--- قم بتعديل هذا السطر

    // إرسال البيانات إلى API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // إرسال البيانات بشكل JSON
    })
    .then(response => response.json())
    .then(data => {
        let responseBody;

        try {
            responseBody = JSON.parse(data.body);
        } catch (error) {
            console.error('Error parsing response body:', error);
            messageElement.innerText = 'حدث خطأ في معالجة الاستجابة. حاول مرة أخرى.';
            return;
        }

        if (data.statusCode === 200 && responseBody.message === 'Success') {
            // حفظ الـ ID و Username في sessionStorage
            sessionStorage.setItem('userId', responseBody.id);
            sessionStorage.setItem('username', username);

            messageElement.style.color = 'green';
            messageElement.innerText = 'تم تسجيل الدخول بنجاح! سيتم توجيهك إلى لوحة التحكم.';
            // الانتظار لبضع ثوانٍ قبل التوجيه
            window.location.href = 'home.html'; // تأكد من وجود صفحة dashboard.html
        } else if (data.statusCode === 400) {
            // استخراج الرسالة من body
            try {
                const errorBody = JSON.parse(data.body);
                messageElement.innerText = errorBody.message || 'خطأ في تسجيل الدخول.';
            } catch (e) {
                messageElement.innerText = 'خطأ في تسجيل الدخول.';
            }
        } else {
            // استخراج الرسالة من body
            try {
                const errorBody = JSON.parse(data.body);
                messageElement.innerText = errorBody.message || 'حدث خطأ غير متوقع. حاول مرة أخرى.';
            } catch (e) {
                messageElement.innerText = 'حدث خطأ غير متوقع. حاول مرة أخرى.';
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageElement.innerText = 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى لاحقاً.';
    });
});

document.getElementById('indexForm').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // منع السلوك الافتراضي للضغط على Enter
        document.getElementById('indexForm').requestSubmit(); // إرسال النموذج
    }
});