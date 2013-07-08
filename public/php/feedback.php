<?php
    // Set mailing parameters
    // include file looks like this:
    // ini_set("SMTP","your_server");
    // ini_set("smtp_port","25");
    // ini_set("sendmail_from","email_address");
    // $to = "email@company.com";
    include "inc.feedback.php";

    // Get referrer and browser arguments
    $browser = get_browser(null, true);

    // Get post arguments
    $name = trim($_REQUEST['inputName']);
    $email = trim($_REQUEST['inputEmail']);
    $url = trim($_REQUEST['inputURL']);
    $comment = trim($_REQUEST['inputFeedback']);

    $subject = "GeoPortal Feedback";

    $message = "From: " . $name . " <" . $email . ">\n";
    $message .= 'URL: <a href="' . $url . '">' + $url + "</a>\n';
    $message .= "OS: " . $browser["platform"] . "\n";
    $message .= "Browser: " . $browser["parent"] . "\n";
    $message .= $comment;

    // Send the mail
    mail($to, $subject, $message, $headers);

?>
