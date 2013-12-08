<?php
/**
 * Zo2 (http://www.zo2framework.org)
 * A powerful Joomla template framework
 *
 * @link        http://www.zo2framework.org
 * @link        http://github.com/aploss/zo2
 * @author      ZooTemplate <http://zootemplate.com>
 * @copyright   Copyright (c) 2013 APL Solutions (http://apl.vn)
 * @license     GPL v2
 */
defined('_JEXEC') or die;

class JFormFieldFont extends JFormField
{
    protected $type = 'Font';

    /**
     * Get the html for input
     *
     * @return string
     */
    public function getInput()
    {
        $document = Zo2Document::getInstance();
        $document->addScript(ZO2RTP_ASSETS_VENDOR  . '/fontselect/jquery.fontselect.js');
        $document->addScript(ZO2RTP_ASSETS_VENDOR  . '/bootstrap/addons/bootstrap-colorpicker/js/bootstrap-colorpicker.js');
        $document->addStyleSheet(ZO2RTP_ASSETS_VENDOR  . '/fontselect/fontselect.css');
        $document->addStyleSheet(ZO2RTP_ASSETS_VENDOR  . '/bootstrap/addons/bootstrap-colorpicker/css/bootstrap-colorpicker.css');

        $path = JPATH_SITE.'/plugins/system/zo2/html/formfields/font.php';
        ob_start();
        include($path);
        $html = ob_get_contents();
        ob_end_clean();
        return $html;
    }

    public function getLabel()
    {
        switch($this->fieldname)
        {
            case 'body_font': return 'Body';
            case 'h1_font': return 'Headline H1';
            case 'h2_font': return 'Headline H2';
            case 'h3_font': return 'Headline H3';
            case 'h4_font': return 'Headline H4';
            case 'h5_font': return 'Headline H5';
            case 'h6_font': return 'Headline H6';
            default: return '';
        }
    }
}
