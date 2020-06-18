<?php

$sendEmail = "post@cis.by";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $type = trim($_POST["type"]);

    if ($type == "callbackForm") {
        $nameUser = trim($_POST["callbackClientName"]);
        $phone = trim($_POST["clientPhone"]);
        $userMessage = trim($_POST["callbackClientMessage"]);

        if (empty($nameUser)) {
            $nameUser = "не указано";
        }

        if (empty($userMessage)) {
            $userMessage = "без сообщения";
        }

        $subject = "Обратный звонок $phone";

        $email_content = "
                <html>
                <head>
                <title>Обратный звонок</title>
                </head>
                <body>
                    <p style='margin:5px 0;'>Имя клиента: $nameUser</p>
                    <p style='margin:5px 0;'>Телефон: <a href='tel:$phone'> $phone</a></p>
                    <p style='margin:5px 0;'>Сообщение: $userMessage</p>
                </body>
                 </html>
            ";

        sendMail($sendEmail, $subject, $email_content);
    } else if ($type == "contactUsForm") {
        $nameUser = trim($_POST["clientName"]);
        $clientMail = trim($_POST["clientMail"]);
        $userMessage = trim($_POST["clientMessage"]);

        if (empty($nameUser)) {
            $nameUser = "не указано";
        }

        $subject = "Обратная связь $clientMail";

        $email_content = "
                <html>
                <head>
                <title>Ответ на почту</title>
                </head>
                <body>
                    <p style='margin:5px 0;'>Имя клиента: $nameUser</p>
                    <p style='margin:5px 0;'>Телефон: <a href='mailto:$clientMail'> $clientMail</a></p>
                    <p style='margin:5px 0;'>Сообщение: $userMessage</p>
                </body>
                 </html>
            ";

        sendMail($sendEmail, $subject, $email_content);
    }
} else {
    http_response_code(403);
    echo "Произошла ошибка, у вас нет прав доступа, попробуйте позже.";
}

function sendMail($email, $subject, $email_content)
{
    $email_headers = "From: cis.by <form@cis.by>";
    $email_headers .= "" . "\r\n";
    $email_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

    if (mail($email, $subject, $email_content, $email_headers)) {
        http_response_code(200);
    } else {
        http_response_code(500);
    }
}
