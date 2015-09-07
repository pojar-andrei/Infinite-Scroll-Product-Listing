<?php

$con = mysqli_connect('localhost','root','','task2');
 
if (!$con)
{
  die('Could not connect: ' . mysql_error());
}
 
$query = "SELECT * FROM `products` LIMIT 0 , 20";

$comments = mysqli_query($con,$query);

$products = array();

while($row = mysqli_fetch_array($comments, MYSQL_ASSOC))
{
  $title = $row['title'];
  $price = $row['price'];
  $img_url = $row['img_url'];
  $category = $row['category'];
  
  $arrayAdd =  array('title' => $title,'price' => $price,'img_url' => $img_url,'category' => $category);
  array_push($products, $arrayAdd);
}

echo json_encode($products);
mysqli_close($con);

?>