<?php
header ('Content-Type: image/png');
if(isset($_REQUEST['corner']))
{

	$type = isset($_REQUEST['type']) ? $_REQUEST['type'] : '';
	if(isset($_SESSION['corner'][$type]))
	{
		//echo $_SESSION['corner'][$type];
		//exit(0);
	}
	$pos = isset($_REQUEST['length']) ? $_REQUEST['length']  : 5;
	$length = $pos * 2;
	$im = imagecreatetruecolor($pos, $pos);
	// Make the background transparent
	imagecolortransparent($im, $black);
	$black = imagecolorallocate($im, 0, 0, 0);
	$border_color = imagecolorallocate($im, 35,142,35);
	switch($type)
	{
		case 'tl':
			imagefilledarc($im, $pos, $pos, $length, $length, 180, 270, $border_color,IMG_ARC_PIE);  break;
		case 'tr':
			imagefilledarc($im, 0, $pos, $length, $length, 270, 0, $border_color,IMG_ARC_PIE);  break;
		case 'bl':
			imagefilledarc($im, $pos, 0, $length, $length, 90, 180, $border_color,IMG_ARC_PIE);  break;
		case 'br':
			imagefilledarc($im, 0, 0, $length, $length, 0, 90, $border_color,IMG_ARC_PIE);  break;
		default :
			imagefill($im, 0, 0, $border_color);
		break;
	}
	ob_start();
		imagepng($im);
		$_SESSION['corner'][$type] = ob_get_contents();
	ob_end_flush();
	imagedestroy($im);
	exit(0);
}

$letter = isset($_REQUEST['letter']) ? $_REQUEST['letter'] : 'A ';

if( is_numeric($letter) )
	$letter = chr($letter);

$size = isset($_REQUEST['size']) ? $_REQUEST['size'] : 5;
$color = isset($_REQUEST['color']) ? $_REQUEST['color'] : 'text';

if(isset($_SESSION['letter'][$letter]))
{
	echo $_SESSION['letter'][$letter];
	exit(0);
}

if(file_exists($letter.'.png'))
{
	$im = imagecreatefrompng($letter.'.png');
}
else
{
	// Create a 55x30 image
	$im = imagecreatetruecolor(25, 25);
	$text = imagecolorallocate($im, 1, 0, 0);
	$black = imagecolorallocate($im, 0, 0, 0);
	$white = imagecolorallocate($im, 255, 255, 255);
	$red = imagecolorallocate($im, 255, 0, 0);

	// Make the background transparent
	imagecolortransparent($im, $black);


	// Draw a red rectangle
	if($size == 5)
		imagestring($im, $size, 9, 4, $letter, $$color);
	else
		imagestring($im, $size, 9, 12, $letter, $$color);
}


// Save the image
ob_start();
	imagepng($im);
	$_SESSION['letter'][$letter] = ob_get_contents();
ob_end_flush();
imagedestroy($im);
?>