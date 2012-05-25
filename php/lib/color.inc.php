<?php
/**
 * Title: Library color function
 * Class: Color
 * Author: vietcom (vncommando at yahoo dot com)
 * Version: 1.0
 */
class Color{
	/**
	 * @desc Use only for function HSL2RGB()
	 */
	function _HSL_2_RGB( $v1, $v2, $vH ){
		if ( $vH < 0 ) $vH += 1;
		if ( $vH > 1 ) $vH -= 1;
		if ( ( 6 * $vH ) < 1 ) return ( $v1 + ( $v2 - $v1 ) * 6 * $vH );
		if ( ( 2 * $vH ) < 1 ) return ( $v2 );
		if ( ( 3 * $vH ) < 2 ) return ( $v1 + ( $v2 - $v1 ) * ( ( 2 / 3 ) - $vH ) * 6 );
		return ( $v1 );
	}
	/**
	 * @desc Convert HSL to RGB
	 * HSL values  = From 0 to 1
	 * RGB results = From 0 to 255
	 * Code from http://www.easyrgb.com/math.php?MATH=M19#text19
	 */
	function HSL2RGB($H, $S, $L, &$R, &$G, &$B){
		if ( $S == 0 ){
			$R = $L * 255;
			$G = $L * 255;
			$B = $L * 255;
		}else{
			$var_2 = ($L < 0.5)? ($L * ( 1 + $S )) : (( $L + $S ) - ( $S * $L ));
			$var_1 = 2 * $L - $var_2;
			$R = 255 * Color::_HSL_2_RGB( $var_1, $var_2, $H + ( 1 / 3 ) ) ;
			$G = 255 * Color::_HSL_2_RGB( $var_1, $var_2, $H );
			$B = 255 * Color::_HSL_2_RGB( $var_1, $var_2, $H - ( 1 / 3 ) );
		}
	}

	/**
	 * @desc Convert decimal color to #ffffff
	 */
	function RGB2HEX($r, $g, $b){
		$r = ($r<16)? '0'.dechex($r) : dechex($r);
		$g = ($g<16)? '0'.dechex($g) : dechex($g);
		$b = ($b<16)? '0'.dechex($b) : dechex($b);
		return "#$r$g$b";
	}

	/**
	 * @desc Convert color #ffffff to RGB
	 */
	function HEX2RGB($c){
		if (strlen($c)!=7) return 0;
		$r[] = hexdec($c{1}.$c{2});
		$r[] = hexdec($c{3}.$c{4});
		$r[] = hexdec($c{5}.$c{6});
		return $r;
	}

	/**
	 * @desc Genereate an array of n colors differents
	 */
	function getListColor($n){
		$h = 0;
		$s = 1;
		$l = 0.6;

		$d = 1/($n+1);
		$n2 = $n/2;
		$n3 = intval($n/3);
		$c = 1;
		for ($i=0;$i<$n;$i++){
			Color::HSL2RGB($h,$s,$l,$r,$g,$b);
			$color[] = Color::RGB2HEX($r,$g,$b);
			$h += 3*$d;
			if ($i % $n3==0){
				$h = ($c++)*$d;
				$s -= 0.1;
				$l -= 0.07;
			}
		}
		return $color;
	}
}
?>