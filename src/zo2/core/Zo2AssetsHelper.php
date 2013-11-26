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
defined('_JEXEC') or die ('Restricted access');


/**
 * Zo2AssetsHelper is a class file, allows user to combine, compress, and manage static assets
 *
 * Class Zo2AssetsHelper
 */
class Zo2AssetsHelper {
    protected static $_currentCssPath = '';
    protected static $_oldCssPath = '';

    /**
     * Compare between two absolute path, and return relative path
     *
     * Taken from: http://goo.gl/gBRswQ
     *
     * @param $from
     * @param $to
     * @return string
     */
    public function getRelativePath($from, $to)
    {
        // some compatibility fixes for Windows paths
        $from = is_dir($from) ? rtrim($from, '\/') . '/' : $from;
        $to   = is_dir($to)   ? rtrim($to, '\/') . '/'   : $to;
        $from = str_replace('\\', '/', $from);
        $to   = str_replace('\\', '/', $to);

        $from     = explode('/', $from);
        $to       = explode('/', $to);
        $relPath  = $to;

        foreach ($from as $depth => $dir) {
            // find first non-matching dir
            if ($dir === $to[$depth]) {
                // ignore this directory
                array_shift($relPath);
            }
            else {
                // get number of remaining dirs to $from
                $remaining = count($from) - $depth;
                if ($remaining > 1) {
                    // add traversals up to first matching dir
                    $padLength = (count($relPath) + $remaining - 1) * -1;
                    $relPath = array_pad($relPath, $padLength, '..');
                    break;
                }
                else {
                    $relPath[0] = './' . $relPath[0];
                }
            }
        }
        return implode('/', $relPath);
    }

    /**
     * Convert a relative path to absolute path
     *
     * @param $base
     * @param $to
     * @return string
     */
    public function getAbsolutePath($base, $to)
    {
        if (is_file($base)) $base = dirname($base);
        if (substr($base, strlen($base) - 1, 1) !== DIRECTORY_SEPARATOR) $base .= DIRECTORY_SEPARATOR;
        return realpath($base . $to);
    }

    public static function fixCssUrl($style, $currentPath, $oldPath)
    {
        self::$_currentCssPath = $currentPath;
        self::$_oldCssPath = $oldPath;
        $pattern = '#url\([\'"]?([0-9a-zA-Z/.-]+)[\'"]?\)#';
        $style = preg_replace_callback($pattern, array('self', 'replaceCssUrl'), $style);

        // fix import url
        if (strpos($oldPath, '.less') !== false) {
            $importPattern = '#@import [\'"]+([0-9a-zA-Z/.-]+)[\'"]+#';
            $style = preg_replace_callback($importPattern, array('self', 'replaceCssImportUrl'), $style);
        }

        return $style;
    }

    public static function replaceCssUrl($matches)
    {
        if (isset($matches[1])) {
            $absPath = self::getAbsolutePath(self::$_oldCssPath, $matches[1]);

            $result = self::getRelativePath(self::$_currentCssPath, $absPath);

            return 'url(' . $result . ')';
        }
        else return $matches[0];
    }

    public static function replaceCssImportUrl($matches)
    {
        if (isset($matches[1])) {
            $absPath = self::getAbsolutePath(self::$_oldCssPath, $matches[1]);

            $result = self::getRelativePath(self::$_currentCssPath, $absPath);
            //var_dump(self::$_currentCssPath . ' vs ' . $absPath);die();

            return ' "' . $result . '"';
        }
        else return $matches[0];
    }

    public static function forcePutContent($path, $content)
    {
        $parts = explode(DIRECTORY_SEPARATOR, $path);
        $file = array_pop($parts);
        $dir = '';
        foreach($parts as $part) if(!is_dir($dir .= DIRECTORY_SEPARATOR . $part)) mkdir($dir);
        return file_put_contents($dir . DIRECTORY_SEPARATOR .$file, $content);
    }

    public static function moveCssImportToBeginning($style)
    {
        $pattern = '#@import [0-9a-zA-Z-\'"():/.?=+,]+;#';
        preg_match_all($pattern, $style, $matches);
        if (isset($matches[0]) && count($matches[0]) > 0) {
            $imports = $matches[0];
            $style = preg_replace($pattern, '', $style);

            $style = implode(' ', $imports) . "\n" . $style;
        }
        return $style;
    }
}