// تعريف CONFIG بشكل عالمي مع إعدادات Cognito فقط
const CONFIG = {
    app: {
      userPoolId: "us-east-1_ANIwHUagf",
      clientId: "27eatr098n0g9ijslehe9djufs",
      redirectUri: "https://mohasibfriend.github.io/Mohasib-Friend/home.html",
    },
  };
  
  // تحميل jQuery وتنفيذ منطق Cognito عند جاهزية DOM
  (function loadjQueryAndInitialize() {
    if (typeof jQuery === "undefined") {
      const script = document.createElement("script");
      script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
      script.onload = function () {
        initializeApp();
      };
      script.onerror = function () {
        console.error("فشل في تحميل jQuery.");
      };
      document.head.appendChild(script);
    } else {
      $(document).ready(function () {
        initializeApp();
      });
    }
  })();
  
  function initializeApp() {
    // التعامل مع رد الاتصال من Cognito (OAuth2 Callback)
    handleCognitoCallback();
  }
  
  /**
   * التعامل مع رد الاتصال من Cognito (OAuth2 Callback)
   */
  async function handleCognitoCallback() {
    const queryParams = getQueryParams();
    const authCode = queryParams.code;
  
    if (authCode) {
      try {
        const { clientId, redirectUri } = CONFIG.app;
  
        // طلب الحصول على access token باستخدام رمز التفويض
        const tokenResponse = await fetch(
          "https://us-east-1fhfklvrxm.auth.us-east-1.amazoncognito.com/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=authorization_code&client_id=${clientId}&code=${authCode}&redirect_uri=${encodeURIComponent(
              redirectUri
            )}`,
          }
        );
  
        if (!tokenResponse.ok) {
          throw new Error("فشل في الحصول على رمز الوصول.");
        }
  
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
  
        // جلب معلومات المستخدم باستخدام access token
        const userInfoResponse = await fetch(
          "https://us-east-1fhfklvrxm.auth.us-east-1.amazoncognito.com/oauth2/userInfo",
          {
            method: "GET", // تم تعديل الطريقة من POST إلى GET كما هو مطلوب عادة
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
  
        if (!userInfoResponse.ok) {
          throw new Error("فشل في جلب معلومات المستخدم.");
        }
  
        const userInfo = await userInfoResponse.json();
        const userId = userInfo.sub;
  
        // الحصول على اسم المستخدم من userInfo
        const username = userInfo.email || userInfo.username;
  
        // تخزين userId و username في sessionStorage
        if (userId) {
          sessionStorage.setItem("userId", userId);
        }
  
        if (userInfo.username) {
          sessionStorage.setItem("username", userInfo.username);
        }
  
        // تخزين معلومات إضافية إذا كانت موجودة
        if (userInfo.name) {
          sessionStorage.setItem("name", userInfo.name);
        }
  
        if (userInfo.email) {
          sessionStorage.setItem("email", userInfo.email);
        }
  
        if (userInfo.phone_number) {
          sessionStorage.setItem("phone_number", userInfo.phone_number);
        }
  
        // تخزين accessToken في sessionStorage
        sessionStorage.setItem("accessToken", accessToken);
  
        console.log("تم جلب بيانات المستخدم وتخزينها في الجلسة.");
      } catch (error) {
        console.error("خطأ في التعامل مع رد الاتصال من Cognito:", error);
      }
    } else {
      console.warn("لا يوجد رمز تفويض في URL.");
      // يمكنك إضافة إعادة توجيه إلى صفحة تسجيل الدخول هنا إذا لزم الأمر
    }
  }
  
  /**
   * دالة مساعدة لاستخراج المعلمات من URL
   * @returns {object} - كائن يحتوي على أزواج المفتاح والقيمة للمعلمات
   */
  function getQueryParams() {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }
  