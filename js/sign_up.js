document.getElementById('signUpForm').addEventListener('submit', function(e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    const id = document.getElementById('id').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageElement = document.getElementById('message');

    // تنظيف الرسائل السابقة
    messageElement.innerText = '';
    messageElement.style.color = 'red';

    // التحقق من صحة المدخلات
    if (!id || !username || !password) {
        messageElement.innerText = 'يرجى ملء جميع الحقول المطلوبة.';
        return;
    }

    // إعداد بيانات التسجيل
    const data = { id, username, password };

    // إرسال البيانات إلى API
    fetch('https://enfwd06lxd.execute-api.us-east-1.amazonaws.com/prod/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        const status = data.statusCode;
        let body;

        try {
            body = JSON.parse(data.body);
        } catch (e) {
            console.error('Error parsing response body:', e);
            messageElement.innerText = 'حدث خطأ في معالجة الاستجابة. حاول مرة أخرى.';
            return;
        }

        if (status === 200 && body.message === 'Success') {
            sessionStorage.setItem('userId', id);
            sessionStorage.setItem('username', username);

            messageElement.style.color = 'green';
            messageElement.innerText = 'تم التسجيل بنجاح! سيتم توجيهك إلى لوحة التحكم.';
            // الانتظار لبضع ثوانٍ قبل التوجيه
            window.location.href = 'home.html'; // تأكد من وجود صفحة dashboard.html

        } else if (status === 400) {
            messageElement.innerText = body.message || 'خطأ في التسجيل.';
        } else {
            messageElement.innerText = body.message || 'حدث خطأ غير متوقع. حاول مرة أخرى.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageElement.innerText = 'حدث خطأ أثناء التسجيل. حاول مرة أخرى لاحقاً.';
    });
});

document.getElementById('signUpForm').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // منع السلوك الافتراضي للضغط على Enter
        document.getElementById('signUpForm').requestSubmit(); // إرسال النموذج
    }
});