<?php
/**
 * Su dung cho cac chuc nang lien quan den tieng Viet
 */

/**
 * @desc Code for convert UTF to VNI
 */
$chars_NCR_VNI = array(
	273=>'ñ', 272=>'Ñ', 225=>'aù', 224=>'aø', 7843=>'aû', 227=>'aõ', 7841=>'aï', 259=>'aê', 7855=>'aé',
	7857=>'aè', 7859=>'aú', 7861=>'aü', 7863=>'aë', 226=>'aâ', 7845=>'aá', 7847=>'aà', 7849=>'aå', 7851=>'aã',
	7853=>'aä', 233=>'eù', 232=>'eø', 7867=>'eû', 7869=>'eõ', 7865=>'eï', 234=>'eâ', 7871=>'eá', 7873=>'eà',
	7875=>'eå', 7877=>'eã', 7879=>'eä', 237=>'í', 236=>'ì', 7881=>'æ', 297=>'ó', 7883=>'ò', 243=>'où',
	242=>'oø', 7887=>'oû', 245=>'oõ', 7885=>'oï', 7899=>'ôù', 7901=>'ôø', 7903=>'ôû', 7905=>'ôõ', 7907=>'ôï',
	417=>'ô', 244=>'oâ', 7889=>'oá', 7891=>'oà', 7893=>'oå', 7895=>'oã', 7897=>'oä', 250=>'uù', 249=>'uø',
	7911=>'uû', 361=>'uõ', 7909=>'uï', 7913=>'öù', 7915=>'öø', 7917=>'öû', 7919=>'öõ', 7921=>'öï', 432=>'ö',
	253=>'yù', 7923=>'yø', 7927=>'yû', 7929=>'yõ', 7925=>'î', 193=>'AÙ', 192=>'AØ', 7842=>'AÛ', 195=>'AÕ',
	7840=>'AÏ', 258=>'AÊ', 7854=>'AÉ', 7856=>'AÈ', 7858=>'AÚ', 7860=>'AÜ', 7862=>'AË', 194=>'AÂ', 7844=>'AÁ',
	7846=>'AÀ', 7848=>'AÅ', 7850=>'AÃ', 7852=>'AÄ', 201=>'EÙ', 200=>'EØ', 7866=>'EÛ', 7868=>'EÕ', 7864=>'EÏ',
	202=>'EÂ', 7870=>'EÁ', 7872=>'EÀ', 7874=>'EÅ', 7876=>'EÃ', 7878=>'EÄ', 205=>'Í', 204=>'Ì', 7880=>'Æ',
	296=>'Ó', 7882=>'Ò', 211=>'OÙ', 210=>'OØ', 7886=>'OÛ', 213=>'OÕ', 7884=>'OÏ', 7898=>'ÔÙ', 7900=>'ÔØ',
	7902=>'ÔÛ', 7904=>'ÔÕ', 7906=>'ÔÏ', 416=>'Ô', 212=>'OÂ', 7888=>'OÁ', 7890=>'OÀ', 7892=>'OÅ', 7894=>'OÃ',
	7896=>'OÄ', 218=>'UÙ', 217=>'UØ', 7910=>'UÛ', 360=>'UÕ', 7908=>'UÏ', 431=>'Ö', 7912=>'ÖÙ', 7914=>'ÖØ',
	7916=>'ÖÛ', 7918=>'ÖÕ', 7920=>'ÖÏ', 221=>'YÙ', 7922=>'YØ', 7926=>'YÛ', 7928=>'YÕ', 7924=>'Î');
/**
 * @desc Code for convert UTF to VNO (tieng Viet ko dau)
 */
$chars_NCR_VN0 = array(
	273=>'d', 272=>'D', 225=>'a', 224=>'a', 7843=>'a', 227=>'a', 7841=>'a', 259=>'a', 7855=>'a',
	7857=>'a', 7859=>'a', 7861=>'a', 7863=>'a', 226=>'a', 7845=>'a', 7847=>'a', 7849=>'a', 7851=>'a',
	7853=>'a', 233=>'e', 232=>'e', 7867=>'e', 7869=>'e', 7865=>'e', 234=>'e', 7871=>'e', 7873=>'e',
	7875=>'e', 7877=>'e', 7879=>'e', 237=>'i', 236=>'i', 7881=>'i', 297=>'i', 7883=>'i', 243=>'o',
	242=>'o', 7887=>'o', 245=>'o', 7885=>'o', 7899=>'o', 7901=>'o', 7903=>'o', 7905=>'o', 7907=>'o',
	417=>'o', 244=>'o', 7889=>'o', 7891=>'o', 7893=>'o', 7895=>'o', 7897=>'o', 250=>'u', 249=>'u',
	7911=>'u', 361=>'u', 7909=>'u', 7913=>'u', 7915=>'u', 7917=>'u', 7919=>'u', 7921=>'u', 432=>'u',
	253=>'y', 7923=>'y', 7927=>'y', 7929=>'y', 7925=>'y', 193=>'A', 192=>'A', 7842=>'A', 195=>'A',
	7840=>'A', 258=>'A', 7854=>'A', 7856=>'A', 7858=>'A', 7860=>'A', 7862=>'A', 194=>'A', 7844=>'A',
	7846=>'A', 7848=>'A', 7850=>'A', 7852=>'A', 201=>'E', 200=>'E', 7866=>'E', 7868=>'E', 7864=>'E',
	202=>'E', 7870=>'E', 7872=>'E', 7874=>'E', 7876=>'E', 7878=>'E', 205=>'I', 204=>'I', 7880=>'I',
	296=>'I', 7882=>'I', 211=>'O', 210=>'O', 7886=>'O', 213=>'O', 7884=>'O', 7898=>'O', 7900=>'O',
	7902=>'O', 7904=>'O', 7906=>'O', 416=>'O', 212=>'O', 7888=>'O', 7890=>'O', 7892=>'O', 7894=>'O',
	7896=>'O', 218=>'U', 217=>'U', 7910=>'U', 360=>'U', 7908=>'U', 431=>'U', 7912=>'U', 7914=>'U',
	7916=>'U', 7918=>'U', 7920=>'U', 221=>'Y', 7922=>'Y', 7926=>'Y', 7928=>'Y', 7924=>'Y');

class VNCode {
	/**
	 *@return int
	 *@desc Tra ve phan tu str[index] va tang index len 1
	 */
	function _nextCode($str, &$index){
		if ($index >= strlen($str)) return 0;
		return ord($str[$index++]);
	}
	
	/**
	 * @return string
	 * @desc Doi chuoi tu dang UTF-8 sang dang Decimal
	 */
	function UTF8_NCR($str){
		$result = '';
		$len = strlen($str);
		for($i=0;$i<$len;){
			$code = VNCode::_nextCode($str,$i);
			if (($code & 0xF0) == 0xF0){//11110000, 4 byte
				$b1 = $code & 0x07; //111
				$code = VNCode::_nextCode($str,$i);
				$b2 = $code & 0x3F; //111111
				$code = VNCode::_nextCode($str,$i);
				$b3 = $code & 0x3F; //111111
				$code = VNCode::_nextCode($str,$i);
				$b4 = $code & 0x3F; //111111
				$code = ((((($b1 << 6) | $b2) << 6) | $b3) << 6) | $b4;
				$result .= '&#'.$code.';';
			}elseif (($code & 0xE0) == 0xE0){//1110000, 3 byte
				$b1 = $code & 0x0F; //1111
				$code = VNCode::_nextCode($str,$i);
				$b2 = $code & 0x3F; //111111
				$code = VNCode::_nextCode($str,$i);
				$b3 = $code & 0x3F; //111111
				$code = ((($b1 << 6) | $b2) << 6) | $b3;
				$result .= '&#'.$code.';';
			}elseif (($code & 0xC0) == 0xC0){//1100000, 2 byte
				$b1 = $code & 0x1F; //11111
				$code = VNCode::_nextCode($str,$i);
				$b2 = $code & 0x3F; //111111
				$code = ($b1 << 6) | $b2;
				$result .= '&#'.$code.';';
			}else{
				$result .= chr($code);
			}
		}
		return $result;
	}
	
	/**
	 * @return string
	 * @desc Doi chuoi tu VNI sang khong dau Tieng Viet
	 */
	function VNI_VN0($s)
	{
		global $chars_NCR_VNI, $chars_NCR_VN0;
		foreach ($chars_NCR_VNI as $k => $si) {
			$s = str_replace($si,$chars_NCR_VN0[$k],$s);
		}
		return $s;
	}
	
	/**
	 * @return string
	 * @desc Doi chuoi tu dang UTF8 sang dang VNI
	 */
	function UTF8VNI($str){
		global $chars_NCR_VNI;
		$result = '';
		$len = strlen($str);
		for($i=0;$i<$len;){
			$code = VNCode::_nextCode($str,$i);
			if (($code & 0xF0) == 0xF0){//11110000, 4 byte
				$b1 = $code & 0x07; //111
				$code = VNCode::_nextCode($str,$i);
				$b2 = $code & 0x3F; //111111
				$code = VNCode::_nextCode($str,$i);
				$b3 = $code & 0x3F; //111111
				$code = VNCode::_nextCode($str,$i);
				$b4 = $code & 0x3F; //111111
				$code = ((((($b1 << 6) | $b2) << 6) | $b3) << 6) | $b4;
				$result .= isset($chars_NCR_VNI[$code]) ? $chars_NCR_VNI[$code] : chr($code);
			}elseif (($code & 0xE0) == 0xE0){//1110000, 3 byte
				$b1 = $code & 0x0F; //1111
				$code = VNCode::_nextCode($str,$i);
				$b2 = $code & 0x3F; //111111
				$code = VNCode::_nextCode($str,$i);
				$b3 = $code & 0x3F; //111111
				$code = ((($b1 << 6) | $b2) << 6) | $b3;
				$result .= isset($chars_NCR_VNI[$code]) ? $chars_NCR_VNI[$code] : chr($code);
			}elseif (($code & 0xC0) == 0xC0){//1100000, 2 byte
				$b1 = $code & 0x1F; //11111
				$code = VNCode::_nextCode($str,$i);
				$b2 = $code & 0x3F; //111111
				$code = ($b1 << 6) | $b2;
				$result .= isset($chars_NCR_VNI[$code]) ? $chars_NCR_VNI[$code] : chr($code);
			}else{
				$result .= chr($code);
			}
		}
		return $result;
	}
	
	/**
	 * Convert UTF to VNO (tieng Viet ko dau)
	 */
	function UTF8VN0($str){
		global $chars_NCR_VN0;
		$result = '';
		$len = strlen($str);
		for($i=0;$i<$len;){
			$code = VNCode::_nextCode($str,$i);
			if (($code & 0xF0) == 0xF0){//11110000, 4 byte
				$b1 = $code & 0x07; //111
				$code = VNCode::_nextCode($str,$i);
				$b2 = $code & 0x3F; //111111
				$code = VNCode::_nextCode($str,$i);
				$b3 = $code & 0x3F; //111111
				$code = VNCode::_nextCode($str,$i);
				$b4 = $code & 0x3F; //111111
				$code = ((((($b1 << 6) | $b2) << 6) | $b3) << 6) | $b4;
				$result .= isset($chars_NCR_VN0[$code]) ? $chars_NCR_VN0[$code] : '?';
			}elseif (($code & 0xE0) == 0xE0){//1110000, 3 byte
				$b1 = $code & 0x0F; //1111
				$code = VNCode::_nextCode($str,$i);
				$b2 = $code & 0x3F; //111111
				$code = VNCode::_nextCode($str,$i);
				$b3 = $code & 0x3F; //111111
				$code = ((($b1 << 6) | $b2) << 6) | $b3;
				$result .= isset($chars_NCR_VN0[$code]) ? $chars_NCR_VN0[$code] : '?';
			}elseif (($code & 0xC0) == 0xC0){//1100000, 2 byte
				$b1 = $code & 0x1F; //11111
				$code = VNCode::_nextCode($str,$i);
				$b2 = $code & 0x3F; //111111
				$code = ($b1 << 6) | $b2;
				$result .= isset($chars_NCR_VN0[$code]) ? $chars_NCR_VN0[$code] : '?';
			}else{
				$result .= chr($code);
			}
		}
		return $result;
	}

	/**
	 * @return string
	 * @desc Doi chuoi tu dang Decimal sang dang UTF-8
	 */
	function NCR_VNI($str){
		global $chars_NCR_VNI;
		$str = trim($str);
		$len = strlen($str);
		$result = '';
		for($i=0;$i<$len;$i++){
			$n = '';
			if ($str[$i] == '&'){
				$k = $i+1;
				if ($k < $len && $str[$k] == '#'){
					$k++;
					while ($k < $len && is_numeric($str[$k]))
						$n .= $str[$k++];
					if ($k < $len && $str[$k]==';')
						$i = $k;
				}
			}
			if ($n!=''){
				$n = intval($n);
				$result .= isset($chars_NCR_VNI[$n]) ? $chars_NCR_VNI[$n] : '?';
			}else
			{
				$result .= $str[$i];
			}
		}
		return $result;
	}

	/**
	 * @return string
	 * @desc Doi chuoi tu dang Decimal sang dang UTF-8
	 */
	function NCR_UTF8($str){
		$len = strlen($str);
		$result = '';
		for($i=0;$i<$len;$i++){
			$n = '';
			if ($str[$i] == '&'){
				$k = $i+1;
				if ($k < $len && $str[$k] == '#'){
					$k++;
					while ($k < $len && is_numeric($str[$k]))
						$n .= $str[$k++];
					if ($k < $len && $str[$k]==';')
						$i = $k;
				}
			}
			if ($n!=''){
				$n = intval($n);
				$s = '';
				$first = 0;
				$mask = 0x80;
				while ($n>0){
					$byte = $n & 0x3F; //00111111
					$n = $n >> 6;
					if ($n) $s = chr($byte | 0x80).$s;
					$first = $first | $mask;
					$mask  = $mask >> 1;
				}
				$s = chr($first | $byte).$s;
				$result .= $s;
			}else
				$result .= $str[$i];
		}
		return $result;
	}

	/**
	 * @return int
	 * @desc Tra ve vi tri that cua chu cai thu index trong chuoi unicode UTF-8
	 */
	function indexUTF8($data, $index){
		$len = strlen($data);
		if ($len==0) return 0;
		for($i=0, $j=0;$i<$len && $j<$index;$j++){
			$code = ord($data{$i++});
			if (($code & 0xF0) == 0xF0){//11110000, 4 byte
				$i += 3;
			}elseif (($code & 0xE0) == 0xE0){//1110000, 3 byte
				$i += 2;
			}elseif (($code & 0xC0) == 0xC0){//1100000, 2 byte
				$i += 1;
			}
		}
		return ($i ? $i-1 : 0);
	}
	
	/**
	 * @return string
	 * @desc Correct a string UTF-8 (error cause by some char is cuted at the end)
	 */
	function correctUTF8($data){
		$len = strlen($data);
		if ($len>=3){
			$code = ord($data{$len-3});
			if (($code & 0xF0) == 0xF0) return substr($data,0,$len-3);
			$code = ord($data{$len-2});
			if (($code & 0xE0) == 0xE0) return substr($data,0,$len-2);
			$code = ord($data{$len-1});
			if (($code & 0xC0) == 0xC0) return substr($data,0,$len-1);
		}
		return $data;
	}
	
	/**
	 * @return string
	 * @desc Correct a string NCR (error cause by some char code >127 and < 255 isnot converted)
	 */
	function correctNCR($data){
		for ($i=128;$i<256;$i++)
			$data = str_replace(chr($i),"&#$i;",$data);
		return $data;
	}
	
	/**
	 * @return string
	 * @desc Cat mot string ngan lai de vua mot cot nho
	 */
	function trunstrword($str, $trunsize=0){
		$size = ($trunsize)? $trunsize : 20;
		if (strlen($str)<=$size) return $str;
		$len = strlen($str);
		for ($r=VNCode::indexUTF8($str,$size); $r<$len && $str[$r]!=' ' && $r<$size+10;$r++);
	
		$s2 = substr($str, 0, $r);
		if (strlen($s2)<strlen($str))
			$s2.='...';
		return $s2;
	}
	
	/**
	 * @return int
	 * @desc Tra ve vi tri that cua chu cai thu index trong chuoi unicode NCR
	 */
	function indexNCR($data, $index){
		$p = 0;
		$len = strlen($data);
		for($i=0;$i<$len && $p<$index;$i++){
			$p++;
			if ($data[$i] == '&'){
				$k = $i+1;
				if ($k<$len && $data[$k] == '#'){
					$k++;
					while ($k<$len && is_numeric($data[$k])) $k++;
					if ($k<$len && $data[$k]==';') $i = $k;
				}
			}
		}
		return $i;
	}
	
	/**
	 * @return int
	 * @desc Tra ve do dai chuoi unicode NCR
	 */
	function strlenNCR($data){
		$p = 0;
		$len = strlen($data);
		for($i=0;$i<$len;$i++){
			$p++;
			if ($data[$i] == '&'){
				$k = $i+1;
				if ($k<$len && $data[$k] == '#'){
					$k++;
					while ($k<$len && is_numeric($data[$k])) $k++;
					if ($k<$len && $data[$k]==';') $i = $k;
				}
			}
		}
		return $p;
	}
	/**
	 * Convert string in NCRx to UTF-8
	 * (NCRx has format --xxx; is an character which has ASCCI code is xxx)
	 */
	function NCRx_UTF8($str){
		$len = strlen($str);
		$result = '';
		$ln=0;
		for($i=0;$i<$len;$i++){
			$n = '';
			if ($str[$i] == '-'){
				$k = $i+1;
				if ($k < $len && $str[$k] == '-'){
					$k++;
					while ($k < $len && is_numeric($str[$k]))
						$n .= $str[$k++];
					if ($k < $len && $str[$k]==';')
						$i = $k;
				}
			}
			if ($n!=''){
				$n = intval($n);
				if ($n==13 || $n==10){
					$result .= $ln?'':'<br>';
					$ln = 1;
				}elseif ($n<128){
					$result .= chr($n);
					$ln = 0;
				}else{
					$s = '';
					$first = 0;
					$mask = 0x80;
					while ($n>0){
						$byte = $n & 0x3F; //00111111
						$n = $n >> 6;
						if ($n) $s = chr($byte | 0x80).$s;
						$first = $first | $mask;
						$mask  = $mask >> 1;
					}
					$s = chr($first | $byte).$s;
					$result .= $s;
					$ln = 0;
				}
			}else{
				$result .= $str[$i];
				$ln = 0;
			}
		}
		return $result;
	}
}
?>