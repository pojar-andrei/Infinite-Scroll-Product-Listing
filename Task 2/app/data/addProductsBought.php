<?php

$data = file_get_contents("php://input");
$data = json_decode($data);
$productsName = mysql_real_escape_string($data->ProductsName);
$totalPrice = mysql_real_escape_string($data->TotalPrice);

$con = mysqli_connect('localhost','root','','task2');
 
if (!$con)
{
  die('Could not connect: ' . mysql_error());
}
 
$query = "CREATE TABLE IF NOT EXISTS productsBuy(PID INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(PID), ProductsName VARCHAR(1000), TotalPrice INT(20) );";

$comments = mysqli_query($con,$query);

if (mysqli_query($comments)) {
    echo "Table MyGuests created successfully";
} else {
    echo "Error creating table: " . mysqli_error($conn);
}

$query = "INSERT INTO `productsBuy`(`ProductsName`, `TotalPrice`) VALUES ('".$productsName."',".$totalPrice.")";

$comments = mysqli_query($con,$query);

mysqli_close($con);
?>

