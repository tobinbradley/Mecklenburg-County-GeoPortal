<?php

/**
 * Set content header
 */
//header('Content-type: application/pdf');
//error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

/**
 * Load Dependecies
 */
require('lib/pdftable.inc.php');

$table1 = '
<table border=1 align=center>
  <tr> 
    <td rowspan=2 valign=middle border=0>rowspan=2, valign=middle</td>
    <td>Normal</td>
    <td>Normal</td>
    <td>Normal</td>
    <td colspan=2 rowspan=2 valign=bottom bgcolor=#FF00FF>colspan=2<br>rowspan=2<br>valign=bottom</td>
  </tr>
  <tr> 
    <td height=15>Normal</td>
    <td rowspan=2 align=right bgcolor=#aaaaaa border=0>rowspan=2</td>
    <td border=0>border=0</td>
  </tr>
  <tr> 
    <td><a href="test">Normal Link</a></td>
    <td>Normal</td>
    <td>Normal</td>
    <td rowspan=3 valign=top bgcolor=#CC3366>rowspan=3</td>
    <td>Normal</td>
  </tr>
  <tr bgcolor=#cccccc> 
    <td>Normal</td>
    <td colspan=3 align=center>align center, colspan=3</td>
    <td>Normal</td>
  </tr>
  <tr> 
    <td align=right valign=bottom>align=right<br>valign=bottom</td>
    <td>Normal</td>
    <td>&nbsp;</td>
    <td>Normal</td>
    <td height=20>height=20</td>
  </tr>
</table>
';

// GFT table ID



/**
 * Extend FPDF for header/footer/etc.
 */
class PDF extends PDFTable
{
    // Page footer
    function Footer()
    {
        // Position at 1.5 cm from bottom
        $this->SetY(-0.4);
        // Arial italic 8
        $this->SetFont('Arial','I',8);
        $this->SetTextColor(0,0,0); 
        // Page number
        $this->Cell(0,0,'Quality of Life Dashboard - http://maps.co.mecklenburg.nc.us/qoldashboard/',0,0,'C');
    }
}


$pdf = new PDFTable('P','mm','Letter');

/************************************************************/
/*                 Cover Page                               */
/************************************************************/


/************************************************************/
/*                 Map                                      */
/************************************************************/
$pdf->AddPage();



$x = -80.87102798082606;
$y = 35.18129099700963;
$zoom = 11; 

// Get map extent
$coords = file_get_contents("http://maps.co.mecklenburg.nc.us/rest/v1/ws_geo_projectpoint.php?format=json&fromsrid=4326&tosrid=2264&x=" . $x . "&y=" . $y);
$json = json_decode($coords, true);
$x = $json[rows][0][row][x_coordinate];
$y = $json[rows][0][row][y_coordinate];

$extent = array(
    19 => 400,
    18 => 400,
    17 => 500,
    16 => 700,
    15 => 1400,
    14 => 2800,
    13 => 5600,
    12 => 12000,
    11 => 50000,
    10 => 100000,
    9 => 100000
);

$finalExtent = array();
$finalExtent[0] = $x - $extent[$zoom];
$finalExtent[1] = $y - ($extent[$zoom] * 1.13);
$finalExtent[2] = $x + $extent[$zoom];
$finalExtent[3] = $y + ($extent[$zoom] * 1.13);

// Put map image (WMS) on page
$mapURL = "http://maps.co.mecklenburg.nc.us/geoserver/wms/reflect?layers=meckbase&width=800&bbox=" . implode(",", $finalExtent) . "&srs=EPSG:2264";
$pdf->Image($mapURL,5,5,205,270, "PNG");

$pdf->SetLineWidth(1);
$pdf->rect(4,4,207,272);


/************************************************************/
/*                 Tables                                   */
/************************************************************/
$pdf->AddPage();

$pdf->SetLineWidth(0.2);

$pdf->setfont('times','',12);
$pdf->htmltable($table1);
$pdf->Ln(5);
$pdf->SetX(0);
$pdf->htmltable($table1);
$pdf->Ln(5);
$pdf->SetX(0);
$pdf->htmltable($table1);
$pdf->Ln(5);
$pdf->SetX(0);
$pdf->htmltable($table1);
$pdf->Ln(5);
$pdf->SetX(0);



/************************************************************/
/*                 Output                                   */
/************************************************************/
$pdf->output();


?>