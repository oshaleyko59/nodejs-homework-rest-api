Продовжуємо створення REST API для роботи з колекцією контактів. Додайте верифікацію email користувача.

# Як процес верифікації повинен працювати
Після реєстрації, користувач повинен отримати лист на вказану при реєстрації пошту з посиланням для верифікації свого email
Пройшовши посиланням в отриманому листі, в перший раз, користувач повинен отримати Відповідь зі статусом 200, що буде мати на увазі успішну верифікацію email
Пройшовши по посиланню повторно користувач повинен отримати Помилку зі статусом 404

# Крок 1
Підготовка інтеграції з SendGrid API
+ ПРИМІТКА Як альтернативу SendGrid можна використовувати пакет nodemailer

# Крок 2
   # Створення ендпоінта для верифікації email
+ Додати в модель User два поля verificationToken і verify. Значення поля verify рівне false означатиме, що його email ще не пройшов верифікацію

# створити ендпоінт GET [/users/verify/:verificationToken](# verification-request), де по параметру verificationToken ми будемо шукати користувача в моделі User
+ якщо користувач з таким токеном не знайдений, необхідно повернути Помилку 'Not Found'
+ якщо користувач знайдений - встановлюємо verificationToken в null, а поле verify ставимо рівним true в документі користувача і повертаємо Успішний відповідь

Verification request
GET /auth/verify/:verificationToken

+ Verification user Not Found T
Status: 404 Not Found
ResponseBody: {
  message: 'User not found'
}
+ Verification success response
Status: 200 OK
ResponseBody: {
  message: 'Verification successful',
}

Крок 3
Додавання відправки email користувачу з посиланням для верифікації
При створення користувача при реєстрації:
   # створити verificationToken для користувача і записати його в БД (для генерації токена використовуйте пакет uuid або nanoid)
   # відправити email на пошту користувача і вказати посилання для верифікації email'а ( /users/verify/:verificationToken) в повідомленні
   # необхідно враховувати, що тепер логін користувача не дозволено, якщо не верифікувано email

Крок 4
Додавання повторної відправки email користувачу з посиланням для верифікації @ POST /users/verify
Отримує body в форматі {email}
+ Якщо в body немає обов'язкового поля email, повертає json з ключем {"message":"missing required field email"} і статусом 400
+ Якщо з body все добре, виконуємо повторну відправку листа з verificationToken на вказаний email, але тільки якщо користувач не верифікований
+ Якщо користувач вже пройшов верифікацію відправити json з ключем {"message":"Verification has already been passed"} зі статусом 400 Bad Request

Resending a email request
POST /users/verify
Content-Type: application/json
RequestBody: {
  "email": "example@example.com"
}

+ email validation error
Status: 400 Bad Request
Content-Type: application/json
ResponseBody: <Помилка від Joi або іншої бібліотеки валідації>

Resending a email success response
+ Status: 200 Ok
Content-Type: application/json
ResponseBody: {
  "message": "Verification email sent"
}
Resend request for verified user
+ Status: 400 Bad Request
Content-Type: application/json
ResponseBody: {
  message: "Verification has already been passed"
}


Додаткове завдання - необов'язкове
1. Напишіть dockerfile для вашої програми
