<?php
require_once ($_SERVER['DOCUMENT_ROOT'] . "/functions.php");

$success = false;

$user_name = clean_data($_GET['username']);
$user_password = clean_data($_GET['password']);

$result = $mysqli->query("SELECT * FROM users WHERE user_name='$user_name'");

if ($result->num_rows != 0) {
    $user = $result->fetch_assoc();
    if (password_verify($user_password, $user['user_password'])) {
        $_SESSION['ip'] = ip() = $ip;
        $_SESSION['user_name'] = $user['user_name'] = $username;
        $_SESSION['user_active'] = $user['user_active'];
        $_SESSION['user_type'] = $user['user_type'];
        $_SESSION['logged_in'] = true;

        $text = date('Y-m-d H:i:s') . '	:	' . $ip . '	:	' . $username . PHP_EOL;
        $file = fopen("ip-login.txt", "a+");
        fwrite($file, $text);
        $success = true;
    }
}

if ($success) {
    $out = ["status" => true, "username" => $username];
    echo json_encode($out);
} else {
    $out = ["status" => false];
    echo json_encode($out);
}
