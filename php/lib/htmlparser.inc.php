<?php

global $HTML_ATTRIBUTE_STAND_ALONE;
$HTML_ATTRIBUTE_STAND_ALONE = array('checked','compact','declare','defer','disabled','ismap','multiple','nohref','noresize','noshade','nowrap','readonly','selected');

/*
 * Copyright (c) 2003 Jose Solorzano.  All rights reserved.
 * Redistribution of source must retain this copyright notice.
 *
 * Jose Solorzano (http://jexpert.us) is a software consultant.
 *
 * Contributions by:
 * - Leo West (performance improvements)
 */

define ("NODE_TYPE_START",0);
define ("NODE_TYPE_ELEMENT",1);
define ("NODE_TYPE_ENDELEMENT",2);
define ("NODE_TYPE_TEXT",3);
define ("NODE_TYPE_COMMENT",4);
define ("NODE_TYPE_DONE",5);

/**
 * Class HTMLParser.
 * To use, create an instance of the class passing
 * HTML text. Then invoke parse() until it's false.
 * When parse() returns true, $iNodeType, $iNodeName
 * $iNodeValue and $iNodeAttributes are updated.
 *
 * To create an HTMLParser instance you may also
 * use convenience functions HTMLParser_ForFile
 * and HTMLParser_ForURL.
 */
class HTMLParser {

    /**
     * Field iNodeType.
     * May be one of the NODE_TYPE_* constants above.
     */
    var $iNodeType;

    /**
     * Field iNodeName.
     * For elements, it's the name of the element.
     */
    var $iNodeName = "";

    /**
     * Field iNodeValue.
     * For text nodes, it's the text.
     */
    var $iNodeValue = "";

    /**
     * Field iNodeAttributes.
     * A string-indexed array containing attribute values
     * of the current node. Indexes are always lowercase.
     */
    var $iNodeAttributes;

    // The following fields should be 
    // considered private:

    var $iHtmlText;
    var $iHtmlTextLength;
    var $iHtmlTextIndex = 0;
    var $iHtmlCurrentChar;

    /**
     * Constructor.
     * Constructs an HTMLParser instance with
     * the HTML text given.
     */
    function HTMLParser ($aHtmlText) {
        $this->iHtmlText = $aHtmlText;
        $this->iHtmlTextLength = strlen($aHtmlText);
        $this->setTextIndex (0);
    }

    /**
     * Method parse.
     * Parses the next node. Returns false only if
     * the end of the HTML text has been reached.
     * Updates values of iNode* fields.
     */
    function parse() {
        $text = trim($this->skipToElement());
        if ($text != "") {
            $this->iNodeType = NODE_TYPE_TEXT;
            $this->iNodeName = "Text";
            $this->iNodeValue = $text;
            $this->iNodeAttributes = 0;
            return true;
        }
        return $this->readTag();
    }

    function clearAttributes() {
        $this->iNodeAttributes = array();
    }

    function readTag() {
    	global $HTML_ATTRIBUTE_STAND_ALONE;
        if ($this->iCurrentChar != "<") {
            $this->iNodeType = NODE_TYPE_DONE;
            return false;
        }
        $this->skipInTag (array("<"));
        $this->clearAttributes();
        $name = $this->skipToBlanksInTag();
        $pos = strpos($name, "/");
        if ($pos === 0) {
            $this->iNodeType = NODE_TYPE_ENDELEMENT;
            $this->iNodeName = substr ($name, 1);
            $this->iNodeValue = "";
        } 
        else {
            if (!$this->isValidTagIdentifier ($name)) {
                $comment = false;
                if ($name == "!--") {
                    $rest = $this->skipToStringInTag ("-->");    
                    if ($rest != "") {
                        $this->iNodeType = NODE_TYPE_COMMENT;
                        $this->iNodeName = "Comment";
                        $this->iNodeValue = "<" . $name . $rest;
                        $comment = true;
                    }
                }
                if (!$comment) {
                    $this->iNodeType = NODE_TYPE_TEXT;
                    $this->iNodeName = "Text";
                    $this->iNodeValue = "<" . $name;
                }
                return true;
            }
            else {
                $this->iNodeType = NODE_TYPE_ELEMENT;
                $this->iNodeValue = "";
                $nameLength = strlen($name);
                if ($nameLength > 0 && substr($name, $nameLength - 1, 1) == "/") {
                	$this->iNodeName = substr($name, 0, $nameLength - 1);
                }else {
                    $this->iNodeName = $name;
                }
                $this->iNodeName = strtolower($this->iNodeName);
            } 
        }
        while ($this->skipBlanksInTag()) {
            $attrName = $this->skipToBlanksOrEqualsInTag();
            if ($attrName != "") {
				$attrName = strtolower($attrName);
				if (array_search($attrName, $HTML_ATTRIBUTE_STAND_ALONE)!==false){
					$this->iNodeAttributes[$attrName] = 1;
				}else{
	                $this->skipBlanksInTag();
	                if ($this->iCurrentChar == "=") {
	                    $this->skipEqualsInTag();
	                    $this->skipBlanksInTag();
	                    $value = $this->readValueInTag();
	                    $this->iNodeAttributes[$attrName] = $value;
	                }else {
	                    $this->iNodeAttributes[$attrName] = "";
	                }
				}
            }
        }
        $this->skipEndOfTag();
        return true;            
    }

    function isValidTagIdentifier ($name) {
        return preg_match ("/[A-Za-z0-9]+/", $name);
    }
    
    function skipBlanksInTag() {
        return "" != ($this->skipInTag (array (" ", "\t", "\r", "\n" )));
    }

    function skipToBlanksOrEqualsInTag() {
        return $this->skipToInTag (array (" ", "\t", "\r", "\n", "=" ));
    }

    function skipToBlanksInTag() {
        return $this->skipToInTag (array (" ", "\t", "\r", "\n" ));
    }

    function skipEqualsInTag() {
        return $this->skipInTag (array ( "=" ));
    }

    function readValueInTag() {
        $ch = $this->iCurrentChar;
        $value = "";
        if ($ch == "\"") {
            $this->skipInTag (array ( "\"" ));
            $value = $this->skipToInTag (array ( "\"" ));
            $this->skipInTag (array ( "\"" ));
        }
        else if ($ch == "'") {
            $this->skipInTag (array ( "'" ));
            $value = $this->skipToInTag (array ( "'" ));
            $this->skipInTag (array ( "'" ));
        }                
        else {
            $value = $this->skipToBlanksInTag();
        }
        return $value;
    }

    function setTextIndex ($index) {
        $this->iHtmlTextIndex = $index;
        if ($index >= $this->iHtmlTextLength) {
            $this->iCurrentChar = -1;
        }
        else {
            $this->iCurrentChar = $this->iHtmlText{$index};
        }
    }

    function moveNext() {
        if ($this->iHtmlTextIndex < $this->iHtmlTextLength) {
            $this->setTextIndex ($this->iHtmlTextIndex + 1);
            return true;
        }
        else {
            return false;
        }
    }

    function skipEndOfTag() {
        $sb = "";
        if (($ch = $this->iCurrentChar) !== -1) {
            $match = ($ch == ">");
            if (!$match) {
                return $sb;
            }
            $sb .= $ch;
            $this->moveNext();
        }
        return $sb;
    }

    function skipInTag ($chars) {
        $sb = "";
        while (($ch = $this->iCurrentChar) !== -1) {
            if ($ch == ">") {
                return $sb;
            } else {
                if (array_search($ch,$chars) === false)
                	return $sb;
                $sb .= $ch;
                $this->moveNext();
            }
        }
        return $sb;
    }

    function skipToInTag ($chars) {
        $sb = "";
        while (($ch = $this->iCurrentChar) !== -1) {
        	if ($ch == '>' || array_search($ch,$chars) !== false)
               	return $sb;
            $sb .= $ch;
            $this->moveNext();
        }
        return $sb;
    }

    function skipToElement() {
        $sb = "";
        while (($ch = $this->iCurrentChar) !== -1) {
            if ($ch == "<") {
                return $sb;
            }
            $sb .= $ch;
            $this->moveNext();
        }
        return $sb;             
    }

    /**
     * Returns text between current position and $needle,
     * inclusive, or "" if not found. The current index is moved to a point
     * after the location of $needle, or not moved at all
     * if nothing is found.
     */
    function skipToStringInTag ($needle) {
        $pos = strpos ($this->iHtmlText, $needle, $this->iHtmlTextIndex);
        if ($pos === false) {
            return "";
        }
        $top = $pos + strlen($needle);
        $retvalue = substr ($this->iHtmlText, $this->iHtmlTextIndex, $top - $this->iHtmlTextIndex);
        $this->setTextIndex ($top);
        return $retvalue;
    }
}

class HTMLFileParser extends HTMLParser {
	function HTMLFileParser($fileName){
	    $fp = fopen ($fileName, "r");
	    $content = "";
	    while (true) {
	        $data = fread ($fp, 8192);
	        if (strlen($data) == 0) {
	            break;
	        }
	        $content .= $data;
	    }
	    fclose ($fp);
		$this->HTMLParser($content);
	}
}

class HTMLURLParser extends HTMLParser {
	function HTMLURLParser($url){
	    $fp = fopen ($url, "r");
	    $content = "";
	    while (true) {
	        $data = fread ($fp, 8192);
	        if (strlen($data) == 0) {
	            break;
	        }
	        $content .= $data;
	    }
	    fclose ($fp);
		$this->HTMLParser(file_get_contents($content));
	}
}

class TreeHTML{
	var $type = array();
	var $name = array();
	var $value = array();
	var $attribute = array();
	var $field = array();
	var $addText='';

	/**
	 * @return array
	 * @desc Tao mot tree node cac phan tu cua HTML
	 */
	function TreeHTML($parser, $file=true){
	    $i = 0;
	    if ($file){
		    while ($parser->parse())
		    	if (strtolower($parser->iNodeName)=='body') break;
	    }
	    while ($parser->parse()){
	    	if ($parser->iNodeType == NODE_TYPE_ENDELEMENT && strtolower($parser->iNodeName)=='body' && $file) break;

	    	$this->type[$i] = $parser->iNodeType;
	    	$this->name[$i] = $parser->iNodeName;
	    	if ($parser->iNodeType == NODE_TYPE_TEXT)
	    		$this->value[$i] = $parser->iNodeValue;
	    	if ($parser->iNodeType == NODE_TYPE_ELEMENT){
	    		$this->attribute[$i] = $parser->iNodeAttributes;
	    		if (isset($parser->iNodeAttributes['name'])){
	    			$this->field[$i] = trim($parser->iNodeAttributes['name'],"\"' ");
	    		}
	    		if (   ($file && $parser->iNodeName == 'input' && isset($this->attribute[$i]['type']) && $this->attribute[$i]['type']=='text' && !isset($this->attribute[$i]['onkeydown']))
	    			|| ($file && $parser->iNodeName == 'textarea'))
	    			$this->attribute[$i]['onkeyup'] = 'initTyper(this)';
	    	}
	    	$i++;
	    }
	}
	
	/**
	 * @desc Them hoac sua field co ten $name mot thuoc tinh $attr
	 */
	function set($name,$attr, $value){
		$index = array_search($name, $this->field);
		if (!$index) return;
		$this->attribute[$index][$attr] = $value;
	}
	
	/**
	 * @desc Tra ve thuoc tinh $attr cua field $name
	 */
	function get($name,$attr){
		$index = array_search($name, $this->field);
		if ($index && isset($this->attribute[$index][$attr]))
			return $this->attribute[$index][$attr];
		return '';
	}
	
	/**
	 * @desc Tra ve ten cua tag HTML ung voi field $name
	 */
	function getTag($name){
		$index = array_search($name, $this->field);
		//if (!isset($this->name[$index])) {debug($name);debug($index);}
		return $this->name[$index];
	}
	
	/**
	 * @desc Tra ve cac thuoc tinh gom tabindex, size, maxlength
	 */
	function getAll($name){
		$index = array_search($name, $this->field);
		if ($index){
			$t = '';
			if (isset($this->attribute[$index]['tabindex']))
				$t .= ' tabindex='.$this->attribute[$index]['tabindex'];
			if (isset($this->attribute[$index]['size']))
				$t .= ' size='.$this->attribute[$index]['size'];
			if (isset($this->attribute[$index]['maxlength']))
				$t .= ' maxlength='.$this->attribute[$index]['maxlength'];
			return $t;
		}
		return '';
	}
	
	/**
	 * @desc Thay doi node ten $name thanh text voi noi dung $text
	 */
	function replace($name,$text){
		$index = array_search($name, $this->field);
		if (!$index) return;
		$this->removeIndex($index);
		$this->type[$index] = NODE_TYPE_TEXT;
		$this->value[$index] = $text;
	}
	
	/**
	 * @desc Thay doi node ten $name thanh text voi noi dung $text
	 */
	function remove($name){
		$index = array_search($name, $this->field);
		if (!$index) return;
		if (!isset($this->name[$index])) return;//echo "Remove: $name <br>";
		$rname = $this->name[$index];
		$len = count($this->name);
		for ($end=$index+1;$end<$len;$end++){
			if (isset($this->name[$end]) && $this->name[$end] == $rname) break;
		}
		if (isset($this->type[$end]) && $this->type[$end]==NODE_TYPE_ENDELEMENT){
			for ($i=$index;$i<=$end;$i++) $this->removeIndex($i);
		}else
			$this->removeIndex($index);
	}
	
	/**
	 * @desc Private: Xoa 1 object trong tree
	 */
	function removeIndex($index){
		$this->type[$index]=-1;
		unset($this->field[$index]);
		unset($this->name[$index]);
		unset($this->value[$index]);
		unset($this->attribute[$index]);
	}
	
	/**
	 * @return string
	 * @desc Create a string HTML from a tree<br>
	 * An Item have format ($iNodeType, $iNodeName, $iNodeValue, $iNodeAttributes)
	 */
	function toHTML(){
		global $HTML_ATTRIBUTE_STAND_ALONE;
		$result = '';
		$type = &$this->type;
		$name = &$this->name;
		$valu = &$this->value;
		$attr = &$this->attribute;
		
		$len = count($type);
		for ($i=0; $i<$len;$i++){
			$str = '';
			switch($type[$i]){
				case NODE_TYPE_ELEMENT:
					if ($name[$i] != 'textarea'){
						$str .= '<'.$name[$i];
						if (isset($attr[$i])) foreach($attr[$i] as $key => $value){
							if (array_search($value,$HTML_ATTRIBUTE_STAND_ALONE)!==false)
								$str .= " $key";
							else
								$str .= " $key=\"$value\"";
						}
						$str .= '>';
					}else{//is tag ATEXTAREA
						$content = '';
						$str .= '<'.$name[$i];
						if (isset($attr[$i])) foreach($attr[$i] as $key => $value){
							if ($key == 'value')
								$content = $value;
							elseif (array_search($value,$HTML_ATTRIBUTE_STAND_ALONE)!==false)
								$str .= " $key";
							else
								$str .= " $key=\"$value\"";
						}
						$str .= '>'.$content;
					}
					break;
				case NODE_TYPE_ENDELEMENT:
					$str .= '</'.$name[$i].'>';
					break;
				case NODE_TYPE_TEXT:
					$str = $valu[$i];
					break;
			}
			$result .= $str;
			//if (isset($nobu[$i])) $result .= $nobu[$i];
		}
		return ($result.$this->addText);
	}

	/**
	 * @desc Set all input text to readonly
	 */
	function setReadonlyAll(){
		foreach ($this->name as $i => $name){
			if ($name == 'input' && isset($this->attribute[$i]['type'])){
				switch($this->attribute[$i]['type']){
				case 'text':
				 	$this->attribute[$i]['readonly'] = 'true';
				 	$this->attribute[$i]['style'] = 'border: 1 dotted #999999';
				 	break;
				case 'select':
				case 'checkbox':
					$this->attribute[$i]['disabled'] = 1;
					break;
				}
			}elseif ($name == 'textarea'){
			 	$this->attribute[$i]['readonly'] = 'true';
			 	$this->attribute[$i]['style'] = 'border: 1 dotted #999999';
			}
		}
		
	}
	/**
	 * @desc Set an input text to readonly
	 */
	function setReadonly($name){
		$index = array_search($name, $this->field);
		if (!$index) return;
		$this->attribute[$index]['readonly'] = true;
		$this->attribute[$index]['style'] = 'border: 1 dotted #999999';
	}
	
	
}
?>